import type { FastifyReply, FastifyRequest } from "fastify";

import { Controller } from "@/common/shared/http/decorators/controller.decorator";
import { Post } from "@/common/shared/http/decorators/route.decorator";
import { Validate } from "@/common/shared/http/decorators/validate.decorator";

import { CreateAccountDto } from "@/modulos/identity-access/application/dto/account.dto";
import { AccountCreateUseCase } from "@/modulos/identity-access/application/use-cases/account-create.usecase";
import { CreateAccountSchema } from "../schemas/account.shema";

// export const AccountCreateController = (
//   accountCreateUseCase: AccountCreateUseCase,
// ) => {
//   return async (app: FastifyInstance): Promise<void> => {
//     app.withTypeProvider<ZodTypeProvider>().route({
//       method: "POST",
//       url: "/",
//       schema: {
//         tags: ["Account"],
//         summary: "Registrar um novo usuário",
//         body: CreateAccountSchema,
//         response: AccountCreateResponseSchema,
//       },
//       handler: async (request, reply) => {
//         const result = await accountCreateUseCase.execute(request.body);

//         if (result.isLeft()) {
//           throw result.value;
//         }

//         return reply.status(201).send(result.value.account);
//       },
//     });
//   };
// };

@Controller("/accounts")
export class AccountCreateController {
  static inject = [AccountCreateUseCase];

  constructor(private readonly accountCreateUseCase: AccountCreateUseCase) {}

  @Validate({ body: CreateAccountSchema })
  @Post("/", {
    tags: ["Account"],
    summary: "Registrar um novo usuário",
  })
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as CreateAccountDto;
    const result = await this.accountCreateUseCase.execute(body);

    if (result.isLeft()) {
      throw result.value;
    }

    return reply.status(201).send(result.value);
  }
}
