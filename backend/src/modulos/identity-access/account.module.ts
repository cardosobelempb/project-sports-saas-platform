// modules/Accounts/Account.module.ts

import { ModuleDefinition } from "@/common/shared/module/module.types";

import { AccountCreateUseCase } from "./application/use-cases/account-create.usecase";

import { AccountCreateController } from "./infrastructure/http/controllers/account-create.controller";
import { PrismaAccountRepository } from "./infrastructure/repositories/prisma-account.repository";

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
