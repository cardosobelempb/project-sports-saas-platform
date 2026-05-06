# 16 — AuthModule

## Com DI manual simples

Se você ainda não usa DI automático:

```ts
// src/modules/auth/auth.routes.ts

import type { FastifyInstance } from "fastify";
import { prisma } from "@/prisma";
import { registerControllers } from "@/shared/http/register-routes";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

export async function authRoutes(app: FastifyInstance): Promise<void> {
  const authService = new AuthService(prisma);
  const authController = new AuthController(authService);

  await registerControllers(app, [authController]);
}
```

## Com módulo e DI

```ts
// src/modules/auth/auth.module.ts

import type { ModuleDefinition } from "@/shared/module/module.types";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaClient } from "@prisma/client";

export const authModule: ModuleDefinition = {
  providers: [
    {
      token: PrismaClient,
      useClass: PrismaClient
    },
    {
      token: AuthService,
      useClass: AuthService
    }
  ],

  controllers: [
    AuthController
  ]
};
```

No controller:

```ts
export class AuthController {
  static inject = [AuthService];

  constructor(private readonly authService: AuthService) {}
}
```

No service:

```ts
export class AuthService {
  static inject = [PrismaClient];

  constructor(private readonly prisma: PrismaClient) {}
}
```

## Onde usar

Use módulo quando quiser escalar a aplicação.

## Onde não usar

Não instancie `new AuthService()` dentro do controller.
