import { UUIDVO } from "@/common/domain/values-objects/uuidvo/uuid.vo";
import { Account as Prismaccount } from "../../../../../generated/prisma";

import { ProviderType } from "@/common/shared/enums/provider-type.enum";
import { AccountEntity } from "../entities/account.entity";

export class AccountMapper {
  static toDomain(raw: Prismaccount): AccountEntity {
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

  static toPersist(entity: AccountEntity) {
    return {
      id: entity.id.toString(),
      userId: entity.userId.getValue(),
      provider: entity.provider,
      providerAccountId: entity.providerAccountId.toString(),
    };
  }

  static toOutput(entity: AccountEntity) {
    return {
      id: entity.id.toString(),
      userId: entity.userId.getValue(),
      provider: entity.provider,
      providerAccountId: entity.providerAccountId.toString(),
    };
  }
}
