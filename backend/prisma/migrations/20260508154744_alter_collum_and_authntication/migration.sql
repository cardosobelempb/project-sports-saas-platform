/*
  Warnings:

  - You are about to drop the column `token_type` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `athletes` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `lgpd_consents` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `lgpd_consents` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `memberships` table. All the data in the column will be lost.
  - The `role` column on the `memberships` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `memberships` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `contact_email` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `document_number` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `document_type` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `expires` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `document_type` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `expires` on the `verification_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `verification_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,consent_version]` on the table `lgpd_consents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,tenant_id,organization_id]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenant_id,slug]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token_hash]` on the table `verification_tokens` will be added. If there are existing duplicate values, this will fail.
  - Made the column `created_at` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `tenant_id` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `verification_tokens` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `verification_tokens` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `token_hash` to the `verification_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('OWNER', 'ADMIN', 'AFFILIATE', 'OPERATOR', 'CUSTOMER', 'MANAGER', 'SUPPORT', 'FINANCE', 'MEMBER');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'INVITED', 'SUSPENDED', 'REMOVED', 'DELETED');

-- AlterEnum
ALTER TYPE "TokenType" ADD VALUE 'EMAIL_VERIFICATION';

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "athletes" DROP CONSTRAINT "athletes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "lgpd_consents" DROP CONSTRAINT "lgpd_consents_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "lgpd_consents" DROP CONSTRAINT "lgpd_consents_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_tenantId_fkey";

-- DropIndex
DROP INDEX "addresses_organization_id_idx";

-- DropIndex
DROP INDEX "addresses_tenant_id_idx";

-- DropIndex
DROP INDEX "athletes_user_id_idx";

-- DropIndex
DROP INDEX "athletes_user_id_key";

-- DropIndex
DROP INDEX "lgpd_consents_tenant_id_idx";

-- DropIndex
DROP INDEX "lgpd_consents_user_id_tenant_id_consent_version_key";

-- DropIndex
DROP INDEX "memberships_invited_email_idx";

-- DropIndex
DROP INDEX "memberships_user_id_tenant_id_key";

-- DropIndex
DROP INDEX "organizations_document_number_key";

-- DropIndex
DROP INDEX "organizations_slug_key";

-- DropIndex
DROP INDEX "tokens_user_id_expires_at_idx";

-- DropIndex
DROP INDEX "verification_tokens_identifier_token_key";

-- DropIndex
DROP INDEX "verification_tokens_token_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "token_type";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "organization_id",
DROP COLUMN "tenant_id",
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "athletes" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "lgpd_consents" DROP COLUMN "organizationId",
DROP COLUMN "tenant_id";

-- AlterTable
ALTER TABLE "memberships" DROP COLUMN "organizationId",
ADD COLUMN     "organization_id" UUID,
DROP COLUMN "role",
ADD COLUMN     "role" "MembershipRole" NOT NULL DEFAULT 'MEMBER',
DROP COLUMN "status",
ADD COLUMN     "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "contact_email",
DROP COLUMN "document_number",
DROP COLUMN "document_type",
DROP COLUMN "phone",
DROP COLUMN "tenantId",
ADD COLUMN     "tenant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "expires",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ip_address" VARCHAR(45),
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD COLUMN     "user_agent" VARCHAR(500);

-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "document_type";

-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "ip_address" VARCHAR(45),
ADD COLUMN     "user_agent" VARCHAR(500),
ALTER COLUMN "type" SET DEFAULT 'REFRESH';

-- AlterTable
ALTER TABLE "verification_tokens" DROP COLUMN "expires",
DROP COLUMN "token",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id" UUID NOT NULL,
ADD COLUMN     "token_hash" VARCHAR(255) NOT NULL,
ADD COLUMN     "used_at" TIMESTAMP(3),
ADD CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "MemberRole";

-- DropEnum
DROP TYPE "MemberStatus";

-- DropEnum
DROP TYPE "UserLevel";

-- CreateIndex
CREATE UNIQUE INDEX "lgpd_consents_user_id_consent_version_key" ON "lgpd_consents"("user_id", "consent_version");

-- CreateIndex
CREATE INDEX "memberships_organization_id_idx" ON "memberships"("organization_id");

-- CreateIndex
CREATE INDEX "memberships_tenant_id_role_idx" ON "memberships"("tenant_id", "role");

-- CreateIndex
CREATE INDEX "memberships_tenant_id_status_idx" ON "memberships"("tenant_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_user_id_tenant_id_organization_id_key" ON "memberships"("user_id", "tenant_id", "organization_id");

-- CreateIndex
CREATE INDEX "organizations_tenant_id_idx" ON "organizations"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_tenant_id_slug_key" ON "organizations"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "sessions_deleted_at_idx" ON "sessions"("deleted_at");

-- CreateIndex
CREATE INDEX "tokens_expires_at_idx" ON "tokens"("expires_at");

-- CreateIndex
CREATE INDEX "tokens_revoked_at_idx" ON "tokens"("revoked_at");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_hash_key" ON "verification_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "verification_tokens_identifier_idx" ON "verification_tokens"("identifier");

-- CreateIndex
CREATE INDEX "verification_tokens_expires_at_idx" ON "verification_tokens"("expires_at");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
