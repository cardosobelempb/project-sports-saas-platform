# 09 - Controllers

## Objetivo

Controller adapta HTTP para aplicação.

Ele recebe `request`, chama o use case e devolve `reply`.

---

## Exemplo

```ts
@Controller("/users")
export class UserCreateController {
  static inject = [UserCreateUseCase];

  constructor(
    private readonly userCreateUseCase: UserCreateUseCase
  ) {}

  @Validate({ body: CreateUserSchema })
  @Post("/", {
    tags: ["User"],
    summary: "Cria um novo usuário"
  })
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as CreateUserInput;

    const result = await this.userCreateUseCase.execute(body);

    if (result.isLeft()) {
      throw result.value;
    }

    return reply.status(201).send(result.value);
  }
}
```

---

## Onde usar

Controller deve conter:

- leitura do request;
- conversão de input;
- chamada ao use case;
- status HTTP;
- resposta HTTP.

---

## Onde não usar

Não coloque no controller:

- regra de negócio;
- query Prisma;
- hash de senha;
- envio de e-mail;
- cálculo complexo;
- autorização manual repetida.

---

## Erro comum

Errado:

```ts
const user = await prisma.user.create(...);
```

Correto:

```ts
const result = await this.userCreateUseCase.execute(body);
```

---

## Boa prática

Controller deve ser fino. Use case deve ser rico.
