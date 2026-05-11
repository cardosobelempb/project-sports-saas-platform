import { StandardError } from "../standard.errror";
import { BaseUseCaseError } from "./base-usecase.error.ts";

export class MethodNotAllowedError
  extends StandardError
  implements BaseUseCaseError
{
  constructor(params: { fieldName: string; value?: string; message?: string }) {
    super({
      error: "MethodNotAllowedError",
      statusCode: 405,
      message:
        params.message ??
        `${params.fieldName} "${params.value}" não pode ser processado por este método`,
      fieldName: params.fieldName,
    });
  }
}
