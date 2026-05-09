import { PageRepository } from "@/common/domain/repositories/page-repository";
import { UserEntity } from "../entities/user.entity";

export abstract class UserRepository extends PageRepository<UserEntity> {
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract updatePasswordHash(
    userId: string,
    passwordHash: string,
  ): Promise<void>;
  abstract markEmailAsVerified(userId: string): Promise<void>;
  abstract softDelete(userId: string): Promise<void>;
}
