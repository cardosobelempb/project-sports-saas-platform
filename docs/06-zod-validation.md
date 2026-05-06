# 06 - Validação com Zod

## Objetivo

Zod valida dados em runtime e também gera tipos TypeScript.

---

## Exemplo de schema

```ts
import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
```

---

## Uso no controller

```ts
@Validate({ body: CreateUserSchema })
@Post("/")
async handle(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as CreateUserInput;

  const result = await this.userCreateUseCase.execute(body);

  return reply.status(201).send(result);
}
```

---

## Onde usar

Use Zod para validar:

- body;
- params;
- querystring;
- filtros;
- paginação;
- variáveis de ambiente;
- contratos compartilhados entre backend e frontend.

---

## Onde não usar

Não use Zod para substituir regra de negócio.

Exemplo ruim:

```ts
const schema = z.object({
  saldo: z.number().min(100)
});
```

Se `saldo mínimo` é regra de negócio, coloque no use case.

---

## Erro comum

Errado:

```ts
userCreateUseCase.execute(request.body);
```

`request.body` pode ser `unknown`.

Correto:

```ts
const body = request.body as CreateUserInput;
```

---

## Boa prática

Valide entrada no controller. Execute regra no use case.
