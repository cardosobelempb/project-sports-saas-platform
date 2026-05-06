# 🏆 Sports SaaS Platform — Documentação do Projeto

## 📌 Visão Geral

Este projeto consiste em uma plataforma SaaS escalável para **gestão de esportes**, inicialmente focada em **tênis de mesa**, com arquitetura preparada para suportar múltiplas modalidades como:

- Futebol
- Basquete
- Vôlei
- Futsal
- Outros esportes

O sistema permite:

- Gestão de atletas
- Criação de torneios
- Geração automática de partidas
- Placar eletrônico em tempo real
- Ranking competitivo (ELO)
- Estrutura multi-esporte

---

## 🎯 Objetivo

Criar uma plataforma profissional que permita:

- Organizar competições esportivas
- Gerenciar jogadores e clubes
- Automatizar partidas e rankings
- Oferecer experiência interativa (placar ao vivo)
- Escalar para múltiplas ligas e modalidades

---

## 🧠 Arquitetura do Sistema

### 🔷 Backend

- **Framework:** Fastify
- **Linguagem:** TypeScript
- **Validação:** Zod
- **Banco (futuro):** PostgreSQL + Prisma
- **Tempo real (futuro):** WebSocket

### 🔷 Frontend

- **Framework:** Next.js (App Router)
- **UI:** TailwindCSS
- **Estado (futuro):** Zustand / React Query

---

## 🧩 Módulos do Sistema

### 👤 Atletas

- Cadastro de jogadores
- Perfil esportivo
- Histórico de partidas
- Estatísticas (vitórias, derrotas, rating)

---

### 🏓 Esportes

Sistema multi-esporte baseado em configuração:

- Tipo: individual ou equipe
- Regras dinâmicas (RuleSet)
- Suporte a diferentes formatos de pontuação

---

### ⚔️ Partidas

- Criação de partidas
- Participantes flexíveis (jogador/time)
- Períodos (sets, tempos, etc.)
- Status:
  - PENDING
  - IN_PROGRESS
  - FINISHED

---

### ⚡ Placar Eletrônico

Funcionalidades:

- Contagem de pontos em tempo real
- Controle de sets
- Controle de saque
- Regra de deuce automática
- Detecção de fim de set
- Virada de mesa automática (regras ITTF)
- Histórico de pontos (PointEvent)

---

### 🏆 Torneios

- Criação de torneios
- Categorias por idade
- Inscrição de atletas
- Geração automática de confrontos
- Suporte a formatos:
  - Mata-mata
  - Grupos
  - Round Robin

---

### 📊 Ranking

Sistema baseado em:

#### 🔹 ELO Rating

- Avalia nível técnico real
- Ajuste dinâmico baseado no adversário

#### 🔹 XP

- Gamificação
- Incentivo à participação

#### 🔹 Níveis

- Classificação visual do atleta

---

## ⚙️ Regras de Negócio (Tênis de Mesa)

- Sets até **11 pontos**
- Diferença mínima de **2 pontos**
- Saque alterna:
  - A cada 2 pontos
  - Em 10x10 → a cada 1 ponto
- Virada de mesa:
  - A cada set
  - No último set ao atingir 5 pontos

---

## 🔐 Anti-fraude

- Validação dupla de resultados
- Limite de partidas por dia
- Detecção de padrões suspeitos
- Histórico completo de ações

---

## 🌐 Rotas principais da API

### Esportes

```

GET /sports
POST /sports
GET /sports/:id

```

### Atletas

```

GET /athletes
POST /athletes
GET /athletes/:id

```

### Torneios

```

GET /tournaments
POST /tournaments
POST /tournaments/:id/participants
POST /tournaments/:id/generate-matches

```

### Partidas

```

GET /matches
POST /matches
POST /matches/:id/start
POST /matches/:id/finish

```

### Placar

```

GET /scoreboards/:matchId
POST /scoreboards/:matchId/point
POST /scoreboards/:matchId/undo-point

```

### Ranking

```

GET /rankings
POST /rankings/recalculate/:matchId

```

---

## 🖥️ Telas do Frontend

- Dashboard
- Lista de atletas
- Gestão de torneios
- Ranking geral
- Placar eletrônico (modo telão)

---

## 🚀 Diferenciais do Sistema

- Arquitetura multi-esporte
- Engine de regras desacoplada (Strategy Pattern)
- Placar em tempo real
- Ranking profissional (ELO)
- Estrutura SaaS escalável
- Preparado para mobile e transmissão ao vivo

---

## 📈 Roadmap

### Fase 1 (MVP)

- Atletas
- Partidas
- Ranking
- Placar básico

### Fase 2

- Torneios completos
- Categorias por idade
- Geração automática de chaves

### Fase 3

- WebSocket tempo real
- App mobile
- Multi-clubes (SaaS completo)

### Fase 4

- Múltiplos esportes
- Integração com pagamentos
- Estatísticas avançadas

---

## 🧱 Próximos Passos Técnicos

- Integração com Prisma + PostgreSQL
- Implementação de autenticação (JWT)
- Sistema de permissões (admin/jogador)
- Deploy com Docker + Portainer
- CI/CD com GitHub Actions

---

## 🏁 Conclusão

Este projeto já possui uma base sólida de:

- Arquitetura profissional
- Modelagem escalável
- Regras de negócio bem definidas
- Estrutura pronta para crescimento

O sistema pode evoluir para um **produto SaaS completo de gestão esportiva**, atendendo desde clubes locais até federações.
A implementação futura de funcionalidades avançadas e integração com múltiplos esportes garantirá uma plataforma robusta e competitiva no mercado de gestão esportiva.

```

```
