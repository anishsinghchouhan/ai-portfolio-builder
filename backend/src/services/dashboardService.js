import crypto from "crypto";
import prisma from "../config/prisma.js";
import env from "../config/env.js";

/**
 * Generate privacy-preserving salted SHA-256 visitor hash
 * Never stores or returns raw IP addresses.
 *
 * @param {string} ip - Client IP address
 * @param {string} userAgent - Client User Agent
 * @returns {string|null} Salted SHA-256 hash or null if no identifier provided
 */
export const generateVisitorHash = (ip, userAgent) => {
  if (!ip && !userAgent) return null;
  const salt = env.ANALYTICS_SALT || "portfolio_ai_analytics_salt_secure_2026";
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
 * Calculate Portfolio Readiness based on 6 real production verification checks:
 * 1. Profile filled (fullName and bio/headline)
 * 2. PDF Resume uploaded
 * 3. At least 1 skill in saved portfolio content
 * 4. At least 1 project created
 * 5. Theme chosen (theme is not null)
 * 6. Portfolio published
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
      route: primaryPortfolio ? `/dashboard/builder?id=${primaryPortfolio.id}` : "/dashboard/builder",
    },
    {
      key: "project_added",
      label: `${projectsCount} Showcase Project${projectsCount === 1 ? "" : "s"} Created`,
      isComplete: projectsCount > 0,
      missingLabel: "Add at least 1 showcase project",
      route: primaryPortfolio ? `/dashboard/builder?id=${primaryPortfolio.id}` : "/dashboard/builder",
    },
    {
      key: "theme_chosen",
      label: `Portfolio Theme Chosen (${primaryPortfolio?.theme || "Custom"})`,
      isComplete: Boolean(primaryPortfolio?.theme),
      missingLabel: "Select a design theme",
      route: primaryPortfolio ? `/dashboard/themes?id=${primaryPortfolio.id}` : "/dashboard/themes",
    },
    {
      key: "published",
      label: "Portfolio Published to Live URL",
      isComplete: Boolean(primaryPortfolio && primaryPortfolio.status === "PUBLISHED"),
      missingLabel: "Publish your portfolio online",
      route: primaryPortfolio ? `/dashboard/publish?id=${primaryPortfolio.id}` : "/dashboard/publish",
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
 * Fetch and assemble comprehensive dashboard summary for authenticated user
 *
 * @param {string} userId - Prisma user ID
 * @returns {Promise<object>} Clean dashboard metrics payload
 */
export const getDashboardSummaryForUser = async (userId) => {
  // Calculate 7-day cutoff (midnight 6 days ago + today)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  // Parallel database calls strictly scoped by userId
  const [
    portfoliosCount,
    resumesCount,
    projectsCount,
    primaryPortfolio,
    latestResume,
    analyticsViewsCount,
    userProfile,
  ] = await Promise.all([
    prisma.portfolio.count({ where: { userId } }),
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
    // Source of truth: Analytics table only
    prisma.analytics.count({
      where: { portfolio: { userId } },
    }),
    prisma.user
      .findUnique({
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
      })
      .catch(() =>
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            fullName: true,
            avatarUrl: true,
          },
        })
      ),
  ]);

  // Extract skills strictly from the primary portfolio's saved content
  const skillsList = primaryPortfolio ? extractSkillsFromPortfolioContent(primaryPortfolio.content) : [];
  const skillsCount = skillsList.length;

  // Unique visitors calculation (distinct IP / visitor)
  let uniqueVisitors = 0;
  try {
    const distinctVisitors = await prisma.analytics.groupBy({
      by: ["ipAddress"],
      where: {
        portfolio: { userId },
        ipAddress: { not: null },
      },
    });
    uniqueVisitors = distinctVisitors.length;
  } catch {
    uniqueVisitors = 0;
  }

  // 7-day daily views grouping via parameterized $queryRaw
  let rawDailyViews = [];
  try {
    rawDailyViews = await prisma.$queryRaw`
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
  } catch {
    rawDailyViews = [];
  }

  // Map 7-day query results to guarantee all 7 calendar days are present
  const viewsMap = new Map();
  for (const row of rawDailyViews) {
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

  return {
    counts: {
      portfolios: portfoliosCount || 0,
      resumes: resumesCount || 0,
      projects: projectsCount || 0,
      skills: skillsCount || 0,
    },
    analytics: {
      views: analyticsViewsCount || 0,
      downloads: 0, // Explicitly 0 until download counter is implemented
      uniqueVisitors: uniqueVisitors || 0,
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
  };
};

export default {
  generateVisitorHash,
  calculateProfileStrength,
  calculateReadiness,
  extractSkillsFromPortfolioContent,
  getDashboardSummaryForUser,
};
