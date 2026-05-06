# 07 — Helpers de cookies

Crie:

```txt
src/shared/auth/cookie.helper.ts
```

```ts
import type { FastifyReply } from "fastify";
import { AUTH_COOKIES, REFRESH_TOKEN_EXPIRES_IN_DAYS } from "./auth.constants";

const isProduction = process.env.NODE_ENV === "production";

export function setAuthCookies(
  reply: FastifyReply,
  tokens: {
    accessToken: string;
    refreshToken: string;
    csrfToken: string;
  }
): void {
  reply.setCookie(AUTH_COOKIES.accessToken, tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    signed: true,
    maxAge: 60 * 15
  });

  reply.setCookie(AUTH_COOKIES.refreshToken, tokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/auth/refresh",
    signed: true,
    maxAge: 60 * 60 * 24 * REFRESH_TOKEN_EXPIRES_IN_DAYS
  });

  reply.setCookie(AUTH_COOKIES.csrfToken, tokens.csrfToken, {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    signed: true,
    maxAge: 60 * 60 * 24 * REFRESH_TOKEN_EXPIRES_IN_DAYS
  });
}

export function clearAuthCookies(reply: FastifyReply): void {
  reply.clearCookie(AUTH_COOKIES.accessToken, { path: "/" });
  reply.clearCookie(AUTH_COOKIES.refreshToken, { path: "/auth/refresh" });
  reply.clearCookie(AUTH_COOKIES.csrfToken, { path: "/" });
}
```

## Onde usar

Use no login, refresh e logout.

## Onde não usar

Não deixe o `refresh_token` acessível via JavaScript:

```ts
httpOnly: false // Errado para refresh_token
```

## Observação

O `csrf_token` precisa ser legível pelo frontend, por isso `httpOnly: false`.
