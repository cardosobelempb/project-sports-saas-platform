import { PageRepository } from "@/common/domain/repositories/page-repository";
import { AccountEntity } from "../entities/account.entity";

export abstract class AccountRepository extends PageRepository<AccountEntity> {
  // abstract findByEmail(email: string): Promise<AccountEntity | null>;
  // abstract createWithTx(
  //   entity: AccountEntity,
  //   tx: Prisma.TransactionClient,
  // ): Promise<AccountEntity>;
  // abstract findByCpf(cpf: string): Promise<AccountEntity | null>;
}
