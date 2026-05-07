// shared/auth/token.types.ts

export type AccessTokenPayload = {
  sub: string;
  userId: string;
  tenantId: string;
  organizationId: string;
  email?: string;
  role?: string;
  sessionId?: string;
};

export type RefreshTokenPayload = {
  sub: string;
  sessionId: string;
};
