import { Either, right } from "@/common/domain/errors/handle-errors/either";
import { AlreadyExistsError } from "@/common/domain/errors/usecases/already-exists.error";
import { UnauthorizedError } from "@/common/domain/errors/usecases/unauthorized.error";
import { JwtEncrypter } from "@/common/shared/auth/jwt-encrypter";
import { BcryptHasher } from "@/common/shared/cryptography/bcrypt-hasher";
import { MemberShipRepository } from "@/modulos/identity/domain/repositories/member-ship.repository";
import { UserRepository } from "@/modulos/identity/domain/repositories/user.repository";
import { PrismaUserRepository } from "@/modulos/identity/infrastructure/repositories/prisma-user.repository";
import { SessionEntity } from "../../domain/entities/session.entity";
import { SessionRepository } from "../../domain/repositories/session.repository";
import { SessionSigninDto, SessionSigninResponseDto } from "../dto/session.dto";

export type UserCreateUseCaseResponse = Either<
  AlreadyExistsError,
  SessionSigninResponseDto
>;

export class AuthSigninUseCase {
  static inject = [PrismaUserRepository, BcryptHasher, JwtEncrypter];

  constructor(
    private readonly userRepository: UserRepository,
    private readonly memberShipRepository: MemberShipRepository,
    private readonly sessionsRepository: SessionRepository,
    private readonly hasher: BcryptHasher,
    private readonly encrypter: JwtEncrypter,
  ) {}

  async execute(input: SessionSigninDto): Promise<UserCreateUseCaseResponse> {
    const user = await this.userRepository.findByEmail(input.);

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

    const sessionToken = await this.encrypter.encryptSessionToken({
      sub: user.id.getValue(),
    });

    const newSession = SessionEntity.create({
        userId: user.id,
        sessionToken,
        expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expira em 24 horas
    }),

    const session = await this.sessionsRepository.create(
      newSession
    );

    const accessToken = await this.encrypter.encryptAccessToken({
      sub: user.id.getValue(),
      tenantId: membership.tenantId.getValue(),
      organizationId: membership.organizationId.getValue(),
      email: user.email.getValue().value,
      role: membership.role,
      sessionId: session.id.getValue(),
    });

    const refreshToken = await this.encrypter.encryptRefreshToken({
      sub: user.id.getValue(),
      sessionId: session.id.getValue(),
    });

    return right({
      accessToken,
      refreshToken,
      user,
    });
  }
}
