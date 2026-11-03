import crypto from "crypto";
import prisma from "../config/prisma.js";
import env from "../config/env.js";

/**
 * Generate privacy-preserving salted SHA-256 visitor hash.
 * Never stores or returns raw IP addresses.
 *
 * @param {string} ip - Client IP address
 * @param {string} userAgent - Client User Agent
 * @returns {string|null} Salted SHA-256 hash or null if no identifier provided
 */
export const generateVisitorHash = (ip, userAgent) => {
  if (!ip && !userAgent) return null;
  const salt = env.ANALYTICS_SALT;
  if (!salt) {
    throw new Error("ANALYTICS_SALT is not configured in backend environment.");
  }
  return crypto
    .createHash("sha256")
    .update(`${ip || ""}-${userAgent || ""}-${salt}`)
    .digest("hex");
};

/**
 * Calculate Profile Strength based on 9 candidate profile fields
 *
 * @param {object|null} user - User record from Prisma
 * @returns {object} { score, total, percentage, filledFields, missingFields }
 */
export const calculateProfileStrength = (user) => {
  const profileFields = [
    { key: "fullName", label: "Full Name" },
    { key: "headline", label: "Headline" },
    { key: "bio", label: "Bio / Summary" },
    { key: "location", label: "Location" },
    { key: "phone", label: "Phone" },
    { key: "github", label: "GitHub Profile URL" },
    { key: "linkedin", label: "LinkedIn Profile URL" },
    { key: "website", label: "Personal Website URL" },
    { key: "avatarUrl", label: "Profile Picture / Avatar" },
  ];

  if (!user) {
    return {
      score: 0,
      total: profileFields.length,
      percentage: 0,
      filledFields: [],
      missingFields: profileFields.map((f) => ({ key: f.key, label: f.label })),
    };
  }

  const filledFields = [];
  const missingFields = [];

  for (const field of profileFields) {
    const val = user[field.key];
    if (typeof val === "string" && val.trim().length > 0) {
      filledFields.push(field.key);
    } else {
      missingFields.push({ key: field.key, label: field.label });
    }
  }

  const percentage = Math.round((filledFields.length / profileFields.length) * 100);

  return {
    score: filledFields.length,
    total: profileFields.length,
    percentage,
    filledFields,
    missingFields,
  };
};

/**
 * Extract skills strictly from the saved portfolio content.
 * Never counts unreviewed or parsed resume raw data.
 *
 * @param {object|null} content - Portfolio content JSON
 * @returns {string[]} Array of unique non-empty skill names
 */
export const extractSkillsFromPortfolioContent = (content) => {
  if (!content || typeof content !== "object") return [];

  // 1. Direct skills array in portfolio content
  if (Array.isArray(content.skills)) {
    return content.skills.map((s) => (typeof s === "string" ? s.trim() : s?.name || "")).filter(Boolean);
  }

  // 2. Sections structure in portfolio content (e.g., sections: [{ id: "skills", items: [...] }])
  if (Array.isArray(content.sections)) {
    const skillsSection = content.sections.find(
      (s) => s.id === "skills" || (s.name && s.name.toLowerCase().includes("skill"))
    );
    if (skillsSection) {
      const candidateList = Array.isArray(skillsSection.items)
        ? skillsSection.items
        : Array.isArray(skillsSection.skills)
        ? skillsSection.skills
        : [];
      return candidateList
        .map((s) => (typeof s === "string" ? s.trim() : s?.name || ""))
        .filter(Boolean);
    }
  }

  return [];
};

/**
 * Calculate Portfolio Readiness based on 6 real verification checks:
 * 1. Profile filled (fullName and bio/headline)
 * 2. PDF Resume uploaded
 * 3. At least 1 skill in saved portfolio content
 * 4. At least 1 project created
 * 5. Theme customized (content.themeConfig exists)
 * 6. Portfolio published
 *
 * All routes point to valid parameterized routes or the create-portfolio action.
 *
 * @param {object} params
 * @returns {object} { percent, completed, missing }
 */
export const calculateReadiness = ({ user, resumesCount, skillsCount, projectsCount, primaryPortfolio }) => {
  const checks = [
    {
      key: "profile_filled",
      label: "Profile Bio & Candidate Details Completed",
      isComplete: Boolean(user?.fullName && (user?.headline || user?.bio)),
      missingLabel: "Complete your profile bio & headline",
      route: "/dashboard/profile",
    },
    {
      key: "resume_uploaded",
      label: "PDF Resume Uploaded & Saved",
      isComplete: resumesCount > 0,
      missingLabel: "Upload your PDF resume",
      route: "/dashboard/upload",
    },
    {
      key: "skill_added",
      label: `${skillsCount} Technical Skill${skillsCount === 1 ? "" : "s"} Saved`,
      isComplete: skillsCount > 0,
      missingLabel: "Add at least 1 skill in your portfolio",
      route: primaryPortfolio ? `/dashboard/builder/${primaryPortfolio.id}` : "/dashboard?action=create-portfolio",
    },
    {
      key: "project_added",
      label: `${projectsCount} Showcase Project${projectsCount === 1 ? "" : "s"} Created`,
      isComplete: projectsCount > 0,
      missingLabel: "Add at least 1 showcase project",
      route: primaryPortfolio ? `/dashboard/builder/${primaryPortfolio.id}` : "/dashboard?action=create-portfolio",
    },
    {
      key: "theme_chosen",
      label: "Portfolio Theme Customized",
      isComplete: Boolean(primaryPortfolio?.content && primaryPortfolio.content.themeConfig),
      missingLabel: "Customize your design theme",
      route: primaryPortfolio ? `/dashboard/themes/${primaryPortfolio.id}` : "/dashboard?action=create-portfolio",
    },
    {
      key: "published",
      label: "Portfolio Published to Live URL",
      isComplete: Boolean(primaryPortfolio && primaryPortfolio.status === "PUBLISHED"),
      missingLabel: "Publish your portfolio online",
      route: primaryPortfolio ? `/dashboard/publish/${primaryPortfolio.id}` : "/dashboard?action=create-portfolio",
    },
  ];

  const completed = [];
  const missing = [];

  for (const check of checks) {
    if (check.isComplete) {
      completed.push({
        key: check.key,
        label: check.label,
      });
    } else {
      missing.push({
        key: check.key,
        label: check.missingLabel,
        route: check.route,
      });
    }
  }

  const percent = Math.round((completed.length / checks.length) * 100);

  return {
    percent,
    completed,
    missing,
  };
};

/**
 * Phase E: Compute Product Journey on the backend (Single Source of Truth)
 * Status is strictly one of: "done" | "current" | "todo" | "coming_soon"
 * Exactly ONE step is "current" (the first not-done, non-coming_soon step).
 *
 * @param {object} params
 * @returns {Array<{ key: string, label: string, status: string, route: string, hint: string }>}
 */
export const calculateJourney = ({ user, primaryPortfolio, counts, profileStrength }) => {
  const steps = [
    {
      key: "profile",
      label: "Profile",
      isDone: (profileStrength?.percentage || 0) >= 50,
      isComingSoon: false,
      route: "/dashboard/profile",
      hint: "Complete at least 50% of your candidate profile details (Threshold: >= 50%)",
    },
    {
      key: "resume",
      label: "Resume",
      isDone: false,
      isComingSoon: true,
      route: "/dashboard/upload",
      hint: "PDF resume upload & ATS parsing (Coming in Round 2)",
    },
    {
      key: "ai_analysis",
      label: "AI Analysis",
      isDone: false,
      isComingSoon: true,
      route: "/dashboard/upload",
      hint: "AI portfolio recommendations & scoring (Coming in Round 2)",
    },
    {
      key: "portfolio",
      label: "Portfolio",
      isDone: (counts?.portfolios || 0) > 0,
      isComingSoon: false,
      route: primaryPortfolio ? `/dashboard/builder/${primaryPortfolio.id}` : "/dashboard?action=create-portfolio",
      hint: "Create your showcase portfolio website",
    },
    {
      key: "theme",
      label: "Theme",
      isDone: Boolean(primaryPortfolio?.content && primaryPortfolio.content.themeConfig),
      isComingSoon: false,
      route: primaryPortfolio ? `/dashboard/themes/${primaryPortfolio.id}` : "/dashboard?action=create-portfolio",
      hint: "Customize layout, colors, and typography",
    },
    {
      key: "publish",
      label: "Publish",
      isDone: (counts?.published || 0) > 0 || primaryPortfolio?.status === "PUBLISHED",
      isComingSoon: false,
      route: primaryPortfolio ? `/dashboard/publish/${primaryPortfolio.id}` : "/dashboard?action=create-portfolio",
      hint: "Deploy your portfolio to a live URL",
    },
    {
      key: "custom_url",
      label: "Custom URL",
      isDone: false,
      isComingSoon: true,
      route: primaryPortfolio ? `/dashboard/publish/${primaryPortfolio.id}` : "/dashboard",
      hint: "Connect your custom domain (Coming in Round 2)",
    },
    {
      key: "pdf_export",
      label: "PDF Export",
      isDone: false,
      isComingSoon: true,
      route: "/dashboard",
      hint: "Download high-res PDF portfolio (Coming in Round 2)",
    },
  ];

  let hasFoundCurrent = false;

  return steps.map((s) => {
    let status;
    if (s.isComingSoon) {
      status = "coming_soon";
    } else if (s.isDone) {
      status = "done";
    } else if (!hasFoundCurrent) {
      status = "current";
      hasFoundCurrent = true;
    } else {
      status = "todo";
    }

    return {
      key: s.key,
      label: s.label,
      status,
      route: s.route,
      hint: s.hint,
    };
  });
};

// ─── IN-MEMORY SUMMARY CACHE (30-60s TTL keyed by userId) ───────────────────
const summaryCache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

/**
 * Invalidate summary cache for a specific user or clear entire cache.
 * Must be called after every write mutation (profile, portfolio, publish, views).
 *
 * @param {string} [userId] - User ID to invalidate, or omit to clear all
 */
export const invalidateDashboardSummaryCache = (userId) => {
  if (userId) {
    summaryCache.delete(userId);
  } else {
    summaryCache.clear();
  }
};

// Periodic garbage collection to evict expired cache entries
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of summaryCache.entries()) {
      if (now - value.timestamp > CACHE_TTL_MS) {
        summaryCache.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

/**
 * Fetch and assemble comprehensive dashboard summary for authenticated user.
 * - Checks 60s in-memory cache first (0ms response).
 * - Coalesces concurrent in-flight requests for the same user (prevents stampedes).
 * - Runs all independent queries in parallel via Promise.all.
 * - Propagates errors cleanly (no silent swallowing).
 * - Returns recentPortfolios, counts.published, and calculated journey.
 *
 * @param {string} userId - Prisma user ID
 * @returns {Promise<object>} Clean dashboard metrics payload
 */
export const getDashboardSummaryForUser = async (userId) => {
  if (!userId) return null;

  // 1. Check in-memory cache
  const cached = summaryCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // 2. Deduplicate simultaneous in-flight requests for the same user
  if (inFlightRequests.has(userId)) {
    return inFlightRequests.get(userId);
  }

  const fetchPromise = (async () => {
    try {
      // Calculate 7-day cutoff (midnight 6 days ago + today)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setHours(0, 0, 0, 0);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

      // Helper: Combined analytics query (views + unique visitors in ONE query, no silent fallback)
      const fetchAnalyticsTotals = async () => {
        const res = await prisma.$queryRaw`
          SELECT
            COUNT(*)::int as "views",
            COUNT(DISTINCT a."ipAddress")::int as "uniqueVisitors"
          FROM "analytics" a
          INNER JOIN "portfolios" p ON a."portfolioId" = p."id"
          WHERE p."userId" = ${userId};
        `;
        if (Array.isArray(res) && res.length > 0) {
          return {
            views: Number(res[0].views) || 0,
            uniqueVisitors: Number(res[0].uniqueVisitors) || 0,
          };
        }
        return { views: 0, uniqueVisitors: 0 };
      };

      // Helper: 7-day daily views grouping via parameterized $queryRaw (no silent fallback)
      const fetchDailyViews = async () => {
        const res = await prisma.$queryRaw`
          SELECT
            DATE(a."visitedAt") as "visitDate",
            COUNT(*)::int as "viewsCount"
          FROM "analytics" a
          INNER JOIN "portfolios" p ON a."portfolioId" = p."id"
          WHERE p."userId" = ${userId}
            AND a."visitedAt" >= ${sevenDaysAgo}
          GROUP BY DATE(a."visitedAt")
          ORDER BY "visitDate" ASC;
        `;
        return Array.isArray(res) ? res : [];
      };

      // Parallel database calls strictly scoped by userId - ALL independent queries in ONE Promise.all
      const [
        portfoliosCount,
        publishedCount,
        resumesCount,
        projectsCount,
        primaryPortfolio,
        recentPortfoliosRaw,
        latestResume,
        userProfile,
        analyticsTotals,
        rawDailyViews,
      ] = await Promise.all([
        prisma.portfolio.count({ where: { userId } }),
        prisma.portfolio.count({ where: { userId, status: "PUBLISHED" } }),
        prisma.resume.count({ where: { userId } }),
        prisma.project.count({ where: { portfolio: { userId } } }),
        prisma.portfolio.findFirst({
          where: { userId },
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            theme: true,
            status: true,
            content: true,
            updatedAt: true,
            createdAt: true,
          },
        }),
        prisma.portfolio.findMany({
          where: { userId },
          orderBy: { updatedAt: "desc" },
          take: 5,
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            theme: true,
            viewsCount: true,
            updatedAt: true,
            _count: {
              select: { projects: true },
            },
          },
        }),
        prisma.resume.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            fileName: true,
            fileSize: true,
            fileUrl: true,
            isActive: true,
            createdAt: true,
          },
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            fullName: true,
            headline: true,
            bio: true,
            location: true,
            phone: true,
            github: true,
            linkedin: true,
            website: true,
            avatarUrl: true,
          },
        }),
        fetchAnalyticsTotals(),
        fetchDailyViews(),
      ]);

      // Format recent portfolios with projectsCount (zero N+1)
      const recentPortfolios = (recentPortfoliosRaw || []).map((p) => {
        const { _count, ...rest } = p;
        return {
          ...rest,
          projectsCount: _count?.projects || 0,
        };
      });

      // Extract skills strictly from the primary portfolio's saved content
      const skillsList = primaryPortfolio ? extractSkillsFromPortfolioContent(primaryPortfolio.content) : [];
      const skillsCount = skillsList.length;

      // Map 7-day query results to guarantee all 7 calendar days are present
      const viewsMap = new Map();
      for (const row of (rawDailyViews || [])) {
        const dStr = row.visitDate instanceof Date
          ? row.visitDate.toISOString().split("T")[0]
          : String(row.visitDate).slice(0, 10);
        viewsMap.set(dStr, Number(row.viewsCount) || 0);
      }

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - i);
        const dateStr = targetDate.toISOString().split("T")[0];
        const dayLabel = targetDate.toLocaleDateString("en-US", { weekday: "short" });

        last7Days.push({
          date: dateStr,
          day: dayLabel,
          views: viewsMap.get(dateStr) || 0,
        });
      }

      // Calculate separate Profile Strength (9 fields) and Portfolio Readiness (6 checks)
      const profileStrength = calculateProfileStrength(userProfile);
      const readiness = calculateReadiness({
        user: userProfile,
        resumesCount,
        skillsCount,
        projectsCount,
        primaryPortfolio,
      });

      const counts = {
        portfolios: portfoliosCount || 0,
        published: publishedCount || 0,
        resumes: resumesCount || 0,
        projects: projectsCount || 0,
        skills: skillsCount || 0,
      };

      // Calculate product journey (Phase E)
      const journey = calculateJourney({
        user: userProfile,
        primaryPortfolio,
        counts,
        profileStrength,
      });

      const result = {
        counts,
        analytics: {
          views: analyticsTotals?.views || 0,
          uniqueVisitors: analyticsTotals?.uniqueVisitors || 0,
          last7Days: Array.isArray(last7Days) ? last7Days : [],
        },
        primaryPortfolio: primaryPortfolio
          ? {
              id: primaryPortfolio.id || null,
              title: primaryPortfolio.title || "",
              slug: primaryPortfolio.slug || "",
              publicUrl: primaryPortfolio.slug ? `/${primaryPortfolio.slug}` : "",
              status: primaryPortfolio.status || "DRAFT",
              isPublished: primaryPortfolio.status === "PUBLISHED",
              theme: primaryPortfolio.theme || null,
              updatedAt: primaryPortfolio.updatedAt || null,
            }
          : null,
        recentPortfolios,
        latestResume: latestResume
          ? {
              id: latestResume.id || null,
              fileName: latestResume.fileName || "",
              fileSize: latestResume.fileSize || 0,
              fileUrl: latestResume.fileUrl || null,
              isActive: Boolean(latestResume.isActive),
              createdAt: latestResume.createdAt || null,
            }
          : null,
        profileStrength: {
          score: profileStrength?.score || 0,
          total: profileStrength?.total || 9,
          percentage: profileStrength?.percentage || 0,
          filledFields: profileStrength?.filledFields || [],
          missingFields: profileStrength?.missingFields || [],
        },
        readiness: {
          percent: readiness?.percent || 0,
          completed: readiness?.completed || [],
          missing: readiness?.missing || [],
        },
        journey,
      };

      // Store in memory cache with current timestamp ONLY on successful retrieval
      summaryCache.set(userId, {
        timestamp: Date.now(),
        data: result,
      });

      return result;
    } finally {
      inFlightRequests.delete(userId);
    }
  })();

  inFlightRequests.set(userId, fetchPromise);
  return fetchPromise;
};

export default {
  generateVisitorHash,
  calculateProfileStrength,
  calculateReadiness,
  calculateJourney,
  extractSkillsFromPortfolioContent,
  getDashboardSummaryForUser,
  invalidateDashboardSummaryCache,
};
