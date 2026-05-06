# 17 — Registro no app

Exemplo em:

```txt
src/app.ts
```

```ts
import Fastify from "fastify";
import authPlugin from "@/shared/auth/auth.plugin";
import { authRoutes } from "@/modules/auth/auth.routes";
import { userRoutes } from "@/modules/users/infra/routes/user.routes";

export async function buildApp() {
  const app = Fastify({
    logger: true
  });

  await app.register(authPlugin);

  await authRoutes(app);
  await userRoutes(app);

  return app;
}
```

## Ordem correta

Registre o `authPlugin` antes das rotas:

```ts
await app.register(authPlugin);
await authRoutes(app);
await userRoutes(app);
```

## Onde usar

Use essa ordem para garantir que `request.cookies`, `reply.jwtSign` e `request.user` existam.

## Onde não usar

Não registre rotas protegidas antes do plugin de auth.
