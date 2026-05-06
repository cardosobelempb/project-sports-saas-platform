# 09 — AuthService

Crie:

```txt
src/modules/auth/auth.service.ts
```

```ts
import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import type { LoginInput, RegisterInput } from "./auth.schemas";
import { REFRESH_TOKEN_EXPIRES_IN_DAYS } from "@/shared/auth/auth.constants";

export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async register(input: RegisterInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email }
    });

    if (existingUser) {
      throw new Error("E-mail já cadastrado");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    return this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
  }

  async validateCredentials(input: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email }
    });

    if (!user || user.deletedAt || user.status !== "ACTIVE") {
      throw new Error("Credenciais inválidas");
    }

    const passwordIsValid = await bcrypt.compare(input.password, user.password);

    if (!passwordIsValid) {
      throw new Error("Credenciais inválidas");
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString("hex");
  }

  generateCsrfToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  async saveRefreshToken(input: {
    userId: string;
    refreshToken: string;
  }) {
    const tokenHash = await bcrypt.hash(input.refreshToken, 12);
    const expiresAt = this.createRefreshExpirationDate();

    return this.prisma.refreshToken.create({
      data: {
        userId: input.userId,
        tokenHash,
        expiresAt
      }
    });
  }

  async rotateRefreshToken(input: { refreshToken: string }) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        revokedAt: null,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    });

    const storedToken = await this.findMatchingRefreshToken(
      input.refreshToken,
      tokens
    );

    if (!storedToken) {
      throw new Error("Refresh token inválido");
    }

    const newRefreshToken = this.generateRefreshToken();
    const newTokenHash = await bcrypt.hash(newRefreshToken, 12);

    await this.prisma.$transaction([
      this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() }
      }),

      this.prisma.refreshToken.create({
        data: {
          userId: storedToken.userId,
          tokenHash: newTokenHash,
          expiresAt: this.createRefreshExpirationDate()
        }
      })
    ]);

    return {
      user: {
        id: storedToken.user.id,
        email: storedToken.user.email,
        role: storedToken.user.role
      },
      refreshToken: newRefreshToken
    };
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        revokedAt: null
      }
    });

    const storedToken = await this.findMatchingRefreshToken(
      refreshToken,
      tokens
    );

    if (!storedToken) {
      return;
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() }
    });
  }

  private createRefreshExpirationDate(): Date {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);
    return expiresAt;
  }

  private async findMatchingRefreshToken<T extends { tokenHash: string }>(
    plainToken: string,
    tokens: T[]
  ): Promise<T | null> {
    for (const token of tokens) {
      const matches = await bcrypt.compare(plainToken, token.tokenHash);

      if (matches) {
        return token;
      }
    }

    return null;
  }
}
```

## Onde usar

Use no AuthController.

## Onde não usar

Não coloque lógica de autenticação diretamente no controller.

## Observação de performance

A busca dos refresh tokens neste exemplo é didática. Em alto volume, prefira salvar um `tokenId` ou hash determinístico indexado.
