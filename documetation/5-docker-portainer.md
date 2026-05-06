# 🐳 Docker + Portainer — Deploy Profissional do Sports SaaS

## 📌 Objetivo

Este documento define a estratégia profissional de containerização e deploy do Sports SaaS usando:

- Docker
- Docker Compose
- Portainer
- PostgreSQL
- Redis
- Fastify API
- Next.js Frontend
- Prisma
- CI/CD futuro com GitHub Actions

---

# 🧠 Visão Geral

A arquitetura de deploy será baseada em containers para garantir:

- ambiente previsível
- fácil deploy
- rollback mais simples
- escalabilidade futura
- separação entre serviços
- compatibilidade com Portainer

---

# 🧱 Serviços do Stack

```txt
sports-saas-stack
├── backend        Fastify API
├── frontend       Next.js App
├── postgres       Banco principal
├── redis          Cache / realtime / locks
└── nginx          Proxy reverso futuro
```

---

# 🎯 Por que Docker?

Docker permite empacotar aplicação e dependências em containers portáveis, reduzindo diferenças entre ambiente local, homologação e produção.

Boas práticas modernas recomendam imagens menores e mais seguras com multi-stage builds, separando etapa de build da etapa final de runtime.

---

# 📁 Estrutura recomendada

```txt
sports-saas/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
└── docs/
    └── deployment.md
```

---

# 🧩 Backend Dockerfile

## backend/Dockerfile

```dockerfile
# Etapa 1: dependências
FROM node:22-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Etapa 2: build
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Etapa 3: produção
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN npm prune --omit=dev

EXPOSE 3333

CMD ["node", "dist/server.js"]
```

---

# 🧩 Backend .dockerignore

```txt
node_modules
dist
.env
.git
.gitignore
Dockerfile
npm-debug.log
coverage
```

---

# 🧩 Frontend Dockerfile

## frontend/Dockerfile

```dockerfile
# Etapa 1: dependências
FROM node:22-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Etapa 2: build
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Etapa 3: produção
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=deps /app/node_modules ./node_modules

RUN npm prune --omit=dev

EXPOSE 3000

CMD ["npm", "start"]
```

---

# 🧩 Frontend .dockerignore

```txt
node_modules
.next
.env
.git
.gitignore
Dockerfile
npm-debug.log
coverage
```

---

# ⚙️ docker-compose.yml — Desenvolvimento

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: sports_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: sports
      POSTGRES_PASSWORD: sports
      POSTGRES_DB: sports_saas
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - sports_network

  redis:
    image: redis:7-alpine
    container_name: sports_redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - sports_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: sports_backend
    restart: unless-stopped
    depends_on:
      - postgres
      - redis
    environment:
      NODE_ENV: development
      PORT: 3333
      DATABASE_URL: postgresql://sports:sports@postgres:5432/sports_saas?schema=public
      REDIS_URL: redis://redis:6379
      JWT_SECRET: change-me
    ports:
      - '3333:3333'
    networks:
      - sports_network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: sports_frontend
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3333
      NEXT_PUBLIC_SOCKET_URL: http://localhost:3333
    ports:
      - '3000:3000'
    networks:
      - sports_network

volumes:
  postgres_data:
  redis_data:

networks:
  sports_network:
    driver: bridge
```

---

# 🚀 docker-compose.prod.yml — Produção

```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - sports_network

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - sports_network

  backend:
    image: cardosobelempb/sports-saas-backend:latest
    restart: unless-stopped
    depends_on:
      - postgres
      - redis
    environment:
      NODE_ENV: production
      PORT: 3333
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - '3333:3333'
    networks:
      - sports_network

  frontend:
    image: cardosobelempb/sports-saas-frontend:latest
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
      NEXT_PUBLIC_SOCKET_URL: ${NEXT_PUBLIC_SOCKET_URL}
    ports:
      - '3000:3000'
    networks:
      - sports_network

volumes:
  postgres_data:
  redis_data:

networks:
  sports_network:
    driver: bridge
```

---

# 🔐 .env.example

```env
# App
NODE_ENV=production

# Backend
PORT=3333
JWT_SECRET=change-this-secret

# PostgreSQL
POSTGRES_USER=sports
POSTGRES_PASSWORD=strong-password
POSTGRES_DB=sports_saas
DATABASE_URL=postgresql://sports:strong-password@postgres:5432/sports_saas?schema=public

# Redis
REDIS_PASSWORD=strong-redis-password
REDIS_URL=redis://:strong-redis-password@redis:6379

# Frontend
NEXT_PUBLIC_API_URL=https://api.seudominio.com
NEXT_PUBLIC_SOCKET_URL=https://api.seudominio.com
```

---

# 🧠 Prisma em produção

## Estratégia recomendada

Executar migrations antes de subir release final.

```bash
npx prisma migrate deploy
```

---

## Opção no container

Criar script:

```json
{
  "scripts": {
    "start:prod": "node dist/server.js",
    "migrate:deploy": "prisma migrate deploy"
  }
}
```

---

# ⚠️ Observação importante

Não rode `prisma migrate dev` em produção.

Use:

```bash
prisma migrate deploy
```

---

# 🧭 Deploy via Portainer

## Estratégia recomendada

Usar Stack via Git Repository.

Fluxo:

```txt
GitHub Repository
→ Portainer Stack
→ docker-compose.prod.yml
→ pull images
→ deploy
```

---

# 📌 Passos no Portainer

1. Acesse Portainer
2. Vá em **Stacks**
3. Clique em **Add Stack**
4. Escolha **Repository**
5. Informe URL do GitHub
6. Informe branch principal
7. Informe caminho:

```txt
docker-compose.prod.yml
```

8. Configure variáveis de ambiente
9. Clique em Deploy

---

# 🔄 Atualização de versão

## Estratégia simples

```txt
GitHub Actions builda imagem
→ envia Docker Hub
→ Portainer faz pull
→ recria containers
```

---

# 🏷️ Tags recomendadas

```txt
latest
main
v1.0.0
commit-sha
```

---

# 🔐 Segurança em produção

## Obrigatório

- não commitar `.env`
- usar secrets no Portainer
- trocar JWT_SECRET
- usar senha forte no Postgres
- usar senha no Redis
- não expor Postgres publicamente
- não expor Redis publicamente
- usar HTTPS via proxy reverso

---

# 🌐 Nginx Proxy futuro

## Exemplo conceitual

```txt
api.seudominio.com → backend:3333
app.seudominio.com → frontend:3000
```

---

# 🧪 Healthcheck

## Backend

```ts
app.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString()
  };
});
```

---

## Docker healthcheck exemplo

```yaml
healthcheck:
  test: ['CMD', 'wget', '-qO-', 'http://localhost:3333/health']
  interval: 30s
  timeout: 10s
  retries: 3
```

---

# 📊 Volumes

## PostgreSQL

```txt
postgres_data
```

Guarda dados persistentes.

---

## Redis

```txt
redis_data
```

Guarda dados se AOF estiver ativo.

---

# ⚠️ Erros comuns

## ❌ Usar banco dentro do container da API

Banco deve ser serviço separado.

---

## ❌ Expor Redis na internet

Redis deve ficar apenas na rede interna.

---

## ❌ Imagem gigante

Use multi-stage build.

---

## ❌ Rodar migration dev em produção

Use migrate deploy.

---

## ❌ Usar latest sem controle

Use também tags por versão ou commit.

---

# 📊 Complexidade operacional

| Operação          | Complexidade |
| ----------------- | ------------ |
| subir stack local | baixa        |
| deploy Portainer  | média        |
| rollback por tag  | baixa        |
| escalar backend   | média        |
| escalar websocket | média/alta   |

---

# 🚀 Roadmap DevOps

## Fase 1

- Dockerfiles
- docker-compose
- PostgreSQL
- Redis
- Portainer Stack

---

## Fase 2

- GitHub Actions
- Docker Hub
- deploy automático
- tags por commit

---

## Fase 3

- Nginx Proxy Manager
- HTTPS
- backups automáticos
- monitoramento

---

## Fase 4

- Swarm/Kubernetes
- Redis Adapter Socket.IO
- múltiplas instâncias
- observabilidade completa

---

# 🏁 Conclusão

Com Docker + Portainer, o Sports SaaS ganha:

- deploy padronizado
- ambiente replicável
- escalabilidade futura
- rollback mais seguro
- operação simplificada

Essa estrutura é adequada para MVP profissional e pode evoluir para produção robusta.

Executado o item 5.

Criei o `.md` profissional de **Docker + Portainer**, cobrindo:

✅ Dockerfiles backend/frontend
✅ Docker Compose dev/prod
✅ PostgreSQL + Redis
✅ Portainer Stack via Git
✅ variáveis `.env`
✅ Prisma migrations em produção
✅ segurança
✅ healthcheck
✅ roadmap DevOps

Usei como base as boas práticas atuais de Docker multi-stage builds e deploy com Portainer.
