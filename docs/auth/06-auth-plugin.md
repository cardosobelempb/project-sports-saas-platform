# 06 — Plugin de autenticação

Crie:

```txt
src/shared/auth/auth.plugin.ts
```

```ts
import fp from "fastify-plugin";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import type { FastifyInstance } from "fastify";
import { AUTH_COOKIES } from "./auth.constants";

export async function authPlugin(app: FastifyInstance) {
  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET
  });

  await app.register(fastifyJwt, {
    secret: process.env.JWT_ACCESS_SECRET!
  });

  app.addHook("onRequest", async (request) => {
    const signedAccessToken = request.cookies[AUTH_COOKIES.accessToken];

    if (!signedAccessToken) {
      return;
    }

    const unsigned = request.unsignCookie(signedAccessToken);

    if (!unsigned.valid || !unsigned.value) {
      request.user = undefined;
      return;
    }

    try {
      const payload = await app.jwt.verify<{
        id: string;
        email: string;
        role: "ADMIN" | "MANAGER" | "SUPPORT" | "USER";
      }>(unsigned.value);

      request.user = payload;
    } catch {
      request.user = undefined;
    }
  });
}

export default fp(authPlugin);
```

## Registrar no app

```ts
import authPlugin from "@/shared/auth/auth.plugin";

await app.register(authPlugin);
```

## Onde usar

Use hook global para injetar `request.user` automaticamente.

## Onde não usar

Não valide JWT manualmente dentro de cada controller.

```ts
// Evite repetir isso em cada rota
const payload = await app.jwt.verify(token);
```

## Erro comum

Se você usa `signed: true` no cookie, precisa chamar:

```ts
request.unsignCookie(cookie)
```

antes de verificar o JWT.
