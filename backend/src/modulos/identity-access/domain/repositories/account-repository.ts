import { PageRepository } from "@/common/domain/repositories/page-repository";
import { ProviderType } from "@/common/shared/enums/provider-type.enum";
import { TokenType } from "@/common/shared/enums/token-type.enum";
import { AccountEntity } from "../entities/account.entity";

export interface LinkProviderAccountData {
  userId: string;
  providerType: ProviderType;
  provider: string;
  providerAccountId: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  expireAt?: number | null;
  tokenType?: TokenType | null;
  scope?: string | null;
  idToken?: string | null;
  sessionState?: string | null;
}

export abstract class AccountRepository extends PageRepository<AccountEntity> {
  abstract findByProviderAccount(
    provider: string,
    providerAccountId: string,
  ): Promise<AccountEntity | null>;
  abstract findByUserId(userId: string): Promise<AccountEntity[]>;
  abstract linkProviderAccount(entity: AccountEntity): Promise<AccountEntity>;
  abstract unlinkProviderAccount(accountId: string): Promise<void>;
}
