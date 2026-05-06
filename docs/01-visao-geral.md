# 01 - Visão Geral do Projeto

## Objetivo

Este projeto é uma API backend profissional usando:

- Fastify
- TypeScript
- Prisma
- PostgreSQL
- Zod
- Decorators customizados
- DI Container manual
- Clean Architecture

A ideia é manter uma estrutura simples, mas escalável, sem depender de frameworks pesados como NestJS.

---

## Arquitetura resumida

```txt
Request HTTP
→ Fastify
→ Hooks globais
→ Decorators
→ Controller
→ Use Case
→ Repository
→ Prisma
→ PostgreSQL
```

---

## Estrutura recomendada

```txt
src/
  modules/
    users/
      application/
        use-cases/
      infra/
        controllers/
        repositories/
        routes/
      user.module.ts

  shared/
    http/
      decorators/
      register-routes.ts
    module/
      register-module.ts
      module.types.ts
    container/
      di-container.ts
    auth/
```

---

## Quando usar essa arquitetura

Use quando o projeto tiver:

- regras de negócio importantes;
- autenticação e permissões;
- vários módulos;
- necessidade de testes;
- crescimento futuro;
- separação clara entre domínio, aplicação e infraestrutura.

---

## Onde não usar

Evite essa estrutura em projetos muito pequenos, como:

- landing pages;
- APIs com 1 ou 2 rotas simples;
- scripts temporários;
- protótipos descartáveis.

Nesses casos, Fastify puro com `app.route()` pode ser suficiente.

---

## Regra de ouro

```txt
Controller recebe.
Use Case decide.
Repository persiste.
Container monta.
Decorator padroniza.
```
