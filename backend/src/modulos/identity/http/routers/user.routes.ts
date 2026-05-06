// modules/users/infra/routes/user.routes.ts

import type { FastifyInstance } from "fastify";

import { registerModule } from "@/common/shared/module/register-module";
import { userModule } from "../../user.module";

export async function userRoutes(app: FastifyInstance): Promise<void> {
  await registerModule(app, userModule);
}
