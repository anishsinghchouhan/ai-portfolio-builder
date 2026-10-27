/**
 * Utility to defensively normalize dashboard summary API responses.
 * Guarantees null-safety across all components.
 * Turns missing or null numbers into 0, lists into [], and objects into null.
 *
 * @param {object|null|undefined} raw
 * @returns {object} Normalized summary object
 */
export const normalizeSummary = (raw) => {
  const data = raw && typeof raw === "object" ? raw : {};

  // 1. Counts: portfolios, resumes, projects, skills
  const counts = data.counts && typeof data.counts === "object" ? data.counts : {};
  const normalizedCounts = {
    portfolios: Number.isFinite(counts.portfolios) ? Math.max(0, counts.portfolios) : 0,
    resumes: Number.isFinite(counts.resumes) ? Math.max(0, counts.resumes) : 0,
    projects: Number.isFinite(counts.projects) ? Math.max(0, counts.projects) : 0,
    skills: Number.isFinite(counts.skills) ? Math.max(0, counts.skills) : 0,
  };

  // 2. Analytics: views, downloads, uniqueVisitors, last7Days
  const analytics = data.analytics && typeof data.analytics === "object" ? data.analytics : {};
  const last7DaysRaw = Array.isArray(analytics.last7Days) ? analytics.last7Days : [];

  // Guarantee 7 days if server returned fewer or empty
  const normalizedLast7Days = last7DaysRaw.length === 7
    ? last7DaysRaw.map((dayItem) => ({
        date: typeof dayItem?.date === "string" ? dayItem.date : "",
        day: typeof dayItem?.day === "string" ? dayItem.day : "",
        views: Number.isFinite(dayItem?.views) ? Math.max(0, dayItem.views) : 0,
      }))
    : (() => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split("T")[0];
          const found = last7DaysRaw.find((item) => item?.date === dateStr);
          days.push({
            date: dateStr,
            day: d.toLocaleDateString("en-US", { weekday: "short" }),
            views: Number.isFinite(found?.views) ? Math.max(0, found.views) : 0,
          });
        }
        return days;
      })();

  const normalizedAnalytics = {
    views: Number.isFinite(analytics.views) ? Math.max(0, analytics.views) : 0,
    downloads: Number.isFinite(analytics.downloads) ? Math.max(0, analytics.downloads) : 0,
    uniqueVisitors: Number.isFinite(analytics.uniqueVisitors) ? Math.max(0, analytics.uniqueVisitors) : 0,
    last7Days: normalizedLast7Days,
  };

  // 3. Primary Portfolio: null or object
  let normalizedPortfolio = null;
  if (data.primaryPortfolio && typeof data.primaryPortfolio === "object" && data.primaryPortfolio.id) {
    const p = data.primaryPortfolio;
    normalizedPortfolio = {
      id: String(p.id),
      title: typeof p.title === "string" ? p.title.trim() : "Untitled Portfolio",
      slug: typeof p.slug === "string" ? p.slug.trim() : "",
      publicUrl: typeof p.slug === "string" && p.slug ? `/${p.slug.trim()}` : "",
      status: typeof p.status === "string" ? p.status : "DRAFT",
      isPublished: Boolean(p.isPublished || p.status === "PUBLISHED"),
      theme: typeof p.theme === "string" ? p.theme : null,
      updatedAt: p.updatedAt ? String(p.updatedAt) : null,
    };
  }

  // 4. Latest Resume: null or object
  let normalizedResume = null;
  if (data.latestResume && typeof data.latestResume === "object" && data.latestResume.id) {
    const r = data.latestResume;
    normalizedResume = {
      id: String(r.id),
      fileName: typeof r.fileName === "string" ? r.fileName.trim() : "Resume.pdf",
      fileSize: Number.isFinite(r.fileSize) ? Math.max(0, r.fileSize) : 0,
      fileUrl: typeof r.fileUrl === "string" ? r.fileUrl : null,
      isActive: Boolean(r.isActive),
      createdAt: r.createdAt ? String(r.createdAt) : null,
    };
  }

  // 5. Profile Strength: score, total, percentage, filledFields, missingFields
  const ps = data.profileStrength && typeof data.profileStrength === "object" ? data.profileStrength : {};
  const normalizedProfileStrength = {
    score: Number.isFinite(ps.score) ? Math.max(0, ps.score) : 0,
    total: Number.isFinite(ps.total) && ps.total > 0 ? ps.total : 9,
    percentage: Number.isFinite(ps.percentage) ? Math.min(100, Math.max(0, Math.round(ps.percentage))) : 0,
    filledFields: Array.isArray(ps.filledFields) ? ps.filledFields : [],
    missingFields: Array.isArray(ps.missingFields) ? ps.missingFields : [],
  };

  // 6. Portfolio Readiness: percent, completed, missing
  const rd = data.readiness && typeof data.readiness === "object" ? data.readiness : {};
  const normalizedReadiness = {
    percent: Number.isFinite(rd.percent) ? Math.min(100, Math.max(0, Math.round(rd.percent))) : 0,
    completed: Array.isArray(rd.completed) ? rd.completed : [],
    missing: Array.isArray(rd.missing) ? rd.missing : [],
  };

  return {
    counts: normalizedCounts,
    analytics: normalizedAnalytics,
    primaryPortfolio: normalizedPortfolio,
    latestResume: normalizedResume,
    profileStrength: normalizedProfileStrength,
    readiness: normalizedReadiness,
  };
};

export default normalizeSummary;
