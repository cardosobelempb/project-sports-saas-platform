# 11 — RouteDefinition

Atualize seu tipo de rota.

```ts
// src/shared/http/types.ts

import type { UserRole } from "@prisma/client";
import type { ZodSchema } from "zod";
import type { Permission } from "./decorators/permissions.decorator";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RouteDefinition = {
  method: HttpMethod;
  path: string;
  handlerName: string;

  docs?: {
    tags?: string[];
    summary?: string;
    description?: string;
  };

  schema?: {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
    response?: ZodSchema;
  };

  auth?: boolean;
  roles?: UserRole[];
  permissions?: Permission[];
  csrf?: boolean;
};
```

## Onde usar

Esse tipo alimenta o `register-routes`.

## Onde não usar

Não coloque lógica de negócio aqui. Ele deve descrever metadados da rota.
