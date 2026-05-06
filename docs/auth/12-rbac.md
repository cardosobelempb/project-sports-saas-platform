# 12 — RBAC: Roles e Permissions

Crie:

```txt
src/shared/auth/rbac.ts
```

```ts
import type { UserRole } from "@prisma/client";
import type { Permission } from "@/shared/http/decorators/permissions.decorator";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    "users:create",
    "users:read",
    "users:update",
    "users:delete"
  ],

  MANAGER: [
    "users:read",
    "users:update"
  ],

  SUPPORT: [
    "users:read"
  ],

  USER: []
};

export function userHasPermissions(
  role: UserRole,
  requiredPermissions: Permission[]
): boolean {
  const permissions = ROLE_PERMISSIONS[role];

  return requiredPermissions.every((permission) =>
    permissions.includes(permission)
  );
}
```

## Onde usar

No `register-routes`, antes de executar o handler.

## Onde não usar

Não espalhe checagem de role dentro dos controllers:

```ts
if (request.user.role !== "ADMIN") // Evite duplicação
```

Prefira:

```ts
@Roles("ADMIN")
```
