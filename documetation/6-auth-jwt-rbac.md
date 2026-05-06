# 🔐 JWT + RBAC — Autenticação e Autorização Profissional

## 📌 Objetivo

Este documento define a arquitetura de autenticação e autorização do Sports SaaS usando:

- JWT
- Refresh Tokens
- RBAC (Role-Based Access Control)
- Multi-tenant
- Fastify
- Prisma
- Redis

O sistema deve permitir:

- login seguro
- renovação de sessão
- múltiplos papéis
- permissões granulares
- isolamento por tenant
- auditoria de acesso

---

# 🧠 Visão Arquitetural

```txt
Frontend
  ↓
Fastify API
  ↓
JWT Access Token
  ↓
RBAC Guard
  ↓
Services
```

---

# 🎯 Objetivos

## ✔ Segurança

- autenticação stateless
- sessões controladas
- expiração segura
- refresh token
- proteção de rotas

---

## ✔ Multi-tenant

Cada usuário pode:

- pertencer a múltiplas organizações
- possuir papéis diferentes por organização
- alternar contexto ativo

---

## ✔ Escalabilidade

JWT evita sessões pesadas no servidor.

---

# 🧱 Estratégia de autenticação

## Access Token

Curta duração.

```txt
15 minutos
```

---

## Refresh Token

Longa duração.

```txt
7 dias
30 dias (remember me)
```

---

# 🧠 Fluxo completo

```txt
Login
→ valida usuário
→ gera access token
→ gera refresh token
→ frontend salva sessão

Access expira
→ frontend usa refresh
→ backend gera novo access
```

---

# 📁 Estrutura recomendada

```txt
backend/src/modules/auth/
├── auth.routes.ts
├── auth.service.ts
├── auth.schemas.ts
├── auth.jwt.ts
├── auth.rbac.ts
├── auth.middleware.ts
├── auth.constants.ts
├── auth.types.ts
├── auth.decorators.ts
└── errors/
```

---

# 📦 Instalação

```bash
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken
```

---

# 🧩 JWT Service

## auth.jwt.ts

```ts
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export class JwtService {
  generateAccessToken(payload: {
    userId: string;
    tenantId: string;
    organizationId: string;
    role: string;
  }) {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    });
  }

  generateRefreshToken(payload: { userId: string; sessionId: string }) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN
    });
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
  }
}
```

---

# 🔐 Password Hash

## Estratégia

Nunca salvar senha pura.

---

## Exemplo

```ts
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
```

---

# 🧩 Login Service

## auth.service.ts

```ts
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly sessionsRepository: SessionsRepository,
    private readonly jwtService: JwtService
  ) {}

  async login(input: { email: string; password: string }) {
    const user = await this.usersRepository.findByEmail(input.email);

    if (!user || !user.passwordHash) {
      throw new Error('Credenciais inválidas.');
    }

    const passwordMatches = await comparePassword(
      input.password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new Error('Credenciais inválidas.');
    }

    const membership = user.memberships[0];

    const accessToken = this.jwtService.generateAccessToken({
      userId: user.id,
      tenantId: membership.tenantId,
      organizationId: membership.organizationId,
      role: membership.role
    });

    const session = await this.sessionsRepository.create({
      userId: user.id
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      userId: user.id,
      sessionId: session.id
    });

    return {
      accessToken,
      refreshToken,
      user
    };
  }
}
```

---

# 🧠 Estrutura do JWT

## Payload

```json
{
  "userId": "uuid",
  "tenantId": "uuid",
  "organizationId": "uuid",
  "role": "ADMIN"
}
```

---

# 🧩 Middleware Auth

## auth.middleware.ts

```ts
import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({
      message: 'Token não informado.'
    });
  }

  const [, token] = authHeader.split(' ');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);

    request.user = payload;
  } catch {
    return reply.status(401).send({
      message: 'Token inválido.'
    });
  }
}
```

---

# 🧠 Tipagem Fastify

## fastify.d.ts

```ts
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      userId: string;
      tenantId: string;
      organizationId: string;
      role: string;
    };
  }
}
```

---

# 🧩 RBAC

## 🎯 Objetivo

Controlar acesso por papéis.

---

# 📚 Papéis recomendados

```txt
SUPER_ADMIN
TENANT_ADMIN
ORGANIZATION_ADMIN
TOURNAMENT_ADMIN
REFEREE
COACH
ATHLETE
VIEWER
```

---

# 🧩 Auth RBAC

## auth.rbac.ts

```ts
import { FastifyReply, FastifyRequest } from 'fastify';

export function requireRoles(...roles: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    if (!roles.includes(request.user.role)) {
      return reply.status(403).send({
        message: 'Sem permissão.'
      });
    }
  };
}
```

---

# 🧩 Uso nas rotas

```ts
app.post(
  '/tournaments',
  {
    preHandler: [
      authMiddleware,
      requireRoles('SUPER_ADMIN', 'TOURNAMENT_ADMIN')
    ]
  },
  async (request, reply) => {
    return service.create(request.body);
  }
);
```

---

# 🧠 Multi-tenant obrigatório

Toda query deve validar:

```txt
tenantId
organizationId
```

---

# ❌ ERRADO

```ts
findMany();
```

---

# ✅ CORRETO

```ts
findMany({
  where: {
    tenantId: request.user.tenantId
  }
});
```

---

# 🔄 Refresh Token

## Fluxo

```txt
Access expirou
→ frontend envia refresh
→ backend valida sessão
→ gera novo access
```

---

## Exemplo rota

```ts
app.post('/auth/refresh', async request => {
  const body = request.body as {
    refreshToken: string;
  };

  const payload = jwtService.verifyRefreshToken(body.refreshToken);

  const accessToken = jwtService.generateAccessToken({
    userId: payload.userId,
    tenantId: payload.tenantId,
    organizationId: payload.organizationId,
    role: payload.role
  });

  return {
    accessToken
  };
});
```

---

# 🔒 Logout

## Estratégia

- invalidar sessão no banco
- opcionalmente blacklist Redis

---

# 📦 Redis blacklist

```txt
blacklist:token:{jwtId}
```

---

# ⚡ WebSocket Auth

## Obrigatório

```ts
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);

    socket.data.user = payload;

    next();
  } catch {
    next(new Error('Unauthorized'));
  }
});
```

---

# 🧠 Permissões recomendadas

| Ação              | Papel            |
| ----------------- | ---------------- |
| criar torneio     | TOURNAMENT_ADMIN |
| adicionar ponto   | REFEREE          |
| finalizar partida | REFEREE          |
| editar ranking    | SUPER_ADMIN      |
| ver ranking       | ATHLETE          |
| ver placar        | VIEWER           |

---

# ⚠️ Erros comuns

## ❌ Guardar senha sem hash

Nunca.

---

## ❌ JWT sem expiração

Risco enorme de segurança.

---

## ❌ Não validar tenantId

Pode vazar dados entre organizações.

---

## ❌ Role no frontend apenas

Frontend não protege backend.

Sempre validar no servidor.

---

## ❌ Refresh infinito

Refresh token também precisa expirar.

---

# 🧪 Testes recomendados

## Cenários obrigatórios

- login válido
- login inválido
- token expirado
- token inválido
- rota protegida
- RBAC funcionando
- tenant isolado
- refresh token
- logout
- websocket autenticado

---

# 📊 Complexidade Big-O

| Operação        | Complexidade |
| --------------- | ------------ |
| gerar JWT       | O(1)         |
| validar JWT     | O(1)         |
| verificar role  | O(1)         |
| refresh token   | O(1)         |
| blacklist Redis | O(1)         |

---

# 🚀 Roadmap Segurança

## Fase 1

- JWT
- RBAC
- refresh token
- middleware auth

---

## Fase 2

- Redis blacklist
- device tracking
- MFA OTP
- auditoria

---

## Fase 3

- OAuth Google
- OAuth Apple
- SSO enterprise
- WebAuthn/passkeys

---

## Fase 4

- ABAC
- permission matrix
- IAM avançado
- SIEM integration

---

# 🏁 Conclusão

Com JWT + RBAC o Sports SaaS ganha:

- autenticação segura
- controle granular de acesso
- isolamento multi-tenant
- escalabilidade
- realtime autenticado
- base enterprise

Essa arquitetura está preparada para crescimento profissional do produto.

Executado o item 6.

Criei o `.md` profissional de **JWT + RBAC**, cobrindo:

✅ autenticação JWT
✅ refresh token
✅ middleware Fastify
✅ RBAC por roles
✅ multi-tenant seguro
✅ WebSocket autenticado
✅ Redis blacklist
✅ proteção por tenantId
✅ fluxo de login/logout
✅ testes de segurança
✅ roadmap enterprise

Agora sua arquitetura possui:

```txt
✔ Fastify
✔ Prisma
✔ Repository Pattern
✔ Transactions
✔ Redis
✔ WebSocket
✔ JWT + RBAC
✔ Multi-tenant
✔ SaaS Architecture
```

O próximo nível recomendado é:

```txt
7 → CI/CD GitHub Actions
8 → Observabilidade (logs, métricas)
9 → Event-driven architecture
10 → App mobile React Native
```
