import { AlreadyExistsError } from "@/common/domain/errors/usecases/already-exists.error";

import {
  Either,
  left,
  right,
} from "@/common/domain/errors/handle-errors/either";
import { AccountMapper } from "../../domain/mappers/account-mapper";
import { PrismaAccountRepository } from "../../infrastructure/repositories/prisma-account.repository";
import { AccountResponseDto, CreateAccountDto } from "../dto/account.dto";
import { AccountFactory } from "./factories/acount.factory";

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
    if (!input.userId || !input.provider || !input.providerAccountId) {
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

    const entity = AccountFactory.build({
      userId: input.userId,
      providerAccountId: input.providerAccountId,
      provider: input.provider,
      refreshToken: input.refreshToken,
      accessToken: input.accessToken,
      expiresAt: input.expiresAt,
      tokenType: input.tokenType,
      scope: input.scope,
      idToken: input.idToken,
      sessionState: input.sessionState,
    });

    const account = await this.accountRepository.create(entity);
    const AccountDto = AccountMapper.toHttp(account);

    return right(AccountDto);
  }
}
