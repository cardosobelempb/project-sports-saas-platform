import { PageRepository } from "@/common/domain/repositories/page-repository";
import { VerificationTokenEntity } from "../entities/verification-token.entity";

export abstract class VerificationTokenRepository extends PageRepository<VerificationTokenEntity> {
  // abstract findByEmail(email: string): Promise<VerificationTokenEntity | null>;
  // abstract existsByEmail(email: string): Promise<boolean>;
  // abstract updatePasswordHash(
  //   verificationtokenId: string,
  //   passwordHash: string,
  // ): Promise<void>;
  // abstract markEmailAsVerified(verificationtokenId: string): Promise<void>;
  // abstract softDelete(verificationtokenId: string): Promise<void>;
}
