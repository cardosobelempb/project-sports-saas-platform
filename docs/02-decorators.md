# 02 - Decorators HTTP

## Objetivo

Os decorators servem para deixar os controllers mais declarativos e organizados.

Exemplo:

```ts
@Controller("/users")
export class UserCreateController {
  @Validate({ body: CreateUserSchema })
  @Post("/", {
    tags: ["User"],
    summary: "Cria um novo usuário"
  })
  async handle(request: FastifyRequest, reply: FastifyReply) {
    // lógica HTTP
  }
}
```

---

## Principais decorators

```ts
@Controller("/users")
@Get("/")
@Post("/")
@Put("/:id")
@Patch("/:id")
@Delete("/:id")
@Validate({ body: schema })
@Auth()
@Roles("ADMIN")
@Permissions("users:create")
@Csrf()
@RateLimit({ max: 10, window: "1m" })
@Cache(60)
@Paginated()
@Transactional()
```

---

## Ordem correta

Em TypeScript, decorators de método executam de baixo para cima.

Recomendado:

```ts
@Validate({ body: CreateUserSchema })
@Post("/")
async handle() {}
```

Evite:

```ts
@Post("/")
@Validate({ body: CreateUserSchema })
async handle() {}
```

Porque `@Validate` pode executar antes da rota existir, dependendo da implementação.

---

## Onde usar

Use decorators para responsabilidades transversais:

- rotas;
- autenticação;
- autorização;
- validação;
- cache;
- paginação;
- rate limit;
- CSRF;
- documentação Swagger.

---

## Onde não usar

Não use decorators para regra de negócio.

Evite:

```ts
@CriarUsuarioNoBanco()
@EnviarEmailDeBoasVindas()
async handle() {}
```

Prefira:

```ts
async handle(request: FastifyRequest) {
  return this.userCreateUseCase.execute(request.body);
}
```

---

## Boa prática

Decorators devem organizar infraestrutura. Use cases devem conter regra de negócio.
