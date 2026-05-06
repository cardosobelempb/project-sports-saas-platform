# 19 — Exemplo de rota protegida

```ts
import type { FastifyRequest } from "fastify";
import { Controller } from "@/shared/http/decorators/controller.decorator";
import { Get, Post } from "@/shared/http/decorators/route.decorator";
import { Auth } from "@/shared/http/decorators/auth.decorator";
import { Roles } from "@/shared/http/decorators/roles.decorator";
import { Permissions } from "@/shared/http/decorators/permissions.decorator";
import { Csrf } from "@/shared/http/decorators/csrf.decorator";

@Controller("/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth()
  @Get("/profile")
  async profile(request: FastifyRequest) {
    return this.usersService.findById(request.user!.id);
  }

  @Roles("ADMIN")
  @Permissions("users:read")
  @Get("/")
  async list() {
    return this.usersService.findAll();
  }

  @Csrf()
  @Roles("ADMIN")
  @Permissions("users:create")
  @Post("/")
  async create(request: FastifyRequest) {
    return this.usersService.create(request.body);
  }
}
```

## Onde usar

- `@Auth()` para qualquer usuário logado.
- `@Roles()` para controle macro.
- `@Permissions()` para controle fino.
- `@Csrf()` para rotas de escrita com cookie.

## Onde não usar

Não coloque `@Csrf()` em GET simples.

```ts
@Csrf()
@Get("/profile") // Evite
```
