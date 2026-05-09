// modules/Accounts/infra/routes/Account.routes.ts

import type { FastifyInstance } from "fastify";

import { registerModule } from "@/common/shared/module/register-module";
import { AccountModule } from "@/modulos/identity-access/account.module";

export async function AccountRoutes(app: FastifyInstance): Promise<void> {
  await registerModule(app, AccountModule);
}
