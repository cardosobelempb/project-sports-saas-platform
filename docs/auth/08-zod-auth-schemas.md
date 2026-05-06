# 08 — Schemas Zod de autenticação

Crie:

```txt
src/modules/auth/auth.schemas.ts
```

```ts
import { z } from "zod";

export const registerBodySchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres")
});

export const loginBodySchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres")
});

export type RegisterInput = z.infer<typeof registerBodySchema>;
export type LoginInput = z.infer<typeof loginBodySchema>;
```

## Onde usar

Use nos controllers:

```ts
@Validate({ body: loginBodySchema })
```

## Onde não usar

Não valide manualmente:

```ts
if (!body.email) {
  throw new Error("Email obrigatório");
}
```

## Benefício

Zod valida em runtime e também gera tipo TypeScript.
