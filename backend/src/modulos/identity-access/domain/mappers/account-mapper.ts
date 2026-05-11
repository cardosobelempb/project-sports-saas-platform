import { ProviderType } from "@/common/shared/enums/provider-type.enum";
import { TokenType } from "@/common/shared/enums/token-type.enum";
import {
  AccountResponseDto,
  AccountSummaryDto,
  CreateAccountDto,
  UpdateAccountDto,
} from "../../application/dto/account.dto";
import { AccountEntity } from "../entities/account.entity";

// ============================================================
// account.mapper.ts
// Responsabilidade: converter AccountEntity → DTOs de resposta
//
// Métodos públicos:
//   toCreatedResponse  → AccountResponseDto  (pós-criação)
//   toUpdatedResponse  → AccountResponseDto  (pós-atualização)
//   toSummary          → AccountSummaryDto   (listagem paginada)
//   toHttp             → AccountResponseDto  (detalhes completos)
// ============================================================

export class AccountMapper {
  // ─── Helper privado ───────────────────────────────────────────────────
  //
  // Centraliza a conversão dos campos comuns a create e update.
  // Evita duplicação (DRY) e garante consistência entre os dois mappers.
  //
  // ⚠️  Usamos ?? (nullish coalescing) e não || (OR lógico):
  //     entity.order pode ser 0  → || "" trataria como falsy (bug silencioso)
  //     entity.slug  pode ser "" → intencionalmente vazio, não deve virar null

  private static toCoreFields(entity: AccountEntity): CreateAccountDto {
    return {
      userId: entity.userId.getValue(),

      providerAccountId: entity.providerAccountId.getValue(),
      provider: entity.provider as ProviderType,
      refreshToken: entity.refreshToken,
      accessToken: entity.accessToken,
      expiresAt: entity.expiresAt,
      tokenType: entity.tokenType as TokenType,
      scope: entity.scope,
      idToken: entity.idToken,
      sessionState: entity.sessionState,
    };
  }

  // ─── Pós-criação ──────────────────────────────────────────────────────
  //
  // Retorna os campos persistidos imediatamente após o INSERT.
  // Ideal para confirmar ao cliente o que foi salvo.
  //
  // @example
  //   return right(AccountMapper.toCreatedResponse(entity));

  static toCreatedResponse(entity: AccountEntity): CreateAccountDto {
    return this.toCoreFields(entity);
  }

  // ─── Pós-atualização ─────────────────────────────────────────────────
  //
  // Retorna os campos após o UPDATE.
  // Estrutura idêntica ao create; separe aqui caso precise adicionar
  // campos de auditoria (updatedAt, updatedBy, changedFields…).
  //
  // @example
  //   return right(AccountMapper.toUpdatedResponse(entity));

  static toUpdatedResponse(entity: AccountEntity): UpdateAccountDto {
    return this.toCoreFields(entity);
  }

  // ─── Resumo para listagem paginada ───────────────────────────────────
  //
  // Versão compacta da entidade: expõe apenas o necessário para
  // renderizar uma linha de tabela/card, evitando over-fetching.
  //
  // @example
  //   const page = PageResponseMapper.toDto(result, AccountMapper.toSummary);

  static toSummary(entity: AccountEntity): AccountSummaryDto {
    return {
      id: entity.id.getValue(),
      userId: entity.userId.getValue(),
      provider: entity.provider as ProviderType,
      providerAccountId: entity.providerAccountId.getValue(),
      createdAt: entity.createdAt,
    };
  }

  // ─── Detalhes completos (GET by id / resposta HTTP) ───────────────────
  //
  // Payload completo enviado em endpoints de detalhe.
  // Inclui campos de auditoria (createdAt) ausentes no resumo.

  static toHttp(entity: AccountEntity): AccountResponseDto {
    return {
      id: entity.id.getValue(),
      userId: entity.userId.getValue(),
      providerAccountId: entity.providerAccountId.getValue(),
      provider: entity.provider as ProviderType,
      refreshToken: entity.refreshToken,
      accessToken: entity.accessToken,
      expiresAt: entity.expiresAt,
      tokenType: entity.tokenType as TokenType,
      scope: entity.scope,
      idToken: entity.idToken,
      sessionState: entity.sessionState,
      createdAt: entity.createdAt,
    };
  }
}
