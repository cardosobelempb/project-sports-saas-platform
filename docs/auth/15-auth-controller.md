# 15 — AuthController

Crie:

```txt
src/modules/auth/auth.controller.ts
```

```ts
import type { FastifyReply, FastifyRequest } from "fastify";
import { Controller } from "@/shared/http/decorators/controller.decorator";
import { Post, Get } from "@/shared/http/decorators/route.decorator";
import { Validate } from "@/shared/http/decorators/validate.decorator";
import { Auth } from "@/shared/http/decorators/auth.decorator";
import { Csrf } from "@/shared/http/decorators/csrf.decorator";
import {
  loginBodySchema,
  registerBodySchema,
  type LoginInput,
  type RegisterInput
} from "./auth.schemas";
import type { AuthService } from "./auth.service";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  AUTH_COOKIES
} from "@/shared/auth/auth.constants";
import {
  clearAuthCookies,
  setAuthCookies
} from "@/shared/auth/cookie.helper";

@Controller("/auth")
export class AuthController {
  static inject = [];

  constructor(private readonly authService: AuthService) {}

  @Validate({ body: registerBodySchema })
  @Post("/register", {
    tags: ["Auth"],
    summary: "Registra um novo usuário"
  })
  async register(request: FastifyRequest) {
    const body = request.body as RegisterInput;

    return this.authService.register(body);
  }

  @Validate({ body: loginBodySchema })
  @Post("/login", {
    tags: ["Auth"],
    summary: "Realiza login"
  })
  async login(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as LoginInput;

    const user = await this.authService.validateCredentials(body);

    const accessToken = await reply.jwtSign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN
      }
    );

    const refreshToken = this.authService.generateRefreshToken();
    const csrfToken = this.authService.generateCsrfToken();

    await this.authService.saveRefreshToken({
      userId: user.id,
      refreshToken
    });

    setAuthCookies(reply, {
      accessToken,
      refreshToken,
      csrfToken
    });

    return { user };
  }

  @Post("/refresh", {
    tags: ["Auth"],
    summary: "Renova o access token"
  })
  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const signedRefreshToken = request.cookies[AUTH_COOKIES.refreshToken];

    if (!signedRefreshToken) {
      return reply.status(401).send({
        message: "Refresh token não informado"
      });
    }

    const unsigned = request.unsignCookie(signedRefreshToken);

    if (!unsigned.valid || !unsigned.value) {
      return reply.status(401).send({
        message: "Refresh token inválido"
      });
    }

    const rotated = await this.authService.rotateRefreshToken({
      refreshToken: unsigned.value
    });

    const accessToken = await reply.jwtSign(
      {
        id: rotated.user.id,
        email: rotated.user.email,
        role: rotated.user.role
      },
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN
      }
    );

    const csrfToken = this.authService.generateCsrfToken();

    setAuthCookies(reply, {
      accessToken,
      refreshToken: rotated.refreshToken,
      csrfToken
    });

    return {
      user: rotated.user
    };
  }

  @Csrf()
  @Auth()
  @Post("/logout", {
    tags: ["Auth"],
    summary: "Realiza logout"
  })
  async logout(request: FastifyRequest, reply: FastifyReply) {
    const signedRefreshToken = request.cookies[AUTH_COOKIES.refreshToken];

    if (signedRefreshToken) {
      const unsigned = request.unsignCookie(signedRefreshToken);

      if (unsigned.valid && unsigned.value) {
        await this.authService.revokeRefreshToken(unsigned.value);
      }
    }

    clearAuthCookies(reply);

    return {
      message: "Logout realizado com sucesso"
    };
  }

  @Auth()
  @Get("/me", {
    tags: ["Auth"],
    summary: "Retorna o usuário autenticado"
  })
  async me(request: FastifyRequest) {
    return {
      user: request.user
    };
  }
}
```

## Importante sobre ordem dos decorators

TypeScript executa decorators de baixo para cima.

Use:

```ts
@Validate({ body: loginBodySchema })
@Post("/login")
```

Assim `@Post` registra a rota primeiro e `@Validate` consegue atualizá-la.

## Onde usar

Use `AuthController` para login, refresh, logout e rota `/me`.

## Onde não usar

Não coloque criação de hash, comparação de senha e rotação de token no controller.
