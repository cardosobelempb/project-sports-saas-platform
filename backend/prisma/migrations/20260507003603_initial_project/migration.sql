-- CreateEnum
CREATE TYPE "EntityStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED', 'DELETED');

-- CreateEnum
CREATE TYPE "VisibilityStatus" AS ENUM ('VISIBLE', 'HIDDEN', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "YesNoStatus" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "UserLevel" AS ENUM ('OWNER', 'ADMIN', 'AFFILIATE', 'OPERATOR', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CPF', 'CNPJ', 'RG', 'OTHER');

-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('DELIVERY', 'PICKUP', 'TABLE', 'OTHER');

-- CreateEnum
CREATE TYPE "DeliveryFeeType" AS ENUM ('FIXED', 'BY_DISTANCE', 'BY_CEP', 'MANUAL');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MONEY', 'DEBIT_CARD', 'CREDIT_CARD', 'FOOD_CARD', 'PIX', 'ONLINE', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('MERCADO_PAGO', 'PAGSEGURO', 'GETNET', 'PIX_MANUAL', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SubscriptionMode" AS ENUM ('TRIAL', 'PAID', 'VOUCHER', 'MANUAL');

-- CreateEnum
CREATE TYPE "VoucherStatus" AS ENUM ('UNUSED', 'USED', 'EXPIRED', 'CANCELED');

-- CreateEnum
CREATE TYPE "BannerScope" AS ENUM ('STORE', 'MARKETPLACE');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('PRODUCT', 'CATEGORY', 'STORE', 'BANNER', 'OTHER');

-- CreateEnum
CREATE TYPE "DomainType" AS ENUM ('STORE', 'MARKETPLACE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ScheduleAction" AS ENUM ('OPEN', 'CLOSE');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INVITED', 'SUSPENDED', 'REMOVED');

-- CreateEnum
CREATE TYPE "OrganizationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED', 'DELETED');

-- CreateEnum
CREATE TYPE "UserProfileStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('OWNER', 'ADMIN', 'MANAGER', 'SUPPORT', 'FINANCE', 'MEMBER');

-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('ACTIVE', 'REVOKED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('REFRESH', 'ACCESS', 'RESET_PASSWORD', 'API_KEY');

-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('GOOGLE', 'FACEBOOK', 'APPLE', 'CREDENTIALS', 'OTHER');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('TRIALING', 'ACTIVE', 'SUSPENDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOME', 'WORK', 'OTHER');

-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('FRIENDLY', 'RANKED', 'TOURNAMENT', 'TRAINING', 'CHALLENGE', 'CASUAL');

-- CreateEnum
CREATE TYPE "MatchPeriodType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'CONFIRMED', 'DISPUTED', 'FINISHED', 'CANCELLED', 'ADMIN_APPROVED');

-- CreateEnum
CREATE TYPE "RankingScope" AS ENUM ('CITY', 'STATE', 'CLUB', 'NATIONAL', 'AGE_GROUP', 'LEVEL');

-- CreateEnum
CREATE TYPE "TournamentFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'ANNUAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TournamentFormat" AS ENUM ('KNOCKOUT', 'GROUP_STAGE', 'ROUND_ROBIN', 'DOUBLE_ELIMINATION');

-- CreateEnum
CREATE TYPE "MatchValidation" AS ENUM ('PENDING', 'CONFIRMED_BY_BOTH', 'ADMIN_APPROVED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "SportType" AS ENUM ('INDIVIDUAL', 'TEAM', 'DUO');

-- CreateEnum
CREATE TYPE "ScoringType" AS ENUM ('POINTS', 'GOALS', 'SETS', 'TIME', 'DISTANCE');

-- CreateEnum
CREATE TYPE "WinCondition" AS ENUM ('HIGHEST_SCORE', 'BEST_OF', 'LOWEST_SCORE', 'TIME_BASED');

-- CreateEnum
CREATE TYPE "RankingHistoryReason" AS ENUM ('MATCH_WIN', 'MATCH_LOSS', 'MATCH_DRAW', 'ADMIN_ADJUSTMENT', 'PENALTY');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "email_verified" TIMESTAMP(3),
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider_type" "ProviderType" NOT NULL DEFAULT 'CREDENTIALS',
    "provider" VARCHAR(50) NOT NULL,
    "provider_account_id" VARCHAR(255) NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" "TokenType" DEFAULT 'ACCESS',
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "session_token" VARCHAR(255) NOT NULL,
    "user_id" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "display_name" VARCHAR(150),
    "full_name" VARCHAR(200),
    "document_type" "DocumentType",
    "document_number" VARCHAR(30),
    "phone" VARCHAR(20),
    "birth_date" DATE,
    "avatar_url" VARCHAR(500),
    "status" "UserProfileStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lgpd_consents" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "consent_terms" BOOLEAN NOT NULL,
    "consent_marketing" BOOLEAN NOT NULL,
    "consent_data_sharing" BOOLEAN NOT NULL,
    "consent_analytics" BOOLEAN NOT NULL,
    "ip_address" VARCHAR(45) NOT NULL,
    "mac_address" VARCHAR(20),
    "user_agent" VARCHAR(500) NOT NULL,
    "consent_version" VARCHAR(10) NOT NULL,
    "status" "ConsentStatus" NOT NULL DEFAULT 'ACTIVE',
    "withdrawn_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "organizationId" UUID,

    CONSTRAINT "lgpd_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "TokenType" NOT NULL DEFAULT 'ACCESS',
    "value_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otps" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "phone" VARCHAR(30) NOT NULL,
    "code_hash" VARCHAR(255) NOT NULL,
    "ip_address" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "states" (
    "id" UUID NOT NULL,
    "name" VARCHAR(75),
    "uf" VARCHAR(5),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120),
    "state_id" UUID,
    "subdomain" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "document_type" "DocumentType",
    "document_number" VARCHAR(30),
    "contact_email" VARCHAR(255),
    "phone" VARCHAR(20),
    "status" "TenantStatus" NOT NULL DEFAULT 'TRIALING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athletes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "nickname" VARCHAR(100),
    "dominant_hand" VARCHAR(10),
    "playing_style" VARCHAR(50),
    "isProfessional" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "document_type" "DocumentType",
    "document_number" VARCHAR(30),
    "contact_email" VARCHAR(255),
    "phone" VARCHAR(20),
    "logo_url" VARCHAR(500),
    "status" "OrganizationStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "tenantId" UUID,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'MEMBER',
    "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "joined_at" TIMESTAMP(3),
    "invited_email" VARCHAR(255),
    "invited_by_id" UUID,
    "expires_at" TIMESTAMP(3),
    "removed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "organizationId" UUID,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "tenant_id" UUID,
    "organization_id" UUID,
    "address_type" "AddressType" NOT NULL DEFAULT 'HOME',
    "street" VARCHAR(255),
    "address_number" VARCHAR(255),
    "complement" VARCHAR(255),
    "neighborhood" VARCHAR(255),
    "reference" VARCHAR(255),
    "city_id" UUID,
    "state_id" UUID,
    "zip_code" VARCHAR(255),
    "country" VARCHAR(255),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sport_type" "SportType" NOT NULL,
    "is_team_sport" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rule_sets" (
    "id" UUID NOT NULL,
    "sport_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "scoring_type" "ScoringType" NOT NULL,
    "win_condition" "WinCondition" NOT NULL,
    "max_periods" INTEGER,
    "points_to_win" INTEGER,
    "min_difference" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "rule_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" UUID NOT NULL,
    "sport_id" UUID NOT NULL,
    "rule_set_id" UUID NOT NULL,
    "match_type" "MatchType" NOT NULL,
    "status" "MatchStatus" NOT NULL,
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "periods" "MatchPeriodType"[],

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_participants" (
    "id" UUID NOT NULL,
    "match_id" UUID NOT NULL,
    "athlete_id" UUID,
    "team_id" UUID,
    "side" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "match_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_periods" (
    "id" UUID NOT NULL,
    "match_id" UUID NOT NULL,
    "period_number" INTEGER NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "match_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_period_scores" (
    "id" UUID NOT NULL,
    "period_id" UUID NOT NULL,
    "participant_id" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "match_period_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scoreboards" (
    "id" UUID NOT NULL,
    "match_id" UUID NOT NULL,
    "current_set" INTEGER NOT NULL DEFAULT 1,
    "player_a_id" TEXT NOT NULL,
    "player_b_id" TEXT NOT NULL,
    "player_a_points" INTEGER NOT NULL DEFAULT 0,
    "player_b_points" INTEGER NOT NULL DEFAULT 0,
    "player_a_sets" INTEGER NOT NULL DEFAULT 0,
    "player_b_sets" INTEGER NOT NULL DEFAULT 0,
    "first_server_id" TEXT NOT NULL,
    "current_server_id" TEXT NOT NULL,
    "has_switched_sides" BOOLEAN NOT NULL DEFAULT false,
    "is_finished" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "scoreboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "point_events" (
    "id" UUID NOT NULL,
    "match_id" UUID NOT NULL,
    "set_number" INTEGER NOT NULL,
    "player_id" UUID NOT NULL,
    "server_id" UUID NOT NULL,
    "scoring_type" "ScoringType" NOT NULL,
    "point_number" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "point_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournaments" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sport_id" UUID NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "format" "TournamentFormat" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_categories" (
    "id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "min_age" INTEGER,
    "max_age" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tournament_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_participants" (
    "id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "athlete_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tournament_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_matches" (
    "id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "player_a_id" UUID NOT NULL,
    "player_b_id" UUID,
    "round" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "match_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tournament_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athlete_rankings" (
    "id" UUID NOT NULL,
    "athlete_id" UUID NOT NULL,
    "sport_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1000,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "matches_played" INTEGER NOT NULL DEFAULT 0,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "best_streak" INTEGER NOT NULL DEFAULT 0,
    "city_id" UUID,
    "club_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "athlete_rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ranking_history" (
    "id" UUID NOT NULL,
    "athlete_ranking_id" UUID NOT NULL,
    "match_id" UUID,
    "old_rating" INTEGER NOT NULL,
    "new_rating" INTEGER NOT NULL,
    "rating_change" INTEGER NOT NULL,
    "old_xp" INTEGER NOT NULL,
    "new_xp" INTEGER NOT NULL,
    "xp_change" INTEGER NOT NULL,
    "reason" "RankingHistoryReason" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ranking_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE INDEX "accounts_deleted_at_idx" ON "accounts"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_document_number_key" ON "user_profiles"("document_number");

-- CreateIndex
CREATE INDEX "user_profiles_document_number_idx" ON "user_profiles"("document_number");

-- CreateIndex
CREATE INDEX "user_profiles_phone_idx" ON "user_profiles"("phone");

-- CreateIndex
CREATE INDEX "user_profiles_deleted_at_idx" ON "user_profiles"("deleted_at");

-- CreateIndex
CREATE INDEX "lgpd_consents_user_id_idx" ON "lgpd_consents"("user_id");

-- CreateIndex
CREATE INDEX "lgpd_consents_tenant_id_idx" ON "lgpd_consents"("tenant_id");

-- CreateIndex
CREATE INDEX "lgpd_consents_status_idx" ON "lgpd_consents"("status");

-- CreateIndex
CREATE INDEX "lgpd_consents_deleted_at_idx" ON "lgpd_consents"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "lgpd_consents_user_id_tenant_id_consent_version_key" ON "lgpd_consents"("user_id", "tenant_id", "consent_version");

-- CreateIndex
CREATE INDEX "tokens_user_id_idx" ON "tokens"("user_id");

-- CreateIndex
CREATE INDEX "tokens_user_id_type_idx" ON "tokens"("user_id", "type");

-- CreateIndex
CREATE INDEX "tokens_user_id_expires_at_idx" ON "tokens"("user_id", "expires_at");

-- CreateIndex
CREATE INDEX "tokens_deleted_at_idx" ON "tokens"("deleted_at");

-- CreateIndex
CREATE INDEX "otps_phone_idx" ON "otps"("phone");

-- CreateIndex
CREATE INDEX "otps_user_id_idx" ON "otps"("user_id");

-- CreateIndex
CREATE INDEX "otps_expires_at_idx" ON "otps"("expires_at");

-- CreateIndex
CREATE INDEX "otps_deleted_at_idx" ON "otps"("deleted_at");

-- CreateIndex
CREATE INDEX "states_deleted_at_idx" ON "states"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "states_uf_key" ON "states"("uf");

-- CreateIndex
CREATE INDEX "cities_state_id_idx" ON "cities"("state_id");

-- CreateIndex
CREATE INDEX "cities_subdomain_idx" ON "cities"("subdomain");

-- CreateIndex
CREATE INDEX "cities_deleted_at_idx" ON "cities"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_document_number_key" ON "tenants"("document_number");

-- CreateIndex
CREATE INDEX "tenants_status_idx" ON "tenants"("status");

-- CreateIndex
CREATE INDEX "tenants_deleted_at_idx" ON "tenants"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_user_id_key" ON "athletes"("user_id");

-- CreateIndex
CREATE INDEX "athletes_user_id_idx" ON "athletes"("user_id");

-- CreateIndex
CREATE INDEX "athletes_deleted_at_idx" ON "athletes"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_document_number_key" ON "organizations"("document_number");

-- CreateIndex
CREATE INDEX "organizations_status_idx" ON "organizations"("status");

-- CreateIndex
CREATE INDEX "organizations_deleted_at_idx" ON "organizations"("deleted_at");

-- CreateIndex
CREATE INDEX "memberships_user_id_idx" ON "memberships"("user_id");

-- CreateIndex
CREATE INDEX "memberships_tenant_id_idx" ON "memberships"("tenant_id");

-- CreateIndex
CREATE INDEX "memberships_tenant_id_role_idx" ON "memberships"("tenant_id", "role");

-- CreateIndex
CREATE INDEX "memberships_tenant_id_status_idx" ON "memberships"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "memberships_invited_email_idx" ON "memberships"("invited_email");

-- CreateIndex
CREATE INDEX "memberships_deleted_at_idx" ON "memberships"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_user_id_tenant_id_key" ON "memberships"("user_id", "tenant_id");

-- CreateIndex
CREATE INDEX "addresses_user_id_idx" ON "addresses"("user_id");

-- CreateIndex
CREATE INDEX "addresses_tenant_id_idx" ON "addresses"("tenant_id");

-- CreateIndex
CREATE INDEX "addresses_organization_id_idx" ON "addresses"("organization_id");

-- CreateIndex
CREATE INDEX "addresses_state_id_idx" ON "addresses"("state_id");

-- CreateIndex
CREATE INDEX "addresses_city_id_idx" ON "addresses"("city_id");

-- CreateIndex
CREATE INDEX "addresses_deleted_at_idx" ON "addresses"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "sports_slug_key" ON "sports"("slug");

-- CreateIndex
CREATE INDEX "sports_deleted_at_idx" ON "sports"("deleted_at");

-- CreateIndex
CREATE INDEX "rule_sets_deleted_at_idx" ON "rule_sets"("deleted_at");

-- CreateIndex
CREATE INDEX "matches_deleted_at_idx" ON "matches"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "match_participants_match_id_key" ON "match_participants"("match_id");

-- CreateIndex
CREATE INDEX "match_participants_deleted_at_idx" ON "match_participants"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "match_periods_match_id_key" ON "match_periods"("match_id");

-- CreateIndex
CREATE INDEX "match_periods_deleted_at_idx" ON "match_periods"("deleted_at");

-- CreateIndex
CREATE INDEX "match_period_scores_deleted_at_idx" ON "match_period_scores"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "scoreboards_match_id_key" ON "scoreboards"("match_id");

-- CreateIndex
CREATE INDEX "scoreboards_deleted_at_idx" ON "scoreboards"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "point_events_match_id_key" ON "point_events"("match_id");

-- CreateIndex
CREATE INDEX "point_events_deleted_at_idx" ON "point_events"("deleted_at");

-- CreateIndex
CREATE INDEX "tournaments_deleted_at_idx" ON "tournaments"("deleted_at");

-- CreateIndex
CREATE INDEX "tournament_categories_deleted_at_idx" ON "tournament_categories"("deleted_at");

-- CreateIndex
CREATE INDEX "tournament_participants_deleted_at_idx" ON "tournament_participants"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "tournament_matches_match_id_key" ON "tournament_matches"("match_id");

-- CreateIndex
CREATE INDEX "tournament_matches_deleted_at_idx" ON "tournament_matches"("deleted_at");

-- CreateIndex
CREATE INDEX "athlete_rankings_sport_id_rating_idx" ON "athlete_rankings"("sport_id", "rating");

-- CreateIndex
CREATE INDEX "athlete_rankings_sport_id_city_id_rating_idx" ON "athlete_rankings"("sport_id", "city_id", "rating");

-- CreateIndex
CREATE INDEX "athlete_rankings_sport_id_club_id_rating_idx" ON "athlete_rankings"("sport_id", "club_id", "rating");

-- CreateIndex
CREATE UNIQUE INDEX "athlete_rankings_athlete_id_sport_id_key" ON "athlete_rankings"("athlete_id", "sport_id");

-- CreateIndex
CREATE UNIQUE INDEX "ranking_history_match_id_key" ON "ranking_history"("match_id");

-- CreateIndex
CREATE INDEX "ranking_history_athlete_ranking_id_idx" ON "ranking_history"("athlete_ranking_id");

-- CreateIndex
CREATE INDEX "ranking_history_match_id_idx" ON "ranking_history"("match_id");

-- CreateIndex
CREATE INDEX "ranking_history_created_at_idx" ON "ranking_history"("created_at");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lgpd_consents" ADD CONSTRAINT "lgpd_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lgpd_consents" ADD CONSTRAINT "lgpd_consents_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lgpd_consents" ADD CONSTRAINT "lgpd_consents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rule_sets" ADD CONSTRAINT "rule_sets_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_rule_set_id_fkey" FOREIGN KEY ("rule_set_id") REFERENCES "rule_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_participants" ADD CONSTRAINT "match_participants_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_periods" ADD CONSTRAINT "match_periods_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_period_scores" ADD CONSTRAINT "match_period_scores_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "match_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scoreboards" ADD CONSTRAINT "scoreboards_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_categories" ADD CONSTRAINT "tournament_categories_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_participants" ADD CONSTRAINT "tournament_participants_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "tournament_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_matches" ADD CONSTRAINT "tournament_matches_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "tournament_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_matches" ADD CONSTRAINT "tournament_matches_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_rankings" ADD CONSTRAINT "athlete_rankings_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_rankings" ADD CONSTRAINT "athlete_rankings_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ranking_history" ADD CONSTRAINT "ranking_history_athlete_ranking_id_fkey" FOREIGN KEY ("athlete_ranking_id") REFERENCES "athlete_rankings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
