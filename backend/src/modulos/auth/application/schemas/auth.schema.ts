// ============================================================
// Auth.schema.ts
// Schemas exclusivos da entidade Auth.
// Importa dos shared — zero duplicação de erros/paginação.
// ============================================================

import { z } from "zod";

import { ValidatorMessage } from "@/common/domain/validations/ValidatorMessage";
import { IsoDateTimeInput, UUIDString } from "@/common/shared/schemas/helpers";
import {
  actionResponseSchema,
  createResponseSchema,
  findResponseSchema,
  pageResponseSchema,
  signinResponseSchema,
  updateResponseSchema,
} from "@/common/shared/schemas/response.factory";

// ─── Params ───────────────────────────────────────────────────────────────────

export const AuthParamsSchema = z.object({
  AuthId: UUIDString,
});

export type AuthParams = z.infer<typeof AuthParamsSchema>;

// ─── Schema base da entidade ──────────────────────────────────────────────────
//
// Fonte única de verdade para todos os schemas derivados.
//
// ⚠️  z.nativeEnum() — obrigatório para enums TypeScript.
//     z.enum() só aceita tuplas de string literal ["A","B"],
//     não enums compilados. Usar z.enum(EnumTS) quebra em runtime.

export const AuthSchema = z
  .object({
    id: UUIDString,
    email: z.string(ValidatorMessage.REQUIRED_FIELD),
    passwordHash: z.string(ValidatorMessage.REQUIRED_FIELD),
    emailVerified: IsoDateTimeInput.optional().nullable(),
    createdAt: IsoDateTimeInput.optional(),
    updatedAt: IsoDateTimeInput.optional().nullable(),
    deletedAt: IsoDateTimeInput.optional().nullable(),
  })
  .strict();

// ─── Body schemas (entrada) ───────────────────────────────────────────────────

// Payload de criação: sem campos gerados pelo servidor
export const AuthSigninSchema = AuthSchema.omit({
  id: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export const CreateAuthSchema = AuthSchema.omit({
  id: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

// Payload de atualização: todos os campos opcionais
// Não precisa de .strict() extra — já herdado do AuthSchema base
export const UpdateAuthSchema = AuthSchema.partial();

// ─── Response schemas (saída) ─────────────────────────────────────────────────

// Resposta completa: expõe tudo exceto campos de soft-delete
export const AuthResponseSchema = AuthSchema.omit({
  passwordHash: true, // Nunca exponha hashes de senha em respostas HTTP!
  emailVerified: true, // Decida se quer expor ou não — aqui optamos por ocultar
  deletedAt: true,
  updatedAt: true,
});

// Resumo para listagem: versão compacta — evita over-fetching
export const AuthSummarySchema = AuthSchema.pick({
  id: true,
  email: true,
});

// ─── Response wrappers via factory ───────────────────────────────────────────
//
// Cada wrapper envelopa AuthResponseSchema (entidade completa),
// não o schema de input — a resposta de create/update devolve a entidade
// persistida, não o payload que o cliente enviou.

export const AuthSigninResponseSchema = signinResponseSchema(AuthSigninSchema);
export const AuthCreateResponseSchema =
  createResponseSchema(AuthResponseSchema);
export const AuthFindByIdResponseSchema =
  findResponseSchema(AuthResponseSchema);
export const AuthUpdateResponseSchema =
  updateResponseSchema(AuthResponseSchema);
export const AuthActivateResponseSchema = actionResponseSchema();
export const AuthDeactivateResponseSchema = actionResponseSchema();
export const AuthPageResponseSchema = pageResponseSchema(AuthSummarySchema);
