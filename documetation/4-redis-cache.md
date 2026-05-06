# ⚡ Redis Cache — Performance, Realtime e Escalabilidade

## 📌 Objetivo

Este documento define como utilizar **Redis** no Sports SaaS para melhorar performance, reduzir carga no banco e preparar o sistema para realtime em escala.

O Redis será usado para:

- cache de ranking
- cache de placar ao vivo
- controle de sessão temporária
- rate limit
- locks distribuídos
- invalidação de dados
- WebSocket em múltiplas instâncias
- filas futuras com BullMQ

---

# 🧠 Por que Redis?

O sistema possui dados que são:

- muito acessados
- atualizados com frequência
- sensíveis à performance
- usados em tempo real

Exemplos:

```txt
ranking geral
ranking por esporte
ranking por cidade
placar ao vivo
salas websocket
limites anti-fraude
```

Consultar tudo direto no PostgreSQL pode gerar:

- lentidão
- alto custo
- gargalos
- bloqueios
- má experiência no placar ao vivo

---

# 🧱 Arquitetura

```txt
Frontend
  ↓
Fastify API
  ↓
Service
  ↓
Redis Cache ←→ Prisma/PostgreSQL
```

---

# 📦 Instalação

```bash
npm install ioredis
```

---

# 📁 Estrutura recomendada

```txt
backend/src/infra/redis/
├── redis.service.ts
├── redis.plugin.ts
├── redis.keys.ts
├── redis.ttl.ts
└── redis.types.ts
```

---

# 🔌 RedisService

## redis.service.ts

```ts
import Redis from 'ioredis';

export class RedisService {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');
  }

  getClient() {
    return this.client;
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);

    if (!value) return null;

    return JSON.parse(value) as T;
  }

  async set(key: string, value: unknown, ttlInSeconds?: number) {
    const serialized = JSON.stringify(value);

    if (ttlInSeconds) {
      await this.client.set(key, serialized, 'EX', ttlInSeconds);
      return;
    }

    await this.client.set(key, serialized);
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async delByPattern(pattern: string) {
    const keys = await this.client.keys(pattern);

    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  async disconnect() {
    await this.client.quit();
  }
}
```

---

# 🔌 Plugin Fastify

## redis.plugin.ts

```ts
import fp from 'fastify-plugin';
import { RedisService } from './redis.service';

export default fp(async fastify => {
  const redis = new RedisService();

  fastify.decorate('redis', redis);

  fastify.addHook('onClose', async () => {
    await redis.disconnect();
  });
});
```

---

# 🧠 Tipagem Fastify

## fastify.d.ts

```ts
import 'fastify';
import { RedisService } from '@/infra/redis/redis.service';

declare module 'fastify' {
  interface FastifyInstance {
    redis: RedisService;
  }
}
```

---

# 🔑 Estratégia de chaves

## redis.keys.ts

```ts
export const RedisKeys = {
  rankingGlobal: (sportId: string) => `ranking:global:sport:${sportId}`,

  rankingCity: (sportId: string, cityId: string) =>
    `ranking:city:${cityId}:sport:${sportId}`,

  rankingClub: (sportId: string, clubId: string) =>
    `ranking:club:${clubId}:sport:${sportId}`,

  scoreboard: (matchId: string) => `scoreboard:match:${matchId}`,

  athleteDailyMatches: (athleteId: string, date: string) =>
    `athlete:${athleteId}:matches:${date}`,

  sameOpponentDailyMatches: (
    athleteAId: string,
    athleteBId: string,
    date: string
  ) => `matches:same-opponent:${athleteAId}:${athleteBId}:${date}`,

  lockMatch: (matchId: string) => `lock:match:${matchId}`
};
```

---

# ⏱️ TTL recomendado

## redis.ttl.ts

```ts
export const RedisTTL = {
  ranking: 60 * 5, // 5 minutos
  scoreboard: 60 * 60 * 6, // 6 horas
  antiFraud: 60 * 60 * 24, // 24 horas
  shortLock: 10 // 10 segundos
};
```

---

# 📊 Cache de Ranking

## Fluxo

```txt
1. API recebe pedido de ranking
2. Busca no Redis
3. Se existir, retorna cache
4. Se não existir, busca no PostgreSQL
5. Salva no Redis
6. Retorna resposta
```

---

## Exemplo

```ts
async getGlobalRanking(sportId: string) {
  const key = RedisKeys.rankingGlobal(sportId)

  const cachedRanking = await this.redis.get(key)

  if (cachedRanking) {
    return cachedRanking
  }

  const ranking = await this.repository.getGlobalRanking(sportId)

  await this.redis.set(key, ranking, RedisTTL.ranking)

  return ranking
}
```

---

# 🔄 Invalidação de Ranking

Sempre invalidar cache quando:

- partida finaliza
- ranking recalcula
- atleta sofre ajuste manual
- punição altera rating

---

## Exemplo

```ts
async invalidateRankingCache(sportId: string) {
  await this.redis.delByPattern(`ranking:*:sport:${sportId}`)
}
```

---

# 🏓 Cache de Scoreboard

O placar eletrônico é acessado muitas vezes por segundo.

## Estratégia

- estado quente no Redis
- histórico oficial no PostgreSQL
- frontend escuta WebSocket
- banco não deve ser consultado a cada render

---

## Exemplo

```ts
async getScoreboard(matchId: string) {
  const key = RedisKeys.scoreboard(matchId)

  const cached = await this.redis.get(key)

  if (cached) return cached

  const scoreboard = await this.repository.findByMatchId(matchId)

  await this.redis.set(key, scoreboard, RedisTTL.scoreboard)

  return scoreboard
}
```

---

## Atualização de placar

```ts
async updateScoreboardCache(matchId: string, scoreboard: unknown) {
  const key = RedisKeys.scoreboard(matchId)

  await this.redis.set(key, scoreboard, RedisTTL.scoreboard)
}
```

---

# 🔐 Anti-fraude com Redis

## Objetivo

Evitar abuso como:

- muitas partidas entre os mesmos atletas
- farming de pontos
- spam de criação de partidas
- múltiplos cliques no placar

---

## Exemplo: limite de partidas por dia

```ts
async incrementDailyMatchCounter(athleteId: string) {
  const date = new Date().toISOString().slice(0, 10)
  const key = RedisKeys.athleteDailyMatches(athleteId, date)

  const total = await this.redis.getClient().incr(key)

  if (total === 1) {
    await this.redis.getClient().expire(key, RedisTTL.antiFraud)
  }

  if (total > 20) {
    throw new Error('Limite diário de partidas atingido.')
  }
}
```

---

# 🔒 Locks distribuídos

## Problema

O árbitro pode clicar duas vezes no botão de ponto.

Sem lock:

```txt
clique duplicado → dois pontos lançados
```

---

## Solução

Usar lock curto por partida.

```ts
async withMatchLock<T>(matchId: string, callback: () => Promise<T>) {
  const key = RedisKeys.lockMatch(matchId)

  const acquired = await this.redis
    .getClient()
    .set(key, 'locked', 'EX', RedisTTL.shortLock, 'NX')

  if (!acquired) {
    throw new Error('Operação em andamento. Tente novamente.')
  }

  try {
    return await callback()
  } finally {
    await this.redis.del(key)
  }
}
```

---

# 📡 WebSocket em múltiplas instâncias

Quando houver mais de uma instância da API, Socket.IO precisa compartilhar eventos.

---

# 📦 Instalação

```bash
npm install @socket.io/redis-adapter
```

---

# 🔌 Adapter Redis

```ts
import { createAdapter } from '@socket.io/redis-adapter';
import { Server } from 'socket.io';
import Redis from 'ioredis';

export function configureRedisAdapter(io: Server) {
  const pubClient = new Redis(process.env.REDIS_URL!);
  const subClient = pubClient.duplicate();

  io.adapter(createAdapter(pubClient, subClient));
}
```

---

# 🧠 Estratégia de uso

```txt
Instância A recebe ponto
→ emite evento
→ Redis Adapter replica
→ Instância B entrega para seus sockets
```

---

# ⚠️ Erros comuns

## ❌ Cache sem invalidação

Dados ficam desatualizados.

---

## ❌ Guardar dado crítico apenas no Redis

Redis é cache, não fonte oficial.

Fonte oficial:

```txt
PostgreSQL
```

---

## ❌ Usar KEYS em produção grande

`keys(pattern)` pode pesar em bases grandes.

Para MVP é aceitável.

Para produção maior, usar:

```txt
SCAN
```

---

## ❌ Lock sem expiração

Pode travar recurso para sempre.

Sempre usar TTL.

---

# 🧪 Testes recomendados

## Cenários obrigatórios

- ranking deve vir do cache quando existir
- cache deve ser criado quando não existir
- cache deve ser invalidado após partida
- lock deve impedir clique duplo
- scoreboard deve ser atualizado no Redis
- Redis fora do ar não pode derrubar fluxo crítico sem fallback

---

# 📊 Complexidade Big-O

| Operação             | Complexidade                       |
| -------------------- | ---------------------------------- |
| get cache            | O(1)                               |
| set cache            | O(1)                               |
| del key              | O(1)                               |
| contador anti-fraude | O(1)                               |
| lock                 | O(1)                               |
| ranking DB fallback  | O(n log n) dependendo da ordenação |

---

# 🧠 Boas práticas

## 1. Cache-aside

O service controla:

```txt
buscar cache → fallback banco → salvar cache
```

---

## 2. TTL sempre

Evita dados velhos eternamente.

---

## 3. Fonte oficial no PostgreSQL

Redis acelera, não substitui banco.

---

## 4. Invalidar após escrita

Toda escrita relevante deve limpar cache.

---

## 5. Locks em ações sensíveis

Usar lock para:

- adicionar ponto
- finalizar partida
- recalcular ranking
- gerar chaveamento

---

# 🚀 Roadmap Redis

## Fase 1

- cache ranking
- cache scoreboard
- locks simples
- anti-fraude básico

---

## Fase 2

- Redis Adapter Socket.IO
- rate limiting global
- sessão temporária

---

## Fase 3

- BullMQ
- filas assíncronas
- processamento de ranking
- notificações

---

# 🏁 Conclusão

Redis será uma peça central para performance e realtime.

Ele melhora:

- ranking
- placar eletrônico
- WebSocket
- anti-fraude
- escalabilidade

Com Redis, o Sports SaaS fica preparado para maior volume de usuários e partidas simultâneas.

Executado o item 4.

Criei o `.md` profissional de **Redis Cache**, cobrindo:

✅ cache de ranking
✅ cache de placar eletrônico
✅ anti-fraude com Redis
✅ locks distribuídos
✅ invalidação de cache
✅ Redis Adapter para WebSocket
✅ estratégia de TTL
✅ erros comuns
✅ testes recomendados
✅ análise Big-O
