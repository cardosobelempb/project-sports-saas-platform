import { ProviderType } from "@/common/shared/enums/provider-type.enum";
import {
  AccountDto,
  AccountSummaryDto,
} from "../../application/dto/account.dto";
import { AccountEntity } from "../entities/account.entity";

import { UUIDVO } from "@/common/domain/values-objects/uuidvo/uuid.vo";

export class AccountMapper {
  static toDomain(raw: AccountSummaryDto): AccountEntity {
    return AccountEntity.create(
      {
        userId: UUIDVO.create(raw.userId),
        provider: raw.provider,
        providerAccountId: UUIDVO.create(raw.providerAccountId),
        providerType: raw.providerType as ProviderType,
      },
      UUIDVO.create(raw.id),
    );
  }

  static toOutput(entity: AccountEntity): AccountDto {
    return {
      id: entity.id.getValue(),
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
}
