import { PageRepository } from "@/common/domain/repositories/page-repository";
import { UserEntity } from "../entities/user.entity";

export abstract class UserRepository extends PageRepository<UserEntity> {
  // abstract findByName(name: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  // abstract findByRecoverKey(recoverKey: string): Promise<UserEntity | null>;
  // abstract findByKeepAlive(keepAlive: string): Promise<UserEntity | null>;
  // abstract findByCommission(commission: string): Promise<UserEntity | null>;
}
