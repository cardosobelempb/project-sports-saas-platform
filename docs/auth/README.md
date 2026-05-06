# Documentação — Implementação Profissional de Autenticação

Este pacote documenta, em passo a passo, como implementar autenticação com:

- Fastify
- TypeScript
- Prisma
- PostgreSQL
- Zod
- JWT
- Cookies HTTP-only
- CSRF
- RBAC com Roles e Permissions
- Decorators customizados
- DI/Modules

## Ordem recomendada de implementação

1. Instalar dependências
2. Configurar variáveis de ambiente
3. Criar schema Prisma
4. Criar tipagem global do Fastify
5. Criar constantes de autenticação
6. Registrar plugins de cookie e JWT
7. Criar helpers de cookies
8. Criar schemas Zod
9. Criar AuthService
10. Criar decorators `@Auth`, `@Roles`, `@Permissions` e `@Csrf`
11. Ajustar `register-routes`
12. Criar AuthController
13. Registrar AuthModule
14. Testar login, refresh, logout e rotas protegidas

## Regra de ouro

```txt
Cookie autentica.
Hook injeta request.user.
Decorator protege a rota.
Controller recebe HTTP.
UseCase executa regra.
Repository persiste.
```
