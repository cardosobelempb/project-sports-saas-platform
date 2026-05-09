import { UUIDVO } from "@/common/domain/values-objects/uuidvo/uuid.vo";
import { Account as PrismaAccount } from "../../../../../generated/prisma";
import { AccountDto } from "../../application/dto/account.dto";
import { AccountEntity } from "../../domain/entities/account.entity";

export class PrismaAccountMapper {
  static toDomain(raw: PrismaAccount): AccountEntity {
    return AccountEntity.create(
      {
        userId: UUIDVO.create(raw.userId),
        provider: raw.provider,
        providerAccountId: UUIDVO.create(raw.providerAccountId),
      },
      UUIDVO.create(raw.id),
    );
  }

  static toDTO(entity: AccountEntity): AccountDto {
    return {
      id: entity.id.toString(),
      userId: entity.userId.getValue(),
      provider: entity.provider,
      providerAccountId: entity.providerAccountId.getValue(),
      createdAt: entity.createdAt.toISOString(),
      refreshToken: entity.refreshToken,
      accessToken: entity.accessToken,
      expiresAt: entity.expiresAt,
      tokenType: entity.tokenType,
      scope: entity.scope,
      idToken: entity.idToken,
      sessionState: entity.sessionState,
      providerType: entity.providerType,
    };
  }

  static toPrisma(entity: AccountEntity): PrismaAccount {
    return {
      id: entity.id.getValue(),
      userId: entity.userId.getValue(),
      provider: entity.provider,
      providerAccountId: entity.providerAccountId.getValue(),
      refreshToken: entity.refreshToken,
      accessToken: entity.accessToken,
      expiredAt: entity.expiresAt,

      scope: entity.scope,
      idToken: entity.idToken,
      sessionState: entity.sessionState,
      providerType: entity.providerType,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
