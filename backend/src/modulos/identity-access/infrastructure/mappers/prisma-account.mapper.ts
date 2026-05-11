import { UUIDVO } from "@/common/domain/values-objects/uuidvo/uuid.vo";
import { ProviderType } from "@/common/shared/enums/provider-type.enum";
import { TokenType } from "@/common/shared/enums/token-type.enum";
import { Account as PrismaAccount } from "../../../../../generated/prisma";
import { AccountDto } from "../../application/dto/account.dto";
import { AccountEntity } from "../../domain/entities/account.entity";

export class PrismaAccountMapper {
  static toDomain(raw: PrismaAccount): AccountEntity {
    return AccountEntity.create(
      {
        userId: UUIDVO.create(raw.userId),
        provider: raw.provider as ProviderType,
        providerAccountId: UUIDVO.create(raw.providerAccountId),
        tokenType: raw.tokenType as TokenType,
      },
      UUIDVO.create(raw.id),
    );
  }

  static toDTO(entity: AccountEntity): AccountDto {
    return {
      id: entity.id.toString(),
      userId: entity.userId.getValue(),
      provider: entity.provider as ProviderType,
      providerAccountId: entity.providerAccountId.getValue(),
      refreshToken: entity.refreshToken,
      accessToken: entity.accessToken,
      expiresAt: entity.expiresAt,
      tokenType: entity.tokenType as TokenType,
      scope: entity.scope,
      idToken: entity.idToken,
      sessionState: entity.sessionState,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }

  static toPrisma(entity: AccountEntity): PrismaAccount {
    return {
      id: entity.id.getValue(),
      userId: entity.userId.getValue(),
      provider: entity.provider as ProviderType,
      providerAccountId: entity.providerAccountId.getValue(),
      refreshToken: entity.refreshToken,
      accessToken: entity.accessToken,
      expiresAt: entity.expiresAt,
      tokenType: entity.tokenType as TokenType,
      scope: entity.scope,
      idToken: entity.idToken,
      sessionState: entity.sessionState,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
