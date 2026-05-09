import { AlreadyExistsError } from "@/common/domain/errors/usecases/already-exists.error";

import {
  Either,
  left,
  right,
} from "@/common/domain/errors/handle-errors/either";
import { EmailVO } from "@/common/domain/values-objects/email/email.vo";
import { PasswordVO } from "@/common/domain/values-objects/password/password.vo";

import { NotAllwedError } from "@/common/domain/errors/usecases/not-allwed.error";
import { PhoneVO } from "@/common/domain/values-objects/phone/phone.vo";
import { SlugVO } from "@/common/domain/values-objects/slug/slug.vo";
import { UUIDVO } from "@/common/domain/values-objects/uuidvo/uuid.vo";
import { BaseEncrypter } from "@/common/shared/auth/base-encrypter";
import { BaseBcryptHasher } from "@/common/shared/cryptography/base-bcrypt-hasher";
import { MembershipRole } from "@/common/shared/enums/member-ship-role.enum";
import { MembershipStatus } from "@/common/shared/enums/member-ship-status.enum";
import { LgpdConsentsEntity } from "../../domain/entities/lgpd-consents.entity";
import { MembershipEntity } from "../../domain/entities/member-ship.entity";
import { TenantEntity } from "../../domain/entities/tenant.entity";
import { UserProfileEntity } from "../../domain/entities/user-profile.entity";
import { UserEntity } from "../../domain/entities/user.entity";
import { TenantMapper } from "../../domain/mappers/tenant.mapper";
import { UserMapper } from "../../domain/mappers/user.mapper";
import { MembershipRepository } from "../../domain/repositories/member-ship.repository";
import { TokenRepository } from "../../domain/repositories/token-repository";
import { UserProfileRepository } from "../../domain/repositories/user-profile.repository";
import { UserRepository } from "../../domain/repositories/user.repository";
import { TenantSummaryDto } from "../dto/tenant.dto";
import { CreateUserProfileDto } from "../dto/user-profile.dto";
import { CreateUserDto, UserSummaryDto } from "../dto/user.dto";

export type RegisterCreateUseCaseResponse = Either<
  AlreadyExistsError,
  {
    user: UserSummaryDto;
    tenant: TenantSummaryDto;
  }
>;

export class RegisterCreateUseCase {
  static inject = [
    UserRepository,
    MembershipRepository,
    TokenRepository,
    BaseBcryptHasher,
    BaseEncrypter,
  ];

  constructor(
    private readonly usersRepository: UserRepository,
    private readonly membershipsRepository: MembershipRepository,
    private readonly tokensRepository: TokenRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly hasher: BaseBcryptHasher,
    private readonly jwt: BaseEncrypter,
  ) {}

  async execute(
    userInput: CreateUserDto,
    userProfileInput: CreateUserProfileDto,
  ): Promise<RegisterCreateUseCaseResponse> {
    const userEntity = await this.usersRepository.findByEmail(userInput.email);

    if (userEntity && userEntity.deletedAt !== null) {
      return left(
        new NotAllwedError({
          message: `User with email ${userEntity.email.getValue().value} does not exist`,
          fieldName: "email",
        }),
      );
    }

    // const password = new PasswordVO(input.passwordHash, this.hasher);
    const passwordHash = await this.hasher.hash(userInput.passwordHash, 12);

    const user = UserEntity.create({
      email: EmailVO.create(userInput.email),
      passwordHash: new PasswordVO(passwordHash),
    });

    const userProfile = UserProfileEntity.create({
      userId: user.id,
      firstName: userProfileInput.firstName,
      lastName: userProfileInput.lastName,
      fullName: `${userProfileInput.firstName} ${userProfileInput.lastName}`,
      displayName: userProfileInput.displayName,
      birthDate: userProfileInput.birthDate,
      phone: PhoneVO.create(userProfileInput.phone, {
        minLength: 10,
        maxLength: 11,
      }),
      avatarUrl: userProfileInput.avatarUrl,
      documentType: userProfileInput.documentType,
      documentNumber: userProfileInput.documentNumber,
    });

    const tenant = TenantEntity.create({
      name: `${userProfileInput.firstName}'s Tenant`,
      slug: SlugVO.create(`${userProfileInput.firstName.toLowerCase()}-tenant`),
      documentNumber: userProfileInput.documentNumber,
      contactEmail: EmailVO.create(userInput.email),
      phone: userProfileInput.phone,
    });

    const membership = MembershipEntity.create({
      userId: user.id,
      tenantId: tenant.id,
      organizationId: UUIDVO.create(),
      invitedById: UUIDVO.create(),
      role: MembershipRole.OWNER,
      status: MembershipStatus.ACTIVE,
      joinedAt: new Date(),
      invitedEmail: EmailVO.create(userInput.email), // Usar o email do usuário para o convite
    });

    const consentimento = LgpdConsentsEntity.create({
      userId: user.id,
      consentAnalytics: true,
      consentDataSharing: true,
      consentMarketing: true,
      consentTerms: true,
      ipAddress: "",
      macAddress: "",
      userAgent: "",
      consentVersion: "1.0",
    });

    await this.usersRepository.save(user);
    await this.userProfileRepository.save(userProfile);
    await this.membershipsRepository.save(membership);

    return right({
      user: UserMapper.toSummary(user),
      tenant: TenantMapper.toSummary(tenant),
    });
  }
}
