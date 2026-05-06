import { ValidatorMessage } from "@/common/domain/validations/ValidatorMessage";
import { z } from "zod";

/**
 * Validações Zod para State.
 *
 * Convenção:
 * - create: valida payload de entrada para criação.
 * - update: valida payload parcial para atualização.
 * - presenter: valida objeto de saída/retorno da API.
 */
export const createStateSchema = z
  .object({
    name: z
      .string(ValidatorMessage.REQUIRED_FIELD)
      .min(2, ValidatorMessage.MIN_VALUE)
      .max(75, ValidatorMessage.MAX_VALUE)
      .optional(),
    uf: z
      .string(ValidatorMessage.REQUIRED_FIELD)
      .min(2, ValidatorMessage.MIN_VALUE)
      .max(5, ValidatorMessage.MAX_VALUE)
      .optional(),
  })
  .strict();

export const updateStateSchema = createStateSchema.partial().strict();

export const statePresenterSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().max(75).nullable().optional(),
    uf: z.string().max(5).nullable().optional(),
  })
  .strict();

export type CreateStateInput = z.infer<typeof createStateSchema>;
export type UpdateStateInput = z.infer<typeof updateStateSchema>;
export type StatePresenter = z.infer<typeof statePresenterSchema>;

export const createStateRawExample: CreateStateInput = {
  name: "Exemplo",
  uf: "valor_exemplo",
};

export const statePresenterRawExample: StatePresenter = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Exemplo",
  uf: "valor_exemplo",
};
