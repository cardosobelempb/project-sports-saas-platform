# 18 — Uso no frontend

## Login

```ts
await fetch("http://localhost:3001/auth/login", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: "admin@email.com",
    password: "12345678"
  })
});
```

## Rota autenticada

```ts
const response = await fetch("http://localhost:3001/auth/me", {
  credentials: "include"
});

const data = await response.json();
```

## Rota com CSRF

```ts
function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(^| )${name}=([^;]+)`)
  );

  return match ? decodeURIComponent(match[2]) : null;
}

const csrfToken = getCookie("csrf_token");

await fetch("http://localhost:3001/users", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    "x-csrf-token": csrfToken ?? ""
  },
  body: JSON.stringify({
    name: "Maria",
    email: "maria@email.com",
    password: "12345678"
  })
});
```

## Onde usar

Use `credentials: "include"` sempre que a API usa cookies.

## Onde não usar

Não tente enviar o access token manualmente se ele está em cookie HTTP-only.
