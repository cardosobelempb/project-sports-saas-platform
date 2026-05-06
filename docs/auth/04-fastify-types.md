# 04 — Tipagem global do Fastify

Crie o arquivo:

```txt
src/@types/fastify.d.ts
```

Conteúdo:

```ts
import type { Prisma, UserRole } from "@prisma/client";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      role: UserRole;
    };

    csrfToken?: string;

    prisma?: Prisma.TransactionClient;
  }
}
```

## Ajuste no tsconfig

Garanta que o TypeScript leia arquivos `.d.ts`.

```json
{
  "include": ["src/**/*.ts", "src/**/*.d.ts"]
}
```

Ou:

```json
{
  "include": ["src"]
}
```

## Onde usar

Use quando precisar acessar:

```ts
request.user
request.csrfToken
request.prisma
```

## Onde não usar

Não use cast com `any`:

```ts
(request as any).user // Evite
```

## Erro comum

### Falha

```txt
A propriedade 'user' não existe no tipo 'FastifyRequest'
```

### Correção

Criar `src/@types/fastify.d.ts` e reiniciar o TypeScript Server.
