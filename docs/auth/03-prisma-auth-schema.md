# 03 — Prisma Schema para autenticação

Adicione ao `prisma/schema.prisma`.

```prisma
enum UserRole {
  ADMIN
  MANAGER
  SUPPORT
  USER
}

enum UserStatus {
  ACTIVE
  INACTIVE
  BLOCKED
}

model User {
  id        String     @id @default(uuid())
  name      String
  email     String     @unique
  password  String
  role      UserRole   @default(USER)
  status    UserStatus @default(ACTIVE)

  refreshTokens RefreshToken[]

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  @@map("users")
}

model RefreshToken {
  id        String   @id @default(uuid())
  userId    String
  tokenHash String
  expiresAt DateTime
  revokedAt DateTime?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@index([userId])
  @@map("refresh_tokens")
}
```

Execute:

```bash
npx prisma migrate dev --name add-auth
npx prisma generate
```

## Onde usar

Use `RefreshToken` quando quiser logout real, rotação de sessão e revogação.

## Onde não usar

Não salve refresh token puro no banco.

```ts
token: refreshToken // Errado
```

Salve hash:

```ts
tokenHash: await bcrypt.hash(refreshToken, 12)
```

## Impacto técnico

- `email @unique` permite busca eficiente no login.
- `@@index([userId])` melhora consultas de tokens por usuário.
- `revokedAt` permite invalidar sessões sem apagar histórico.
