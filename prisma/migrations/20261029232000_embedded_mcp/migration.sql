CREATE TABLE "mcp_settings" ("id" TEXT NOT NULL DEFAULT 'default', "enabled" BOOLEAN NOT NULL DEFAULT false, "allowWrites" BOOLEAN NOT NULL DEFAULT false, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "mcp_settings_pkey" PRIMARY KEY ("id"));
CREATE TABLE "mcp_oauth_clients" ("id" TEXT NOT NULL, "redirectUris" TEXT[] NOT NULL, "clientName" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "mcp_oauth_clients_pkey" PRIMARY KEY ("id"));
CREATE TABLE "mcp_auth_codes" ("codeHash" TEXT NOT NULL, "clientId" TEXT NOT NULL, "userId" TEXT NOT NULL, "redirectUri" TEXT NOT NULL, "codeChallenge" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "mcp_auth_codes_pkey" PRIMARY KEY ("codeHash"));
CREATE TABLE "mcp_refresh_tokens" ("tokenHash" TEXT NOT NULL, "clientId" TEXT NOT NULL, "userId" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "mcp_refresh_tokens_pkey" PRIMARY KEY ("tokenHash"));
CREATE TABLE "mcp_audit_logs" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "tool" TEXT NOT NULL, "target" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "mcp_audit_logs_pkey" PRIMARY KEY ("id"));
CREATE INDEX "mcp_auth_codes_expiresAt_idx" ON "mcp_auth_codes"("expiresAt");
CREATE INDEX "mcp_refresh_tokens_expiresAt_idx" ON "mcp_refresh_tokens"("expiresAt");
CREATE INDEX "mcp_refresh_tokens_userId_idx" ON "mcp_refresh_tokens"("userId");
CREATE INDEX "mcp_audit_logs_createdAt_idx" ON "mcp_audit_logs"("createdAt" DESC);
