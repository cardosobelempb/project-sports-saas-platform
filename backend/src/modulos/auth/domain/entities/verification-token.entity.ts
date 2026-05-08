import { BaseAggregate } from "@/common/domain/entities/base-agregate.entity";
import { UUIDVO } from "@/common/domain/values-objects/uuidvo/uuid.vo";

export interface SessionProps {
  identifier: string;
  token: string;
  expires: Date;
}

export class SessionEntity extends BaseAggregate<SessionProps> {
  get identifier() {
    return this.props.identifier;
  }

  get token() {
    return this.props.token;
  }

  get expires() {
    return this.props.expires;
  }

  private touch() {
    this.props.expires = new Date();
  }

  static create(props: SessionProps, id?: UUIDVO) {
    return new SessionEntity(
      {
        ...props,
      },
      id,
    );
  }
}
