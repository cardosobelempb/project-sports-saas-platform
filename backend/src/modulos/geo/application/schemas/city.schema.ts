import { ValidatorMessage } from "@/common/domain/validations/ValidatorMessage";
import { z } from "zod";

/**
 * Validações Zod para City.
 *
 * Convenção:
 * - create: valida payload de entrada para criação.
 * - update: valida payload parcial para atualização.
 * - presenter: valida objeto de saída/retorno da API.
 */
export const createCitySchema = z
  .object({
    name: z.string().max(120).optional(),
    stateId: z.string().uuid().optional(),
    subdomain: z
      .string(ValidatorMessage.REQUIRED_FIELD)
      .min(2, ValidatorMessage.MIN_VALUE)
      .max(255, ValidatorMessage.MAX_VALUE)
      .optional(),
  })
  .strict();

export const updateCitySchema = createCitySchema.partial().strict();

export const cityPresenterSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().max(120).nullable().optional(),
    stateId: z.string().uuid().nullable().optional(),
    subdomain: z.string().max(255).nullable().optional(),
  })
  .strict();

export type CreateCityInput = z.infer<typeof createCitySchema>;
export type UpdateCityInput = z.infer<typeof updateCitySchema>;
export type CityPresenter = z.infer<typeof cityPresenterSchema>;

export const createCityRawExample: CreateCityInput = {
  name: "Exemplo",
  stateId: "550e8400-e29b-41d4-a716-446655440000",
  subdomain: "valor_exemplo",
};

export const cityPresenterRawExample: CityPresenter = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Exemplo",
  stateId: "550e8400-e29b-41d4-a716-446655440000",
  subdomain: "valor_exemplo",
};
