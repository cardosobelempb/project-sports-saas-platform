import { UUIDVO } from "@/common/domain/values-objects/uuidvo/uuid.vo";
import { User as PrismaUser } from "../../../../../generated/prisma";

import { UserDto } from "../../application/dto/user.dto";
import { UserEntity } from "../../domain/entities/user.entity";

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): UserEntity {
    return UserEntity.create(
      {
        email: raw.email || "",
        passwordHash: raw.passwordHash || "",
      },
      UUIDVO.create(raw.id),
    );
  }

  static toDTO(entity: UserEntity): UserDto {
    return {
      id: entity.id.toString(),
      email: entity.email || "",
      passwordHash: entity.passwordHash || "",
    };
  }

  static toPrisma(entity: UserEntity): PrismaUser {
    return {
      id: entity.id.getValue(),

      email: entity.email,
      passwordHash: entity.passwordHash,
      emailVerified: entity.emailVerified,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
