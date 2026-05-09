import { PageRepository } from "@/common/domain/repositories/page-repository";
import { SessionEntity } from "@/modulos/identity-access/domain/entities/session.entity";

export abstract class SessionRepository extends PageRepository<SessionEntity> {
  abstract findBySessionToken(
    sessionToken: string,
  ): Promise<SessionEntity | null>;
  abstract findActiveByUserId(userId: string): Promise<SessionEntity[]>;
  abstract revoke(sessionId: string): Promise<void>;
  abstract revokeAllByUserId(userId: string): Promise<void>;
}
