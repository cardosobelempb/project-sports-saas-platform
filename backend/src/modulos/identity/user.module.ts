// modules/users/user.module.ts

import { getPrismaClient } from "@/common/infrastructure/db/prisma.client";
import { TOKENS } from "@/common/shared/container/tokens";
import { ModuleDefinition } from "@/common/shared/module/module.types";
import { UserCreateUseCase } from "./application/use-cases/user-create.usecase";
import { UserCreateController } from "./http/controllers/user-create.controller";
import { PrismaUserRepository } from "./infra/repositories/prisma-user.repository";

const prisma = getPrismaClient();

export const userModule: ModuleDefinition = {
  providers: [
    {
      token: TOKENS.PRISMA_CLIENT,
      useValue: prisma,
    },
    {
      token: PrismaUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      token: UserCreateUseCase,
      useClass: UserCreateUseCase,
    },
  ],

  controllers: [UserCreateController],
};
