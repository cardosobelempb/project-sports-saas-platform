# 🧱 PrismaService + Repository Pattern + Transactions

## 📌 Objetivo

Este documento define a arquitetura profissional de persistência do sistema Sports SaaS.

A implementação será baseada em:

- Prisma ORM
- PostgreSQL
- Repository Pattern
- Transactions
- Services desacoplados
- Fastify
- TypeScript

---

# 🧠 Visão Arquitetural

```txt
Controller
  ↓
Service (Use Cases)
  ↓
Repository
  ↓
PrismaService
  ↓
PostgreSQL
```

---

# 🎯 Objetivos da Arquitetura

## ✔ Separar responsabilidades

| Camada        | Responsabilidade |
| ------------- | ---------------- |
| Route         | HTTP             |
| Service       | regra de negócio |
| Repository    | persistência     |
| PrismaService | acesso banco     |

---

## ✔ Benefícios

- código desacoplado
- fácil manutenção
- testes simplificados
- troca de ORM futura
- escalabilidade
- transactions centralizadas

---

# 📁 Estrutura recomendada

```txt
backend/src/
├── infra/
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   ├── prisma.plugin.ts
│   │   └── prisma.types.ts
│
├── modules/
│   ├── athletes/
│   │   ├── athletes.routes.ts
│   │   ├── athletes.service.ts
│   │   ├── athletes.repository.ts
│   │   ├── athletes.schemas.ts
│   │   └── athletes.types.ts
```

---

# ⚙️ Instalação Prisma

```bash
npm install prisma @prisma/client
```

---

## Inicialização

```bash
npx prisma init
```

---

# 🧱 PrismaService

## prisma.service.ts

```ts
import { PrismaClient } from '@prisma/client';

export class PrismaService extends PrismaClient {
  async connect() {
    await this.$connect();
  }

  async disconnect() {
    await this.$disconnect();
  }
}
```

---

# 🔌 Plugin Fastify

## prisma.plugin.ts

```ts
import fp from 'fastify-plugin';
import { PrismaService } from './prisma.service';

export default fp(async fastify => {
  const prisma = new PrismaService();

  await prisma.connect();

  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async () => {
    await prisma.disconnect();
  });
});
```

---

# 🧠 Tipagem Fastify

## fastify.d.ts

```ts
import 'fastify';
import { PrismaService } from './infra/prisma/prisma.service';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaService;
  }
}
```

---

# 🧩 Repository Pattern

## 🎯 Objetivo

O repository abstrai acesso ao banco.

Service nunca acessa Prisma diretamente.

---

# ❌ ERRADO

```ts
class AthleteService {
  async create(data) {
    return prisma.athlete.create({ data });
  }
}
```

---

# ✅ CORRETO

```ts
class AthleteService {
  constructor(private readonly repository: AthletesRepository) {}
}
```

---

# 🏓 Athletes Repository

## athletes.repository.ts

```ts
import { PrismaService } from '@/infra/prisma/prisma.service';

export class AthletesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { userId: string; nickname?: string }) {
    return this.prisma.athlete.create({
      data,
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  async findById(id: string) {
    return this.prisma.athlete.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        rankings: true
      }
    });
  }

  async findMany() {
    return this.prisma.athlete.findMany({
      include: {
        user: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
```

---

# 🧠 Athlete Service

## athletes.service.ts

```ts
import { AthletesRepository } from './athletes.repository';

export class AthletesService {
  constructor(private readonly repository: AthletesRepository) {}

  async create(input: { userId: string; nickname?: string }) {
    const athlete = await this.repository.create({
      userId: input.userId,
      nickname: input.nickname
    });

    return athlete;
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async findMany() {
    return this.repository.findMany();
  }
}
```

---

# 🔥 Transactions

## 🎯 Objetivo

Garantir consistência.

---

# 🏆 Exemplo real

Criar atleta + ranking inicial.

Se ranking falhar:

❌ atleta não pode existir sozinho.

---

# ✅ Transaction correta

```ts
await prisma.$transaction(async tx => {
  const athlete = await tx.athlete.create({
    data: {
      userId,
      nickname
    }
  });

  await tx.athleteRanking.create({
    data: {
      athleteId: athlete.id,
      sportId,
      rating: 1000
    }
  });
});
```

---

# ⚠️ Erros comuns

## ❌ Múltiplos creates sem transaction

```ts
await prisma.athlete.create();
await prisma.athleteRanking.create();
```

Problema:

- primeiro salva
- segundo falha
- banco inconsistente

---

## ❌ Repository com regra de negócio

Repository NÃO deve:

- calcular ranking
- validar regras
- decidir vencedor

---

## ❌ Service acessando Prisma direto

Quebra desacoplamento.

---

# 🧠 Estratégia de módulos

Cada módulo deve possuir:

```txt
module/
├── routes
├── service
├── repository
├── schemas
├── types
├── mapper
└── errors
```

---

# 🧩 Mapper Pattern

## 🎯 Objetivo

Transformar entidade banco → resposta API.

---

## athlete.mapper.ts

```ts
export class AthleteMapper {
  static toResponse(data: any) {
    return {
      id: data.id,
      nickname: data.nickname,
      fullName: data.user?.profile?.displayName,
      createdAt: data.createdAt
    };
  }
}
```

---

# 🧠 Estratégia de Errors

## errors/

```txt
errors/
├── athlete-not-found.error.ts
├── invalid-match.error.ts
├── ranking-update.error.ts
└── unauthorized.error.ts
```

---

# 🧠 Exemplo Error

```ts
export class AthleteNotFoundError extends Error {
  constructor() {
    super('Athlete not found');
  }
}
```

---

# 🧪 Testes

## Estratégia recomendada

| Tipo       | Ferramenta     |
| ---------- | -------------- |
| unitário   | Vitest         |
| integração | Supertest      |
| banco      | Testcontainers |

---

# 📊 Performance

## Índices obrigatórios

```prisma
@@index([sportId, rating])
@@index([athleteId])
@@index([status])
```

---

# 🚀 Evolução futura

## Próximos níveis

- Redis cache
- filas BullMQ
- CQRS
- event sourcing parcial
- websocket scaling
- sharding futuro

---

# 🔐 Segurança

## Regras obrigatórias

- nunca expor passwordHash
- validar tenantId
- RBAC
- soft delete global
- logs auditáveis

---

# 🏁 Conclusão

Com essa arquitetura:

✔ Prisma desacoplado
✔ Services limpos
✔ Transactions seguras
✔ Código testável
✔ Escalável
✔ SaaS profissional

O sistema agora possui base real de produção.

Perfeito.
Executei o próximo passo da arquitetura profissional:

✅ PrismaService
✅ Plugin Fastify
✅ Repository Pattern
✅ Transactions
✅ Mapper Pattern
✅ Estratégia modular
✅ Estrutura de errors
✅ Padrões de services
