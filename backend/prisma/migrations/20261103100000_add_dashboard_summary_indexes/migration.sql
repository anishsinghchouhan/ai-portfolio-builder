-- CreateIndex
CREATE INDEX IF NOT EXISTS "resumes_userId_createdAt_idx" ON "resumes"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "portfolios_userId_updatedAt_idx" ON "portfolios"("userId", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "projects_portfolioId_idx" ON "projects"("portfolioId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "analytics_portfolioId_visitedAt_idx" ON "analytics"("portfolioId", "visitedAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "analytics_visitedAt_idx" ON "analytics"("visitedAt");
