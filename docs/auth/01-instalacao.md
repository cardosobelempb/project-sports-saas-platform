# 01 — Instalação

## Dependências

```bash
npm install @fastify/jwt @fastify/cookie bcryptjs zod
npm install -D @types/bcryptjs
```

## Onde usar

Use essas dependências quando sua API precisar de:

- login com JWT;
- sessão persistente via cookie;
- refresh token;
- validação de input;
- hash de senha.

## Onde não usar

Não use `localStorage` para guardar token sensível.

```ts
localStorage.setItem("token", token); // Evite
```

Prefira cookie HTTP-only.

## Erros comuns

### Falha

Instalar apenas `@fastify/jwt` e esquecer `@fastify/cookie`.

### Correção

Instale ambos:

```bash
npm install @fastify/jwt @fastify/cookie
```
