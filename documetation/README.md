Perfeito. Agora vamos entrar em uma das partes mais importantes do sistema:

# 🔥 WebSocket Realtime Profissional

Vamos transformar o placar em algo realmente vivo:

```txt
Árbitro adiciona ponto
→ Backend valida
→ WebSocket emite evento
→ Telão atualiza
→ Celular atualiza
→ Dashboard atualiza
→ Ranking atualiza
```

---

# 🧠 1. Arquitetura Realtime

## Backend

```txt
Fastify
└── Socket.IO
    └── Redis Adapter (futuro)
```

## Frontend

```txt
Next.js
└── socket.io-client
```

---

# 🧱 2. Instalação

## Backend

```bash
npm install socket.io
```

---

## Frontend

```bash
npm install socket.io-client
```

---

# 🏗️ 3. Estrutura recomendada

```txt
backend/src/modules/websocket/
├── websocket.gateway.ts
├── websocket.events.ts
├── websocket.rooms.ts
├── websocket.auth.ts
├── websocket.types.ts
└── websocket.constants.ts
```

---

# 🧠 4. Estratégia correta

Cada partida possui sua própria sala.

```txt
match:{matchId}
```

Exemplo:

```txt
match:550e8400-e29b-41d4-a716-446655440000
```

---

# 🧩 5. Gateway principal

```ts
// websocket.gateway.ts

import { Server } from 'socket.io';

export class WebsocketGateway {
  constructor(private readonly io: Server) {}

  emitScoreboardUpdated(matchId: string, payload: unknown) {
    this.io.to(`match:${matchId}`).emit('scoreboard.updated', payload);
  }

  emitPointAdded(matchId: string, payload: unknown) {
    this.io.to(`match:${matchId}`).emit('point.added', payload);
  }

  emitServerChanged(matchId: string, payload: unknown) {
    this.io.to(`match:${matchId}`).emit('server.changed', payload);
  }

  emitSidesSwitched(matchId: string, payload: unknown) {
    this.io.to(`match:${matchId}`).emit('sides.switched', payload);
  }

  emitSetFinished(matchId: string, payload: unknown) {
    this.io.to(`match:${matchId}`).emit('set.finished', payload);
  }

  emitMatchFinished(matchId: string, payload: unknown) {
    this.io.to(`match:${matchId}`).emit('match.finished', payload);
  }

  emitRankingUpdated(payload: unknown) {
    this.io.emit('ranking.updated', payload);
  }
}
```

---

# 🔌 6. Inicializando Socket.IO no Fastify

```ts
// websocket.plugin.ts

import fp from 'fastify-plugin';
import { Server } from 'socket.io';

export default fp(async fastify => {
  const io = new Server(fastify.server, {
    cors: {
      origin: '*'
    }
  });

  io.on('connection', socket => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on('join.match', ({ matchId }) => {
      socket.join(`match:${matchId}`);
    });

    socket.on('leave.match', ({ matchId }) => {
      socket.leave(`match:${matchId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  fastify.decorate('io', io);
});
```

---

# 🧠 7. Tipagem do Fastify

```ts
// fastify.d.ts

import 'fastify';
import { Server } from 'socket.io';

declare module 'fastify' {
  interface FastifyInstance {
    io: Server;
  }
}
```

---

# ⚡ 8. Integrando no placar

Agora o placar emitirá eventos em tempo real.

```ts
// scoreboards.service.ts

async addPoint(...) {

  // Atualiza estado
  scoreboard.athleteAPoints++

  // Emite websocket
  this.gateway.emitPointAdded(matchId, {
    scoreboard,
  })

  this.gateway.emitScoreboardUpdated(matchId, {
    scoreboard,
  })

  return scoreboard
}
```

---

# 🧠 9. Evento de troca de saque

```ts
if (oldServerId !== scoreboard.currentServerAthleteId) {
  this.gateway.emitServerChanged(matchId, {
    currentServerAthleteId: scoreboard.currentServerAthleteId
  });
}
```

---

# 🔄 10. Evento de virada de mesa

```ts
if (scoreboard.shouldSwitchSides) {
  this.gateway.emitSidesSwitched(matchId, {
    currentSet: scoreboard.currentPeriod
  });
}
```

---

# 🏁 11. Finalização do set

```ts
if (isSetFinished(...)) {
  this.gateway.emitSetFinished(matchId, {
    currentSet: scoreboard.currentPeriod,
  })
}
```

---

# 🏆 12. Finalização da partida

```ts
if (scoreboard.isFinished) {
  this.gateway.emitMatchFinished(matchId, {
    winnerAthleteId
  });
}
```

---

# 🖥️ 13. Frontend Next.js

## Cliente websocket

```ts
// services/socket.ts

import { io } from 'socket.io-client';

export const socket = io('http://localhost:3333');
```

---

# 🧩 14. Entrando na sala da partida

```tsx
useEffect(() => {
  socket.emit('join.match', {
    matchId
  });

  return () => {
    socket.emit('leave.match', {
      matchId
    });
  };
}, [matchId]);
```

---

# ⚡ 15. Escutando eventos

```tsx
useEffect(() => {
  socket.on('scoreboard.updated', payload => {
    setScoreboard(payload.scoreboard);
  });

  socket.on('server.changed', payload => {
    setCurrentServer(payload.currentServerAthleteId);
  });

  socket.on('sides.switched', () => {
    alert('Virada de mesa!');
  });

  socket.on('match.finished', payload => {
    alert('Partida finalizada!');
  });

  return () => {
    socket.off('scoreboard.updated');
    socket.off('server.changed');
    socket.off('sides.switched');
    socket.off('match.finished');
  };
}, []);
```

---

# 📺 16. Modo Telão

Você terá uma rota especial:

```txt
/telao/:matchId
```

Essa tela:

✔ fullscreen
✔ sem botões
✔ realtime
✔ alto contraste

---

# 🎯 17. Fluxo completo

```txt
Árbitro
→ adiciona ponto

Backend
→ valida regra
→ atualiza saque
→ detecta deuce
→ detecta virada
→ detecta vencedor

WebSocket
→ emite evento

Frontend
→ atualiza placar
→ atualiza telão
→ atualiza ranking
```

---

# 🔐 18. Segurança importante

## JWT obrigatório

```ts
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  // validar JWT

  next();
});
```

---

# ⚠️ 19. Erros comuns

## ❌ Calcular regras no frontend

Nunca:

```txt
saque
vencedor
deuce
virada
```

no frontend.

---

## ❌ Não usar rooms

Sem rooms:

❌ todos recebem tudo
❌ desperdício
❌ problemas de escala

---

## ❌ Atualizar ranking antes do fim

O ranking só atualiza após:

```txt
match.status = FINISHED
```

---

# 📊 20. Complexidade

| Operação           | Complexidade          |
| ------------------ | --------------------- |
| emitir evento      | O(n clientes da sala) |
| atualização placar | O(1)                  |
| troca de saque     | O(1)                  |
| virada             | O(1)                  |

---

# 🚀 21. Próximo passo recomendado

Agora o sistema já possui:

✔ Multi-esporte
✔ Ranking ELO
✔ Torneio
✔ Chaveamento
✔ Placar eletrônico
✔ WebSocket realtime

---

# 🎯 Próximo nível real

Agora recomendo seguir para:

## 1. PrismaService real

## 2. Repository Pattern

## 3. Transactions

## 4. Redis Cache

## 5. Docker + Portainer

## 6. Auth JWT + RBAC

Isso transforma o projeto em:

```txt
SaaS profissional pronto para produção
```
