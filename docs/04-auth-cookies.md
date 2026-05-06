# 04 - Autenticação com Cookies

## Objetivo

A autenticação usa cookies HTTP-only para guardar tokens com mais segurança.

Fluxo:

```txt
Login
→ gera access token
→ gera refresh token
→ salva cookies
→ hook lê cookie
→ injeta request.user
→ decorators protegem rotas
```

---

## Cookies usados

```txt
access_token   → JWT curto, httpOnly
refresh_token  → token longo, httpOnly
csrf_token     → token legível pelo frontend
```

---

## Login

```ts
const accessToken = await reply.jwtSign(
  {
    id: user.id,
    email: user.email,
    role: user.role
  },
  {
    expiresIn: '15m'
  }
);

reply.setCookie('access_token', accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/'
});
```

---

## Hook global

```ts
app.addHook('onRequest', async request => {
  const token = request.cookies.access_token;

  if (!token) return;

  try {
    const payload = await app.jwt.verify(token);
    request.user = payload;
  } catch {
    request.user = undefined;
  }
});
```

---

## Usando em rota

```ts
@Get("/me")
@Auth()
async me(request: FastifyRequest) {
  return request.user;
}
```

---

## Permissões

```ts
@Get("/admin")
@Roles("ADMIN")
async adminOnly() {
  return { ok: true };
}
```

---

## Onde usar

Use cookies HTTP-only quando:

- a aplicação tem frontend web;
- precisa reduzir exposição a XSS;
- quer autenticação automática por navegador;
- precisa trabalhar com SSR/Next.js.

---

## Onde não usar

Evite cookies para:

- API pública consumida por terceiros;
- apps mobile puros;
- integrações server-to-server.

Nesses casos, bearer token no header pode ser mais adequado.

---

## Erros comuns

Não use:

```ts
localStorage.setItem('token', token);
```

Prefira cookie HTTP-only.
