import { PageRepository } from "@/common/domain/repositories/page-repository";
import { Prisma } from "../../../../../generated/prisma";
import { MemberShipEntity } from "../entities/member-ship.entity";

export abstract class MemberShipRepository extends PageRepository<MemberShipEntity> {
  abstract findByEmail(email: string): Promise<MemberShipEntity | null>;

  abstract findByMemberShipUserId(
    userId: string,
  ): Promise<MemberShipEntity | null>;

  abstract existsByEmail(email: string): Promise<boolean>;

  // abstract existsByCpf(cpf: string): Promise<boolean>;

  abstract createWithTx(
    entity: MemberShipEntity,
    tx: Prisma.TransactionClient,
  ): Promise<MemberShipEntity>;
}
