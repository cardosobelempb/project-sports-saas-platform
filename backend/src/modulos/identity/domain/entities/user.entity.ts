import { BaseEntity } from "@/common/domain/entities/base.entity";
import { Optional } from "@/common/domain/types/Optional";
import { UUIDVO } from "@/common/domain/values-objects/uuidvo/uuid.vo";

export interface UserProps {
  email: string | null;
  emailVerified: Date | null;
  passwordHash: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export class UserEntity extends BaseEntity<UserProps> {
  get email() {
    return this.props.email;
  }

  get emailVerified() {
    return this.props.emailVerified;
  }

  get passwordHash() {
    return this.props.passwordHash;
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

  static create(
    props: Optional<
      UserProps,
      "emailVerified" | "createdAt" | "updatedAt" | "deletedAt"
    >,
    id?: UUIDVO,
  ) {
    return new UserEntity(
      {
        ...props,

        createdAt: props.createdAt ?? new Date(),
        emailVerified: props.emailVerified ?? null,
        updatedAt: props.updatedAt ?? null,
        deletedAt: props.deletedAt ?? null,
      },
      id,
    );
  }
}
