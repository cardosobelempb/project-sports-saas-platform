import { AlreadyExistsError } from "@/common/domain/errors/usecases/already-exists.error";

import {
  Either,
  left,
  right,
} from "@/common/domain/errors/handle-errors/either";
import { UUIDVO } from "@/common/domain/values-objects/uuidvo/uuid.vo";
import { AccountEntity } from "../../domain/entities/account.entity";
import { AccountMapper } from "../../domain/mappers/account-mapper";
import { PrismaAccountRepository } from "../../infrastructure/repositories/prisma-account.repository";
import { AccountResponseDto, CreateAccountDto } from "../dto/account.dto";

export type AccountCreateUseCaseResponse = Either<
  AlreadyExistsError,
  AccountResponseDto
>;

export class AccountCreateUseCase {
  static inject = [PrismaAccountRepository];

  constructor(private readonly accountRepository: PrismaAccountRepository) {}

  async execute(
    input: CreateAccountDto,
  ): Promise<AccountCreateUseCaseResponse> {
    if (!input.userId || !input.providerType || !input.providerAccountId) {
      return left(
        new AlreadyExistsError({
          message: "userId, providerType and providerAccountId are required",
          fieldName: "userId, providerType and providerAccountId",
        }),
      );
    }

    const existing = await this.accountRepository.findByUserId(input.userId);

    if (existing) {
      return left(
        new AlreadyExistsError({
          message: `Account with userId '${input.userId}' already exists`,
          fieldName: "userId",
        }),
      );
    }

    const entity = AccountEntity.create({
      userId: UUIDVO.create(input.userId),
      providerType: input.providerType,
      providerAccountId: UUIDVO.create(input.providerAccountId),
      provider: input.provider,
    });

    const account = await this.accountRepository.create(entity);
    const AccountDto = AccountMapper.toOutput(account);

    return right(AccountDto);
  }
}
