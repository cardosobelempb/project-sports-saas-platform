# 02 — Variáveis de ambiente

Crie ou atualize seu `.env`.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app"

JWT_ACCESS_SECRET="troque-por-um-segredo-forte-access"
JWT_REFRESH_SECRET="troque-por-um-segredo-forte-refresh"
COOKIE_SECRET="troque-por-um-segredo-forte-cookie"

NODE_ENV="development"
```

## Onde usar

Use segredos diferentes para access token, refresh token e cookie.

## Onde não usar

Não deixe secrets fixos no código:

```ts
secret: "123456" // Errado
```

## Recomendação preventiva

Em produção:

- gere secrets fortes;
- use variáveis de ambiente;
- não faça commit do `.env`;
- use `.env.example` sem valores reais.
