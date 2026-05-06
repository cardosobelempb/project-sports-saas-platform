import { DeepPartial } from "@/common/domain/types/DeepPartial";

export interface CreateStateDto {
  name?: string;

  uf?: string;
}

export interface UpdateStateDto extends DeepPartial<CreateStateDto> {}

export interface StatePresenterDto {
  id: string;

  name?: string;

  uf?: string;
}

export const createStateRawExample: CreateStateDto = {
  name: "Exemplo",
  uf: "example",
};

export const statePresenterRawExample: StatePresenterDto = {
  id: "00000000-0000-4000-8000-000000000000",
  name: "Exemplo",
  uf: "example",
};
