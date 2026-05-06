# 03 - DI Container

## Objetivo

O DI Container centraliza a criação de dependências.

Ele evita que controllers criem use cases diretamente e evita que use cases criem repositories manualmente.

---

## Exemplo de provider

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

## Exemplo de injeção no use case

```ts
export class UserCreateUseCase {
  static inject = [PrismaUserRepository];

  constructor(
    private readonly userRepository: PrismaUserRepository
  ) {}

  async execute(input: CreateUserInput) {
    return this.userRepository.create(input);
  }
}
```

---

## Exemplo de injeção no controller

```ts
export class UserCreateController {
  static inject = [UserCreateUseCase];

  constructor(
    private readonly userCreateUseCase: UserCreateUseCase
  ) {}
}
```

---

## Registro do módulo

```ts
export async function userRoutes(app: FastifyInstance): Promise<void> {
  await registerModule(app, userModule);
}
```

---

## Onde usar

Use DI quando:

- uma classe depende de outra;
- você quer facilitar testes;
- precisa trocar implementações;
- quer evitar `new` espalhado no projeto.

---

## Onde não usar

Evite DI para objetos muito simples, como:

```ts
const pagination = { page: 1, limit: 10 };
```

Também evite DI para funções puras sem dependência externa.

---

## Erro comum

Errado:

```ts
const useCase = new UserCreateUseCase(new PrismaUserRepository());
```

Correto:

```ts
static inject = [PrismaUserRepository];
```
