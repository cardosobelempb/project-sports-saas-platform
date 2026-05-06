# 07 - Prisma Repository

## Objetivo

Repository encapsula o acesso ao banco de dados.

O controller e o use case não devem conhecer detalhes do Prisma.

---

## Exemplo

```ts
export class PrismaUserRepository {
  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
  }
}
```

---

## Onde usar

Use repository para:

- criar registros;
- buscar dados;
- atualizar entidades;
- deletar ou desativar dados;
- isolar queries complexas;
- trocar implementação no futuro.

---

## Onde não usar

Não use Prisma diretamente no controller.

Evite:

```ts
async handle() {
  return prisma.user.create(...);
}
```

Prefira:

```ts
return this.userCreateUseCase.execute(body);
```

---

## Erro comum

Nunca retorne senha:

```ts
return prisma.user.findUnique({ where: { email } });
```

Prefira `select`:

```ts
select: {
  id: true,
  name: true,
  email: true
}
```

---

## Boa prática

Repository deve lidar com persistência. Use case deve lidar com regra de negócio.
