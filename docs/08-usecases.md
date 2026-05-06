# 08 - Use Cases

## Objetivo

Use case representa uma ação de negócio.

Exemplos:

- criar usuário;
- atualizar usuário;
- listar usuários;
- ativar usuário;
- desativar usuário.

---

## Exemplo

```ts
export class UserCreateUseCase {
  static inject = [PrismaUserRepository];

  constructor(
    private readonly userRepository: PrismaUserRepository
  ) {}

  async execute(input: CreateUserInput) {
    const passwordHash = await hashPassword(input.password);

    return this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash
    });
  }
}
```

---

## Onde usar

Use case deve conter:

- validações de negócio;
- orquestração de repositories;
- chamadas a providers;
- transações;
- regras de decisão.

---

## Onde não usar

Não coloque lógica HTTP no use case.

Evite:

```ts
reply.status(201).send(...)
```

Isso pertence ao controller.

Também não coloque `FastifyRequest` dentro do use case.

---

## Boa prática

A assinatura ideal é simples:

```ts
execute(input: Input): Promise<Output>
```

---

## Regra de ouro

```txt
Use Case não sabe se veio de HTTP, fila, CLI ou evento.
```
