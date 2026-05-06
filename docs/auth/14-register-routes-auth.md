# 14 — Register routes com autenticação

Este arquivo é o coração da integração entre decorators e Fastify.

```ts
// src/shared/http/register-routes.ts

import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { getControllerPrefix, getRoutes } from "./decorators/metadata";
import { buildFastifySchema } from "./build-fastify-schema";
import { AUTH_COOKIES } from "@/shared/auth/auth.constants";
import { userHasPermissions } from "@/shared/auth/rbac";

type ControllerInstance = object;
type ControllerMethods = Record<string, unknown>;

function joinPaths(prefix: string, path: string): string {
  const normalizedPrefix = prefix.startsWith("/") ? prefix : `/${prefix}`;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedPrefix}${normalizedPath}`.replace(/\/+/g, "/");
}

export async function registerControllers(
  app: FastifyInstance,
  controllers: ControllerInstance[]
): Promise<void> {
  for (const controller of controllers) {
    const controllerClass = controller.constructor;
    const prefix = getControllerPrefix(controllerClass);
    const routes = getRoutes(controllerClass);

    for (const route of routes) {
      app.route({
        method: route.method,
        url: joinPaths(prefix, route.path),
        schema: buildFastifySchema(route),

        handler: async (request, reply) => {
          try {
            if (route.auth && !request.user) {
              return reply.status(401).send({
                message: "Não autenticado"
              });
            }

            if (route.roles && request.user) {
              const hasRole = route.roles.includes(request.user.role);

              if (!hasRole) {
                return reply.status(403).send({
                  message: "Perfil sem permissão"
                });
              }
            }

            if (route.permissions && request.user) {
              const hasPermissions = userHasPermissions(
                request.user.role,
                route.permissions
              );

              if (!hasPermissions) {
                return reply.status(403).send({
                  message: "Permissão insuficiente"
                });
              }
            }

            if (route.csrf) {
              const csrfCookie = request.cookies[AUTH_COOKIES.csrfToken];
              const csrfHeader = request.headers["x-csrf-token"];

              const unsigned = csrfCookie
                ? request.unsignCookie(csrfCookie)
                : null;

              if (
                !unsigned?.valid ||
                !unsigned.value ||
                unsigned.value !== csrfHeader
              ) {
                return reply.status(403).send({
                  message: "CSRF token inválido"
                });
              }
            }

            if (route.schema?.body) {
              request.body = route.schema.body.parse(request.body);
            }

            if (route.schema?.params) {
              request.params = route.schema.params.parse(request.params);
            }

            if (route.schema?.query) {
              request.query = route.schema.query.parse(request.query);
            }

            const controllerMethods = controller as ControllerMethods;
            const handler = controllerMethods[route.handlerName];

            if (typeof handler !== "function") {
              throw new Error(`Handler ${route.handlerName} não encontrado`);
            }

            return handler.call(controller, request, reply);
          } catch (error) {
            if (error instanceof ZodError) {
              return reply.status(400).send({
                message: "Erro de validação",
                issues: error.issues
              });
            }

            throw error;
          }
        }
      });
    }
  }
}
```

## Onde usar

Use para registrar controllers baseados em decorators.

## Onde não usar

Não misture esse padrão com:

```ts
app.register(userCreateController(useCase))
```

Se migrou para decorators, use `registerControllers` ou `registerModule`.
