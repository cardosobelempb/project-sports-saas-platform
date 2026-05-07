import { Either, right } from "@/common/domain/errors/handle-errors/either";
import { AlreadyExistsError } from "@/common/domain/errors/usecases/already-exists.error";
import { UnauthorizedError } from "@/common/domain/errors/usecases/unauthorized.error";
import { JwtEncrypter } from "@/common/shared/auth/jwt-encrypter";
import { BcryptHasher } from "@/common/shared/cryptography/bcrypt-hasher";
import { MemberShipRepository } from "@/modulos/identity/domain/repositories/member-ship.repository";
import { UserRepository } from "@/modulos/identity/domain/repositories/user.repository";
import { PrismaUserRepository } from "@/modulos/identity/infrastructure/repositories/prisma-user.repository";
import { AuthSigninDto, AuthSigninResponseDto } from "../dto/auth.dto";

export type UserCreateUseCaseResponse = Either<
  AlreadyExistsError,
  AuthSigninResponseDto
>;

export class AuthSigninUseCase {
  static inject = [PrismaUserRepository, BcryptHasher, JwtEncrypter];

  constructor(
    private readonly userRepository: UserRepository,
    private readonly memberShipRepository: MemberShipRepository,
    private readonly sessionsRepository: SessionsRepository,
    private readonly hasher: BcryptHasher,
    private readonly encrypter: JwtEncrypter,
  ) {}

  async execute(input: AuthSigninDto): Promise<UserCreateUseCaseResponse> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedError({
        message: "Credenciais inválidas.",
        fieldName: "email ou senha",
      });
    }

    const passwordMatches = await this.hasher.compare(
      input.passwordHash,
      user.passwordHash.getValue(),
    );

    if (!passwordMatches) {
      throw new UnauthorizedError({
        message: "Credenciais inválidas.",
        fieldName: "email ou senha",
      });
    }

    const membership = await this.memberShipRepository.findByMemberShipUserId(
      user.id.getValue(),
    );

    if (!membership) {
      throw new UnauthorizedError({
        message: "Usuário não possui associação a nenhuma organização.",
        fieldName: "email ou senha",
      });
    }

    const accessToken = this.encrypter.encryptAccessToken({
      sub: user.id.getValue(),
      tenantId: membership.tenantId.getValue(),
      organizationId: membership.organizationId.getValue(),
      email: user.email.getValue().value,
      role: membership?.role,
      userId: user.id.getValue(),
      sessionId: "", // Será preenchido após a criação da sessão
    });

    const session = await this.sessionsRepository.create({
      userId: user.id,
    });

    const refreshToken = this.encrypter.encryptAccessToken({
      userId: user.id.getValue(),
      sessionId: session.id,
    });

    return right({
      accessToken,
      refreshToken,
      user,
    });
  }
}
