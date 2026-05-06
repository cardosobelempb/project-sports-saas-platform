// modules/users/user.module.ts

import { ModuleDefinition } from "@/common/shared/module/module.types";
import { UserCreateUseCase } from "./application/use-cases/user-create.usecase";
import { UserCreateController } from "./http/controllers/user-create.controller";
import { PrismaUserRepository } from "./infra/repositories/prisma-user.repository";

export const userModule: ModuleDefinition = {
  providers: [
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
