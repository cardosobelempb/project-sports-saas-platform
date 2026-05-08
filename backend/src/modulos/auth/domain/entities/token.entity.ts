import { BaseAggregate } from "@/common/domain/entities/base-agregate.entity";
import { Optional } from "@/common/domain/types/Optional";
import { UUIDVO } from "@/common/domain/values-objects/uuidvo/uuid.vo";
import { TokenType } from "@/common/shared/enums/token-type.enum";

export interface SessionProps {
  sessionToken: string;
  userId: UUIDVO;
  tokenType: TokenType;
  valueHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export class SessionEntity extends BaseAggregate<SessionProps> {
  get sessionToken() {
    return this.props.sessionToken;
  }

  get userId() {
    return this.props.userId;
  }

  get tokenType() {
    return this.props.tokenType;
  }

  get valueHash() {
    return this.props.valueHash;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  get revokedAt() {
    return this.props.revokedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  private touch() {
    this.props.expiresAt = new Date();
  }

  static create(
    props: Optional<
      SessionProps,
      "tokenType" | "revokedAt" | "createdAt" | "updatedAt" | "deletedAt"
    >,
    id?: UUIDVO,
  ) {
    return new SessionEntity(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        revokedAt: props.revokedAt ?? null,
        tokenType: props.tokenType ?? TokenType.ACCESS,
        updatedAt: props.updatedAt ?? null,
        deletedAt: props.deletedAt ?? null,
      },
      id,
    );
  }
}
