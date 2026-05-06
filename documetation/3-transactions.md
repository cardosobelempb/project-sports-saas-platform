# 🔥 Transactions — Consistência e Operações Atômicas

## 📌 Objetivo

Este documento define como usar **transactions** no Sports SaaS para garantir consistência entre operações críticas do sistema.

O sistema possui fluxos sensíveis como:

- criar atleta + ranking inicial
- criar torneio + categorias
- iniciar partida + placar
- adicionar ponto + registrar evento
- finalizar partida + atualizar ranking
- avançar vencedor no torneio

Essas operações não podem deixar o banco em estado inconsistente.

---

# 🧠 Conceito

Uma transaction garante que um conjunto de operações seja executado como uma unidade única.

```txt
Tudo dá certo → COMMIT
Algo falha → ROLLBACK
```

---

# 🎯 Por que isso é crítico?

Sem transaction, o sistema pode salvar dados incompletos.

Exemplo ruim:

```txt
1. Cria partida
2. Falha ao criar placar
3. Partida fica sem placar
```

Resultado:

```txt
Banco inconsistente
Experiência quebrada
Bug difícil de corrigir
```

---

# 🧱 Onde usar transactions

## Obrigatório usar em:

- criação de atleta com ranking inicial
- criação de torneio com categorias
- geração de partidas do torneio
- início de partida com scoreboard
- adição de ponto com PointEvent
- fechamento de set
- finalização de partida
- atualização de ranking
- avanço de chave do torneio

---

# ✅ 1. Criar Athlete + Ranking Inicial

## Problema evitado

Evita atleta criado sem ranking.

```ts
async createAthleteWithInitialRanking(input: {
  userId: string
  sportId: string
  nickname?: string
}) {
  return this.prisma.$transaction(async (tx) => {
    const athlete = await tx.athlete.create({
      data: {
        userId: input.userId,
        nickname: input.nickname,
      },
    })

    await tx.athleteRanking.create({
      data: {
        athleteId: athlete.id,
        sportId: input.sportId,
        rating: 1000,
        xp: 0,
      },
    })

    return athlete
  })
}
```

---

# ✅ 2. Criar Torneio + Categorias

## Problema evitado

Evita torneio criado sem categorias obrigatórias.

```ts
async createTournamentWithCategories(input: {
  sportId: string
  name: string
  format: 'KNOCKOUT' | 'GROUP_STAGE' | 'ROUND_ROBIN'
  categories: {
    name: string
    minAge?: number
    maxAge?: number
  }[]
}) {
  return this.prisma.$transaction(async (tx) => {
    const tournament = await tx.tournament.create({
      data: {
        sportId: input.sportId,
        name: input.name,
        format: input.format,
        status: 'DRAFT',
      },
    })

    await tx.tournamentCategory.createMany({
      data: input.categories.map((category) => ({
        tournamentId: tournament.id,
        name: category.name,
        minAge: category.minAge,
        maxAge: category.maxAge,
      })),
    })

    return tournament
  })
}
```

---

# ✅ 3. Gerar Jogos do Torneio

## Problema evitado

Evita geração parcial de confrontos.

```ts
async generateKnockoutMatches(input: {
  categoryId: string
  athleteIds: string[]
}) {
  return this.prisma.$transaction(async (tx) => {
    const shuffled = [...input.athleteIds].sort(() => Math.random() - 0.5)

    const matches = []

    for (let i = 0; i < shuffled.length; i += 2) {
      matches.push({
        categoryId: input.categoryId,
        round: 1,
        position: i / 2 + 1,
        athleteAId: shuffled[i],
        athleteBId: shuffled[i + 1] ?? null,
        status: shuffled[i + 1] ? 'READY' : 'BYE',
      })
    }

    await tx.tournamentMatch.createMany({
      data: matches,
    })

    return matches
  })
}
```

---

# ✅ 4. Iniciar Partida + Criar Scoreboard

## Problema evitado

Evita partida em andamento sem placar.

```ts
async startMatch(input: {
  matchId: string
  athleteAId: string
  athleteBId: string
  firstServerAthleteId?: string
}) {
  return this.prisma.$transaction(async (tx) => {
    const match = await tx.match.update({
      where: {
        id: input.matchId,
      },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    })

    const scoreboard = await tx.scoreboard.create({
      data: {
        matchId: match.id,
        currentPeriod: 1,
        athleteAId: input.athleteAId,
        athleteBId: input.athleteBId,
        firstServerAthleteId: input.firstServerAthleteId,
        currentServerAthleteId: input.firstServerAthleteId,
      },
    })

    return {
      match,
      scoreboard,
    }
  })
}
```

---

# ✅ 5. Adicionar Ponto + Registrar Evento

## Problema evitado

Evita placar atualizado sem histórico de ponto.

```ts
async addPoint(input: {
  scoreboardId: string
  winnerAthleteId: string
}) {
  return this.prisma.$transaction(async (tx) => {
    const scoreboard = await tx.scoreboard.findUniqueOrThrow({
      where: {
        id: input.scoreboardId,
      },
    })

    const isAthleteA = input.winnerAthleteId === scoreboard.athleteAId
    const isAthleteB = input.winnerAthleteId === scoreboard.athleteBId

    if (!isAthleteA && !isAthleteB) {
      throw new Error('Atleta não pertence à partida.')
    }

    const athleteAPoints = scoreboard.athleteAPoints + (isAthleteA ? 1 : 0)
    const athleteBPoints = scoreboard.athleteBPoints + (isAthleteB ? 1 : 0)

    const updatedScoreboard = await tx.scoreboard.update({
      where: {
        id: scoreboard.id,
      },
      data: {
        athleteAPoints,
        athleteBPoints,
      },
    })

    await tx.pointEvent.create({
      data: {
        scoreboardId: scoreboard.id,
        matchId: scoreboard.matchId,
        periodNumber: scoreboard.currentPeriod,
        pointNumber: athleteAPoints + athleteBPoints,
        winnerAthleteId: input.winnerAthleteId,
        serverAthleteId: scoreboard.currentServerAthleteId,
        athleteAPointsAfter: athleteAPoints,
        athleteBPointsAfter: athleteBPoints,
      },
    })

    return updatedScoreboard
  })
}
```

---

# ✅ 6. Finalizar Partida + Atualizar Ranking

## Problema evitado

Evita partida finalizada sem ranking atualizado.

```ts
async finishMatchAndUpdateRanking(input: {
  matchId: string
  winnerAthleteId: string
  loserAthleteId: string
  sportId: string
}) {
  return this.prisma.$transaction(async (tx) => {
    const winnerRanking = await tx.athleteRanking.findUniqueOrThrow({
      where: {
        athleteId_sportId: {
          athleteId: input.winnerAthleteId,
          sportId: input.sportId,
        },
      },
    })

    const loserRanking = await tx.athleteRanking.findUniqueOrThrow({
      where: {
        athleteId_sportId: {
          athleteId: input.loserAthleteId,
          sportId: input.sportId,
        },
      },
    })

    const winnerNewRating = winnerRanking.rating + 12
    const loserNewRating = Math.max(0, loserRanking.rating - 8)

    await tx.match.update({
      where: {
        id: input.matchId,
      },
      data: {
        status: 'FINISHED',
        finishedAt: new Date(),
        winnerAthleteId: input.winnerAthleteId,
      },
    })

    await tx.athleteRanking.update({
      where: {
        id: winnerRanking.id,
      },
      data: {
        rating: winnerNewRating,
        wins: {
          increment: 1,
        },
        matchesPlayed: {
          increment: 1,
        },
      },
    })

    await tx.athleteRanking.update({
      where: {
        id: loserRanking.id,
      },
      data: {
        rating: loserNewRating,
        losses: {
          increment: 1,
        },
        matchesPlayed: {
          increment: 1,
        },
      },
    })

    await tx.rankingHistory.createMany({
      data: [
        {
          athleteRankingId: winnerRanking.id,
          matchId: input.matchId,
          oldRating: winnerRanking.rating,
          newRating: winnerNewRating,
          ratingChange: winnerNewRating - winnerRanking.rating,
          oldXp: winnerRanking.xp,
          newXp: winnerRanking.xp + 50,
          xpChange: 50,
          reason: 'MATCH_WIN',
        },
        {
          athleteRankingId: loserRanking.id,
          matchId: input.matchId,
          oldRating: loserRanking.rating,
          newRating: loserNewRating,
          ratingChange: loserNewRating - loserRanking.rating,
          oldXp: loserRanking.xp,
          newXp: loserRanking.xp + 20,
          xpChange: 20,
          reason: 'MATCH_LOSS',
        },
      ],
    })
  })
}
```

---

# ✅ 7. Finalizar Partida de Torneio + Avançar Vencedor

## Problema evitado

Evita vencedor definido, mas chave não atualizada.

```ts
async finishTournamentMatch(input: {
  tournamentMatchId: string
  winnerAthleteId: string
}) {
  return this.prisma.$transaction(async (tx) => {
    const tournamentMatch = await tx.tournamentMatch.update({
      where: {
        id: input.tournamentMatchId,
      },
      data: {
        winnerAthleteId: input.winnerAthleteId,
        status: 'FINISHED',
      },
    })

    const nextPosition = Math.ceil(tournamentMatch.position / 2)
    const nextRound = tournamentMatch.round + 1

    const nextMatch = await tx.tournamentMatch.findFirst({
      where: {
        categoryId: tournamentMatch.categoryId,
        round: nextRound,
        position: nextPosition,
      },
    })

    if (nextMatch) {
      const isFirstSlot = tournamentMatch.position % 2 !== 0

      await tx.tournamentMatch.update({
        where: {
          id: nextMatch.id,
        },
        data: isFirstSlot
          ? { athleteAId: input.winnerAthleteId }
          : { athleteBId: input.winnerAthleteId },
      })
    }

    return tournamentMatch
  })
}
```

---

# 🧠 Boas práticas

## 1. Transactions curtas

Não coloque chamadas externas dentro da transaction.

Evite:

- enviar email
- emitir websocket
- chamar API externa
- gerar PDF

---

## 2. Eventos depois do commit

Fluxo correto:

```txt
Transaction finaliza
→ commit
→ emite websocket
→ envia notificação
```

---

## 3. Não usar transaction para leitura simples

Não precisa de transaction para:

- listar atletas
- buscar ranking
- buscar torneio

---

## 4. Sempre validar antes

Valide entrada antes da transaction.

```txt
Zod → Service → Transaction
```

---

# ⚠️ Erros comuns

## ❌ WebSocket dentro da transaction

Se a transaction der rollback, o frontend já recebeu evento falso.

---

## ❌ Transaction longa

Transactions longas bloqueiam recursos e reduzem performance.

---

## ❌ Falta de idempotência

Finalizar uma partida duas vezes pode duplicar ranking.

Use validações:

```txt
match.status !== FINISHED
```

---

# 🔐 Segurança

Toda operação transacional deve validar:

- tenantId
- organizationId
- permissão do usuário
- status atual do recurso
- soft delete

---

# 📊 Complexidade Big-O

| Operação                    | Complexidade |
| --------------------------- | ------------ |
| criar atleta + ranking      | O(1)         |
| criar torneio + categorias  | O(n)         |
| gerar jogos                 | O(n)         |
| adicionar ponto             | O(1)         |
| finalizar partida + ranking | O(1)         |
| avançar chave               | O(1)         |

---

# 🧪 Testes recomendados

## Cenários obrigatórios

- falha ao criar ranking deve desfazer atleta
- falha ao criar scoreboard deve desfazer início da partida
- falha ao criar PointEvent deve desfazer ponto
- falha ao atualizar ranking deve desfazer finalização da partida
- partida finalizada não pode recalcular ranking novamente

---

# 🏁 Conclusão

Transactions são essenciais para garantir consistência do Sports SaaS.

Com elas, protegemos os fluxos críticos:

- atleta
- torneio
- partida
- placar
- ranking
- chaveamento

Essa camada transforma o sistema em uma base confiável para produção.

Executado o item 3.

Criei o `.md` profissional de **Transactions**, cobrindo:

✅ operações atômicas
✅ rollback automático
✅ atleta + ranking inicial
✅ torneio + categorias
✅ partida + scoreboard
✅ ponto + histórico
✅ finalização + ranking
✅ avanço de chave
✅ erros comuns
✅ testes recomendados
✅ análise Big-O
