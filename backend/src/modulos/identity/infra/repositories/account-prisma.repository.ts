import {
  Page,
  PageInput,
  Sort,
} from "@/common/domain/repositories/types/pagination.types";
import { getPrismaClient } from "@/common/infrastructure/db/prisma.client";
import { Prisma } from "../../../../../generated/prisma";
import { AccountEntity } from "../../domain/entities/account.entity";
import { AccountMapper } from "../../domain/mappers/account.mapper";
import { AccountRepository } from "../../domain/repositories/account-repository";

export class PrismaAccountRepository implements AccountRepository {
  private prisma = getPrismaClient();

  async findByCpf(cpf: string): Promise<AccountEntity | null> {
    const account = await this.prisma.account.findFirst({
      where: { provider: "credentials", providerAccountId: cpf },
      include: { user: true },
    });

    if (!account) return null;
    return AccountMapper.toDomain(account);
  }
  async page(params: PageInput): Promise<Page<AccountEntity>> {
    // ─── Paginação zero-based (padrão Spring) ─────────────────────────────
    const pageNumber = params.page ?? 0; // ✅ zero-based — não mais ?? 1
    const size = params.size ?? 20;
    const skip = pageNumber * size; // ✅ 0 * 20 = 0, 1 * 20 = 20...

    // ─── Ordenação ────────────────────────────────────────────────────────
    const [rawSortBy = "createdAt", rawSortDir = "desc"] = (
      params.sort ?? "createdAt,desc"
    ).split(",");

    const allowedSortFields: Array<
      keyof Prisma.AccountOrderByWithRelationInput
    > = ["provider", "createdAt", "updatedAt"];

    const sortBy = allowedSortFields.includes(
      rawSortBy as keyof Prisma.AccountOrderByWithRelationInput,
    )
      ? (rawSortBy as keyof Prisma.AccountOrderByWithRelationInput)
      : "createdAt";

    const sortDirection: Prisma.SortOrder =
      rawSortDir === "asc" ? "asc" : "desc";

    // ─── Filtro ───────────────────────────────────────────────────────────
    const filter = params.filter?.trim() ?? "";
    const where = this.buildWhere(filter);

    // ─── Query ────────────────────────────────────────────────────────────
    const [totalElements, accounts] = await this.prisma.$transaction([
      this.prisma.account.count({ where }),
      this.prisma.account.findMany({
        where,
        orderBy: { [sortBy]: sortDirection },
        skip, // ✅ sempre >= 0
        take: size,
      }),
    ]);

    // ─── Metadados ────────────────────────────────────────────────────────
    const totalPages = Math.ceil(totalElements / size);
    const numberOfElements = accounts.length;
    const isSorted = !!params.sort;

    const sortMeta: Sort = {
      sorted: isSorted,
      unsorted: !isSorted,
      empty: !isSorted,
    };

    return {
      content: accounts.map(AccountMapper.toDomain),
      pageable: {
        sort: sortMeta,
        offset: skip,
        pageSize: size,
        pageNumber,
        paged: true,
        unpaged: false,
      },
      sort: sortMeta,
      totalElements,
      totalPages,
      numberOfElements,
      size,
      number: pageNumber,
      first: pageNumber === 0,
      last: pageNumber >= totalPages - 1,
      empty: numberOfElements === 0,
    };
  }

  private buildWhere(filter: string): Prisma.AccountWhereInput {
    if (!filter) return {};

    return {
      OR: [{ provider: { contains: filter, mode: "insensitive" } }],
    };
  }

  async findManyByIds(ids: string[]): Promise<AccountEntity[]> {
    const accounts = await this.prisma.account.findMany({
      where: {
        id: { in: ids },
      },
      include: { user: true },
    });

    return accounts.map(AccountMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<AccountEntity | null> {
    const account = await this.prisma.account.findFirst({
      where: {
        userId,
      },
      include: { user: true },
    });
    if (!account) return null;
    return AccountMapper.toDomain(account);
  }

  async findById(id: string): Promise<AccountEntity | null> {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!account) return null;
    return AccountMapper.toDomain(account);
  }

  async exists(id: string): Promise<boolean> {
    const account = await this.prisma.account.findUnique({ where: { id } });
    return !!account;
  }

  async findByEmail(email: string): Promise<AccountEntity | null> {
    const account = await this.prisma.account.findFirst({
      where: {
        provider: "credentials",
        providerAccountId: email,
      },
    });

    if (!account) return null;
    return AccountMapper.toDomain(account);
  }

  async create(entity: AccountEntity): Promise<AccountEntity> {
    const data = AccountMapper.toPersist(entity);

    const account = await this.prisma.account.create({
      data,
    });

    return AccountMapper.toDomain(account);
  }

  async createWithTx(
    entity: AccountEntity,
    tx: Prisma.TransactionClient,
  ): Promise<AccountEntity> {
    const data = AccountMapper.toPersist(entity);
    const account = await tx.account.create({
      data,
    });
    return AccountMapper.toDomain(account);
  }

  async save(entity: AccountEntity): Promise<AccountEntity> {
    const data = AccountMapper.toPersist(entity);

    const account = await this.prisma.account.update({
      where: { id: entity.id.toString() },
      data,
    });

    return AccountMapper.toDomain(account);
  }

  async delete(entity: AccountEntity): Promise<void> {
    await this.prisma.account.delete({
      where: { id: entity.id.toString() },
    });
  }
}
