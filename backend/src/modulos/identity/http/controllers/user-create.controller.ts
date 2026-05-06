import { Controller } from "@/common/shared/http/decorators/controller.decorator";
import { Post } from "@/common/shared/http/decorators/route.decorator";
import { Validate } from "@/common/shared/http/decorators/validate.decorator";
import type { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserDto } from "../../application/dto/user.dto";
import { CreateUserSchema } from "../../application/schemas/user.schema";
import { UserCreateUseCase } from "../../application/use-cases/user-create.usecase";

@Controller("/users")
export class UserCreateController {
  static inject = [UserCreateUseCase];

  constructor(private readonly userCreateUseCase: UserCreateUseCase) {}

  @Validate({ body: CreateUserSchema })
  @Post("/", {
    tags: ["User"],
    summary: "Cria um novo usuário",
  })
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as CreateUserDto;
    const result = await this.userCreateUseCase.execute(body);

    if (result.isLeft()) {
      throw result.value;
    }

    return reply.status(201).send(result.value);
  }
}
