-- Add performance indexes for dashboard summary queries and filters

-- CreateIndex on resumes(userId) and resumes(userId, createdAt)
CREATE INDEX IF NOT EXISTS "resumes_userId_idx" ON "resumes"("userId");
CREATE INDEX IF NOT EXISTS "resumes_userId_createdAt_idx" ON "resumes"("userId", "createdAt" DESC);

-- CreateIndex on portfolios(userId) and portfolios(userId, updatedAt)
CREATE INDEX IF NOT EXISTS "portfolios_userId_idx" ON "portfolios"("userId");
CREATE INDEX IF NOT EXISTS "portfolios_userId_updatedAt_idx" ON "portfolios"("userId", "updatedAt" DESC);

-- CreateIndex on projects(portfolioId)
CREATE INDEX IF NOT EXISTS "projects_portfolioId_idx" ON "projects"("portfolioId");

-- CreateIndex on analytics(portfolioId), analytics(portfolioId, visitedAt), analytics(visitedAt)
CREATE INDEX IF NOT EXISTS "analytics_portfolioId_idx" ON "analytics"("portfolioId");
CREATE INDEX IF NOT EXISTS "analytics_portfolioId_visitedAt_idx" ON "analytics"("portfolioId", "visitedAt");
CREATE INDEX IF NOT EXISTS "analytics_visitedAt_idx" ON "analytics"("visitedAt");

