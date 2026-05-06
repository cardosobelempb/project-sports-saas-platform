import { DeepPartial } from "@/common/domain/types/DeepPartial";

export interface CreateCityDto {
  name?: string;

  stateId?: string;

  subdomain?: string;
}

export interface UpdateCityDto extends DeepPartial<CreateCityDto> {}

export interface CityPresenterDto {
  id: string;

  name?: string;

  stateId?: string;

  subdomain?: string;
}

export const createCityRawExample: CreateCityDto = {
  name: "Exemplo",
  stateId: "00000000-0000-4000-8000-000000000000",
  subdomain: "example",
};

export const cityPresenterRawExample: CityPresenterDto = {
  id: "00000000-0000-4000-8000-000000000000",
  name: "Exemplo",
  stateId: "00000000-0000-4000-8000-000000000000",
  subdomain: "example",
};
