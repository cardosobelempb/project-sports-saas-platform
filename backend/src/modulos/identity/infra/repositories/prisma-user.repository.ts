import {
  Page,
  PageInput,
  Sort,
} from "@/common/domain/repositories/types/pagination.types";
import { Prisma, PrismaClient } from "../../../../../generated/prisma";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { PrismaUserMapper } from "../mappers/prisma-user.mapper";

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async page(params: PageInput): Promise<Page<UserEntity>> {
    // ─── Paginação (zero-based, padrão Spring Boot) ───────────────────────
    const pageNumber = params.page ?? 0; // Spring começa em 0, não em 1
    const size = params.size ?? 20; // Padrão Spring Data: 20
    const skip = pageNumber * size; // offset = page * size

    // ─── Ordenação (parse do formato 'campo,direção') ──────────────────────
    const [rawSortBy = "createdAt", rawSortDir = "desc"] = (
      params.sort ?? "createdAt,desc"
    ).split(",");

    const allowedSortFields: Array<keyof Prisma.UserOrderByWithRelationInput> =
      ["email", "createdAt", "updatedAt"];

    // Garante que somente campos permitidos sejam usados (evita SQL injection por campo)
    const sortBy = allowedSortFields.includes(
      rawSortBy as keyof Prisma.UserOrderByWithRelationInput,
    )
      ? (rawSortBy as keyof Prisma.UserOrderByWithRelationInput)
      : "createdAt";

    // Garante que a direção seja apenas 'asc' ou 'desc'
    const sortDirection: Prisma.SortOrder =
      rawSortDir === "asc" ? "asc" : "desc";

    const isSorted = !!params.sort;

    // ─── Filtro ────────────────────────────────────────────────────────────
    const filter = params.filter?.trim() ?? "";
    const where = this.buildWhere(filter);

    // ─── Query paginada em transação atômica ──────────────────────────────
    const [totalElements, organizations] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: { [sortBy]: sortDirection },
        skip,
        take: size,
      }),
    ]);

    // ─── Cálculos derivados ───────────────────────────────────────────────
    const totalPages = Math.ceil(totalElements / size);
    const numberOfElements = organizations.length;
    const isFirst = pageNumber === 0;
    const isLast = pageNumber >= totalPages - 1;
    const isEmpty = numberOfElements === 0;

    // ─── Metadados de sort (espelha Sort do Spring) ───────────────────────
    const sortMeta: Sort = {
      sorted: isSorted,
      unsorted: !isSorted,
      empty: !isSorted,
    };

    // ─── Retorno no contrato Spring Data Page<T> ──────────────────────────
    return {
      content: organizations.map(PrismaUserMapper.toDomain),

      pageable: {
        sort: sortMeta,
        offset: skip, // posição absoluta do primeiro elemento
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
      number: pageNumber, // 'number' é o nome do campo no Spring (página atual)
      first: isFirst,
      last: isLast,
      empty: isEmpty,
    };
  }
  private buildWhere(filter: string): Prisma.UserWhereInput {
    if (!filter) return {};

    return {
      OR: [{ email: { contains: filter, mode: "insensitive" } }],
    };
  }
  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }
  async findManyByIds(ids: string[]): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }
  async create(entity: UserEntity): Promise<UserEntity> {
    const raw = PrismaUserMapper.toPrisma(entity);
    const created = await this.prisma.user.create({
      data: raw,
    });

    return PrismaUserMapper.toDomain(created);
  }
  async exists(id: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    return !!user;
  }

  async save(entity: UserEntity): Promise<UserEntity> {
    const raw = PrismaUserMapper.toPrisma(entity);
    const updated = await this.prisma.user.update({
      where: { id: raw.id },
      data: raw,
    });

    return PrismaUserMapper.toDomain(updated);
  }
  async delete(entity: UserEntity): Promise<void> {
    await this.prisma.user.delete({
      where: { id: entity.id.getValue() },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }
}
