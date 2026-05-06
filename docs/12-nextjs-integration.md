# 12 - Integração com Next.js

## Objetivo

Next.js deve atuar como frontend ou BFF leve. Fastify continua sendo a API principal.

---

## Arquitetura recomendada

```txt
Next.js
→ Fastify API
→ Prisma
→ PostgreSQL
```

---

## Estrutura sugerida

```txt
apps/
  web/    # Next.js
  api/    # Fastify
packages/
  contracts/ # Zod schemas compartilhados
```

---

## Contrato compartilhado

```ts
// packages/contracts/user.schema.ts

export const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
```

---

## Uso no backend

```ts
@Validate({ body: CreateUserSchema })
@Post("/")
async handle(request: FastifyRequest) {}
```

---

## Uso no frontend

```ts
const parsed = CreateUserSchema.safeParse(formData);

if (!parsed.success) {
  return parsed.error.flatten();
}
```

---

## Onde usar Next.js API Routes

Use para:

- BFF leve;
- proxy;
- SSR com cookies;
- pequenas integrações próximas da UI.

---

## Onde não usar Next.js como backend principal

Evite quando houver:

- regras complexas;
- transações;
- RBAC avançado;
- muitos módulos;
- API pública robusta;
- necessidade alta de performance.

Nesse caso, mantenha Fastify.

---

## Recomendação

Para este projeto:

```txt
Next.js = interface.
Fastify = backend principal.
Prisma = somente no backend.
```
