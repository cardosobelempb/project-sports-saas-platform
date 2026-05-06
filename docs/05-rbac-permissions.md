# 05 - RBAC e Permissions

## Objetivo

RBAC controla acesso por perfil. Permissions controlam acesso por ação específica.

---

## Roles

Exemplo:

```ts
@Roles("ADMIN")
@Get("/users")
async listUsers() {}
```

Roles comuns:

```ts
"ADMIN"
"MANAGER"
"SUPPORT"
"USER"
```

---

## Permissions

Exemplo:

```ts
@Permissions("users:create")
@Post("/users")
async createUser() {}
```

Exemplos de permissões:

```ts
"users:create"
"users:read"
"users:update"
"users:delete"
"orders:create"
"orders:read"
```

---

## Mapa de permissões

```ts
export const ROLE_PERMISSIONS = {
  ADMIN: ["users:create", "users:read", "users:update", "users:delete"],
  MANAGER: ["users:read", "users:update"],
  SUPPORT: ["users:read"],
  USER: []
};
```

---

## Onde usar Roles

Use `@Roles()` para regras macro:

```ts
@Roles("ADMIN")
```

Exemplo:

- painel administrativo;
- gestão de usuários;
- rotas internas.

---

## Onde usar Permissions

Use `@Permissions()` para controle fino:

```ts
@Permissions("users:update")
```

Exemplo:

- criar usuário;
- editar pedido;
- apagar produto;
- visualizar relatórios.

---

## Onde não usar

Não use roles para regras complexas de domínio.

Evite:

```ts
@Roles("USUARIO_QUE_COMPROU_ACIMA_DE_500")
```

Prefira colocar isso no use case.

---

## Regra prática

```txt
Role = quem a pessoa é.
Permission = o que ela pode fazer.
Use Case = se a ação faz sentido no domínio.
```
