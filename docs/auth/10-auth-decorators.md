# 10 — Decorators de autenticação

## `@Auth`

```ts
// src/shared/http/decorators/auth.decorator.ts

import { updateRoute } from "./metadata";

export function Auth() {
  return function (target: object, propertyKey: string | symbol): void {
    updateRoute(target.constructor, String(propertyKey), {
      auth: true
    });
  };
}
```

## `@Roles`

```ts
// src/shared/http/decorators/roles.decorator.ts

import type { UserRole } from "@prisma/client";
import { updateRoute } from "./metadata";

export function Roles(...roles: UserRole[]) {
  return function (target: object, propertyKey: string | symbol): void {
    updateRoute(target.constructor, String(propertyKey), {
      auth: true,
      roles
    });
  };
}
```

## `@Permissions`

```ts
// src/shared/http/decorators/permissions.decorator.ts

import { updateRoute } from "./metadata";

export type Permission =
  | "users:create"
  | "users:read"
  | "users:update"
  | "users:delete";

export function Permissions(...permissions: Permission[]) {
  return function (target: object, propertyKey: string | symbol): void {
    updateRoute(target.constructor, String(propertyKey), {
      auth: true,
      permissions
    });
  };
}
```

## `@Csrf`

```ts
// src/shared/http/decorators/csrf.decorator.ts

import { updateRoute } from "./metadata";

export function Csrf() {
  return function (target: object, propertyKey: string | symbol): void {
    updateRoute(target.constructor, String(propertyKey), {
      csrf: true
    });
  };
}
```

## Onde usar

```ts
@Auth()
@Get("/me")
```

```ts
@Roles("ADMIN")
@Get("/users")
```

```ts
@Permissions("users:create")
@Csrf()
@Post("/users")
```

## Onde não usar

Não use decorators para regra de negócio complexa.

```ts
@ClientePodeComprar() // Evite
```

Regra de negócio deve ficar no UseCase.
