# 21 — Checklist de implementação

## Backend

- [ ] Instalar dependências
- [ ] Criar variáveis de ambiente
- [ ] Atualizar Prisma Schema
- [ ] Rodar migration
- [ ] Criar tipagem global do Fastify
- [ ] Criar constantes de auth
- [ ] Criar `auth.plugin.ts`
- [ ] Criar helpers de cookie
- [ ] Criar schemas Zod
- [ ] Criar AuthService
- [ ] Criar decorators de auth
- [ ] Atualizar RouteDefinition
- [ ] Criar RBAC
- [ ] Atualizar register-routes
- [ ] Criar AuthController
- [ ] Registrar authPlugin antes das rotas
- [ ] Testar login
- [ ] Testar `/auth/me`
- [ ] Testar refresh
- [ ] Testar logout
- [ ] Testar rota com `@Roles`
- [ ] Testar rota com `@Permissions`
- [ ] Testar rota com `@Csrf`

## Frontend

- [ ] Usar `credentials: "include"`
- [ ] Ler `csrf_token` quando necessário
- [ ] Enviar header `x-csrf-token`
- [ ] Não usar localStorage para token

## Segurança

- [ ] Senha com hash
- [ ] Access token curto
- [ ] Refresh token com hash no banco
- [ ] Logout revoga refresh token
- [ ] CSRF em rotas de escrita
- [ ] Roles e permissions centralizadas
