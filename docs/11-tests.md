# 11 - Testes

## Objetivo

Testes garantem que regras e rotas continuem funcionando após mudanças.

---

## Tipos de testes

```txt
Unitário → testa use case isolado
Integração → testa repository com banco
E2E → testa rota HTTP completa
```

---

## Teste unitário de use case

```ts
import { describe, it, expect, vi } from "vitest";

it("deve criar usuário", async () => {
  const repository = {
    create: vi.fn().mockResolvedValue({ id: "1" })
  };

  const useCase = new UserCreateUseCase(repository as any);

  const result = await useCase.execute({
    name: "Maria",
    email: "maria@email.com",
    password: "12345678"
  });

  expect(repository.create).toHaveBeenCalled();
});
```

---

## Teste E2E

```ts
import request from "supertest";
import { buildApp } from "@/app";

it("deve criar usuário via HTTP", async () => {
  const app = await buildApp();

  const response = await request(app.server)
    .post("/users")
    .send({
      name: "Maria",
      email: "maria@email.com",
      password: "12345678"
    });

  expect(response.status).toBe(201);
});
```

---

## Onde usar

Use testes unitários para:

- regras de negócio;
- validações;
- fluxo de use case.

Use E2E para:

- autenticação;
- rotas críticas;
- criação de recursos.

---

## Onde não usar

Não teste detalhes internos demais.

Evite testar:

- implementação privada;
- ordem interna de chamadas sem necessidade;
- código trivial sem regra.

---

## Boa prática

Teste comportamento, não implementação.
