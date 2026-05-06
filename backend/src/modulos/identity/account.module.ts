// modules/Accounts/Account.module.ts

import { ModuleDefinition } from "@/common/shared/module/module.types";

import { AccountCreateUseCase } from "./application/use-cases/account-create.use-case";
import { AccountCreateController } from "./http/controllers/account-create.controller";
import { PrismaAccountRepository } from "./infra/repositories/account-prisma.repository";

export const AccountModule: ModuleDefinition = {
  providers: [
    {
      token: PrismaAccountRepository,
      useClass: PrismaAccountRepository,
    },
    {
      token: AccountCreateUseCase,
      useClass: AccountCreateUseCase,
    },
  ],

  controllers: [AccountCreateController],
};
