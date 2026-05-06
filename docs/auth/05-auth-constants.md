# 05 — Constantes de autenticação

Crie:

```txt
src/shared/auth/auth.constants.ts
```

```ts
export const AUTH_COOKIES = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  csrfToken: "csrf_token"
} as const;

export const ACCESS_TOKEN_EXPIRES_IN = "15m";
export const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;
```

## Onde usar

Use constantes para evitar strings espalhadas:

```ts
request.cookies[AUTH_COOKIES.accessToken]
```

## Onde não usar

Evite:

```ts
request.cookies["access_token"]
```

Isso dificulta refatoração e aumenta chance de erro de digitação.
