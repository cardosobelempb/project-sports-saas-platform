/*
  Warnings:

  - You are about to drop the column `provider_type` on the `accounts` table. All the data in the column will be lost.
  - The `provider` column on the `accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `expires_at` on the `memberships` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `otps` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `verification_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `token_hash` on the `verification_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `verification_tokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier,token]` on the table `verification_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expired_at` to the `otps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expired_at` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expired_at` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Made the column `document_type` on table `user_profiles` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `expired_at` to the `verification_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `verification_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ConsentStatus" ADD VALUE 'EXPIRED';
ALTER TYPE "ConsentStatus" ADD VALUE 'PENDING';

-- DropIndex
DROP INDEX "otps_expires_at_idx";

-- DropIndex
DROP INDEX "sessions_expires_at_idx";

-- DropIndex
DROP INDEX "tokens_expires_at_idx";

-- DropIndex
DROP INDEX "verification_tokens_expires_at_idx";

-- DropIndex
DROP INDEX "verification_tokens_token_hash_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "provider_type",
ADD COLUMN     "token_type" "TokenType" NOT NULL DEFAULT 'ACCESS',
DROP COLUMN "provider",
ADD COLUMN     "provider" "ProviderType" NOT NULL DEFAULT 'CREDENTIALS';

-- AlterTable
ALTER TABLE "memberships" DROP COLUMN "expires_at",
ADD COLUMN     "expired_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "otps" DROP COLUMN "expires_at",
ADD COLUMN     "expired_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "expires_at",
ADD COLUMN     "expired_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "expires_at",
ADD COLUMN     "expired_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user_profiles" ALTER COLUMN "document_type" SET NOT NULL;

-- AlterTable
ALTER TABLE "verification_tokens" DROP COLUMN "expires_at",
DROP COLUMN "token_hash",
ADD COLUMN     "expired_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "token" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE INDEX "accounts_expires_at_idx" ON "accounts"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE INDEX "otps_expired_at_idx" ON "otps"("expired_at");

-- CreateIndex
CREATE INDEX "sessions_expired_at_idx" ON "sessions"("expired_at");

-- CreateIndex
CREATE INDEX "tokens_expired_at_idx" ON "tokens"("expired_at");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE INDEX "verification_tokens_expired_at_idx" ON "verification_tokens"("expired_at");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");
