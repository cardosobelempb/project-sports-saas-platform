# 10 - Routes e Modules

## Objetivo

As rotas devem registrar módulos, não criar dependências manualmente.

---

## Exemplo de módulo

```ts
export const userModule = {
  providers: [
    {
      token: PrismaUserRepository,
      useClass: PrismaUserRepository
    },
    {
      token: UserCreateUseCase,
      useClass: UserCreateUseCase
    }
  ],
  controllers: [UserCreateController]
};
```

---

## Exemplo de routes

```ts
import type { FastifyInstance } from "fastify";
import { registerModule } from "@/shared/module/register-module";
import { userModule } from "../../user.module";

export async function userRoutes(app: FastifyInstance): Promise<void> {
  await registerModule(app, userModule);
}
```

---

## Onde usar

Use esse padrão quando:

- cada domínio tem seu próprio módulo;
- existem vários controllers;
- você quer escalar sem bagunça;
- quer centralizar dependências.

---

## Onde não usar

Evite em projetos pequenos demais.

Também evite misturar:

```ts
app.register(userCreateController(userCreateUseCase));
```

com:

```ts
@Controller("/users")
```

Escolha um padrão.

---

## Regra de ouro

```txt
Module declara.
Routes registra.
Container instancia.
```
