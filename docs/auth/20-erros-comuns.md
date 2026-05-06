# 20 — Erros comuns e correções

## 1. `request.user` não existe

### Falha

```txt
A propriedade 'user' não existe no tipo FastifyRequest
```

### Correção

Criar:

```txt
src/@types/fastify.d.ts
```

e incluir no `tsconfig`.

---

## 2. `exactOptionalPropertyTypes`

### Falha

```ts
schema: {
  tags: route.docs?.tags
}
```

### Correção

Omitir propriedades indefinidas:

```ts
if (route.docs?.tags) {
  schema.tags = route.docs.tags;
}
```

---

## 3. Decorator executando fora de ordem

### Falha

```ts
@Post("/")
@Validate({ body: schema })
```

### Correção

```ts
@Validate({ body: schema })
@Post("/")
```

Decorators executam de baixo para cima.

---

## 4. Cookie assinado não verificado

### Falha

```ts
const token = request.cookies.access_token;
await app.jwt.verify(token);
```

### Correção

```ts
const unsigned = request.unsignCookie(token);

if (unsigned.valid && unsigned.value) {
  await app.jwt.verify(unsigned.value);
}
```

---

## 5. Token em localStorage

### Falha

```ts
localStorage.setItem("token", token);
```

### Correção

Use cookie HTTP-only.

---

## 6. Senha retornando na resposta

### Falha

```ts
return prisma.user.findUnique({ where: { email } });
```

### Correção

Use `select`:

```ts
select: {
  id: true,
  name: true,
  email: true,
  role: true
}
```
