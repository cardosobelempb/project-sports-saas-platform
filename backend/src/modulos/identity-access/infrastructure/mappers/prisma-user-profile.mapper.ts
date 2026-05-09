import { PhoneVO } from "@/common/domain/values-objects/phone/phone.vo";
import { UUIDVO } from "@/common/domain/values-objects/uuidvo/uuid.vo";
import { DocumentType } from "@/common/shared/enums/document-type.enum";
import { UserProfileStatus } from "@/common/shared/enums/user-profile-status.enum";
import { UserProfile as PrismaUserProfile } from "../../../../../generated/prisma";
import { UserProfileDto } from "../../application/dto/user-profile.dto";
import { UserProfileEntity } from "../../domain/entities/user-profile.entity";

export class PrismaUserProfileMapper {
  static toDomain(raw: PrismaUserProfile): UserProfileEntity {
    return UserProfileEntity.create(
      {
        userId: UUIDVO.create(raw.userId),
        firstName: raw.firstName || "",
        lastName: raw.lastName || "",
        displayName: raw.displayName || "",
        fullName: raw.fullName || "",
        birthDate: raw.birthDate,
        phone: PhoneVO.create(raw.phone),
        avatarUrl: raw.avatarUrl || "",
        documentType: raw.documentType as DocumentType,
        documentNumber: raw.documentNumber || "",
      },
      UUIDVO.create(raw.id),
    );
  }

  static toDTO(entity: UserProfileEntity): UserProfileDto {
    return {
      id: entity.id.toString(),
      userId: entity.userId.toString(),
      firstName: entity.firstName || "",
      lastName: entity.lastName || "",
      displayName: entity.displayName || "",
      fullName: entity.fullName || "",
      birthDate: entity.birthDate,
      status: entity.status as UserProfileStatus,
      phone: entity.phone?.getValue(),
      avatarUrl: entity.avatarUrl || "",
      documentType: entity.documentType as DocumentType,
      documentNumber: entity.documentNumber || "",
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }

  static toPrisma(entity: UserProfileEntity): PrismaUserProfile {
    return {
      id: entity.id.getValue(),
      userId: entity.userId.getValue(),
      firstName: entity.firstName,
      lastName: entity.lastName,
      fullName: `${entity.firstName} ${entity.lastName}`,
      displayName: entity.displayName,
      birthDate: entity.birthDate || null,
      phone: entity.phone?.getValue() || null,
      avatarUrl: entity.avatarUrl,
      documentType: entity.documentType,
      documentNumber: entity.documentNumber,
      status: entity.status as UserProfileStatus,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
