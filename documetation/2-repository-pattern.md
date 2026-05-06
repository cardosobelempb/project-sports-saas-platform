# 🧱 Repository Pattern — Implementação Completa

## 📌 Objetivo

Este documento define a implementação profissional do Repository Pattern no Sports SaaS.

A arquitetura foi projetada para:

- desacoplamento
- testabilidade
- manutenção
- escalabilidade
- troca futura de ORM
- padronização dos módulos

---

# 🧠 Conceito

O Repository Pattern é responsável por:

```txt
abstrair acesso ao banco de dados
```

O Service não conhece:

- Prisma
- SQL
- PostgreSQL
- MongoDB
- queries

Ele conhece apenas:

```txt
contratos
```

---

# 🎯 Objetivos

## ✔ Separação de responsabilidades

| Camada     | Responsabilidade |
| ---------- | ---------------- |
| Route      | HTTP             |
| Service    | regra de negócio |
| Repository | persistência     |
| Prisma     | ORM              |
| PostgreSQL | armazenamento    |

---

# ❌ Problema comum

## Service acessando Prisma direto

```ts
class AthletesService {
  async create(data) {
    return prisma.athlete.create({
      data
    });
  }
}
```

---

## Problemas

- alto acoplamento
- difícil testar
- difícil trocar ORM
- lógica espalhada
- baixa reutilização

---

# ✅ Arquitetura correta

```txt
Route
 ↓
Service
 ↓
Repository Interface
 ↓
Prisma Repository
 ↓
Database
```

---

# 📁 Estrutura recomendada

```txt
modules/
├── athletes/
│   ├── athletes.routes.ts
│   ├── athletes.service.ts
│   ├── athletes.repository.ts
│   ├── athletes.repository.interface.ts
│   ├── athletes.schemas.ts
│   ├── athletes.mapper.ts
│   ├── athletes.types.ts
│   └── errors/
```

---

# 🧩 Repository Interface

## athletes.repository.interface.ts

```ts
import { Athlete } from '@prisma/client';

export interface IAthletesRepository {
  create(data: { userId: string; nickname?: string }): Promise<Athlete>;

  findById(id: string): Promise<Athlete | null>;

  findMany(): Promise<Athlete[]>;

  delete(id: string): Promise<void>;
}
```

---

# 🧠 Benefícios da Interface

## ✔ Facilita testes

Pode criar:

```txt
FakeRepository
InMemoryRepository
MockRepository
```

---

## ✔ Facilita troca ORM

Hoje:

```txt
Prisma
```

Futuro:

```txt
Drizzle
TypeORM
Mongo
```

Service não muda.

---

# 🏓 Prisma Repository

## athletes.repository.ts

```ts
import { PrismaService } from '@/infra/prisma/prisma.service';
import { IAthletesRepository } from './athletes.repository.interface';

export class AthletesRepository implements IAthletesRepository {
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
      where: {
        id
      },
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
      where: {
        deletedAt: null
      },
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

  async delete(id: string) {
    await this.prisma.athlete.update({
      where: {
        id
      },
      data: {
        deletedAt: new Date()
      }
    });
  }
}
```

---

# 🧠 Service Limpo

## athletes.service.ts

```ts
import { IAthletesRepository } from './athletes.repository.interface';

export class AthletesService {
  constructor(private readonly repository: IAthletesRepository) {}

  async create(input: { userId: string; nickname?: string }) {
    const athlete = await this.repository.create({
      userId: input.userId,
      nickname: input.nickname
    });

    return athlete;
  }

  async findById(id: string) {
    const athlete = await this.repository.findById(id);

    if (!athlete) {
      throw new Error('Athlete not found');
    }

    return athlete;
  }
}
```

---

# 🔥 Dependency Injection

## routes.ts

```ts
const repository = new AthletesRepository(fastify.prisma);

const service = new AthletesService(repository);
```

---

# 🧪 Testes Unitários

## Fake Repository

```ts
export class FakeAthletesRepository implements IAthletesRepository {
  private athletes = [];

  async create(data) {
    const athlete = {
      id: crypto.randomUUID(),
      ...data
    };

    this.athletes.push(athlete);

    return athlete;
  }

  async findById(id: string) {
    return this.athletes.find(athlete => athlete.id === id) ?? null;
  }

  async findMany() {
    return this.athletes;
  }

  async delete(id: string) {
    this.athletes = this.athletes.filter(athlete => athlete.id !== id);
  }
}
```

---

# 🧠 Benefícios dos testes

## ✔ Sem banco

Testes:

- rápidos
- previsíveis
- baratos

---

# ⚠️ Erros comuns

## ❌ Repository com regra de negócio

Repository NÃO deve:

- calcular ELO
- validar saque
- decidir vencedor
- gerar torneio

---

## ❌ Service com SQL

```ts
await prisma.$queryRaw;
```

❌ errado no Service.

---

## ❌ Route acessando banco

Route deve apenas:

- validar entrada
- chamar service
- retornar resposta

---

# 🧠 Estratégia de Queries

## Repository deve centralizar:

- includes
- selects
- paginação
- filtros
- ordenação

---

# 📊 Exemplo Paginação

```ts
async paginate(input: {
  page: number
  limit: number
}) {
  return this.prisma.athlete.findMany({
    skip: (input.page - 1) * input.limit,
    take: input.limit,
    orderBy: {
      createdAt: 'desc',
    },
  })
}
```

---

# 🚀 Evolução futura

## Próximos níveis

- Generic Repository
- Query Builders
- CQRS
- Read Models
- Event Store
- Cache Layer

---

# 🧠 Estratégia ideal do Sports SaaS

## Services

Responsáveis por:

- ranking
- torneio
- placar
- regras
- anti-fraude

---

## Repository

Responsável por:

- salvar
- buscar
- atualizar
- deletar
- paginação

---

# 🔐 Segurança

## Repository deve sempre validar:

- deletedAt
- tenantId
- organizationId

---

# 🏁 Conclusão

Com Repository Pattern:

✔ baixo acoplamento
✔ código limpo
✔ fácil manutenção
✔ fácil teste
✔ arquitetura profissional
✔ escalabilidade real

A base do sistema agora segue padrão enterprise.

Perfeito.
Executei o item 2 profissionalmente:

✅ Repository Pattern completo
✅ Interface + implementação Prisma
✅ Dependency Injection
✅ Services desacoplados
✅ FakeRepository para testes
✅ Estratégia de paginação
✅ Organização modular
✅ Padrões enterprise

E também gerei a documentação `.md` específica do assunto, separando:

- conceitos
- arquitetura
- exemplos
- erros comuns
- boas práticas
- evolução futura
