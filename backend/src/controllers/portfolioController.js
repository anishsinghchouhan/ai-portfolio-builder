import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import prisma from "../config/prisma.js";

export const RESERVED_SLUGS = [
  "login",
  "signup",
  "dashboard",
  "admin",
  "api",
  "pricing",
  "templates",
  "settings",
  "profile",
  "forgot-password",
  "reset-password",
  "auth",
  "home",
  "landing",
  "upload",
  "builder",
  "themes",
  "publish",
  "analytics",
  "terms",
  "privacy",
  "refund-policy",
  "contact",
  "about",
  "help",
  "blog",
  "billing",
];

// Helper to ensure dbUser is retrieved
const getDbUser = (req) => {
  if (req.user && req.user.id) {
    return req.user;
  }
  throw new AppError("Authenticated user identity missing.", 401, "UNAUTHORIZED");
};

// Helper to generate a unique slug for a portfolio
const generateUniqueSlug = async (title) => {
  const baseSlug = (title || "portfolio")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "portfolio";

  let slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
  let count = 0;

  while (count < 5) {
    if (!RESERVED_SLUGS.includes(slug)) {
      const existing = await prisma.portfolio.findUnique({ where: { slug } });
      if (!existing) break;
    }
    slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
    count++;
  }

  return slug;
};

/**
 * GET /api/v1/portfolios
 * Get all portfolios owned by the authenticated user
 */
export const getPortfolios = catchAsync(async (req, res, next) => {
  const dbUser = getDbUser(req);

  const userPortfolios = await prisma.portfolio.findMany({
    where: { userId: dbUser.id },
    orderBy: { updatedAt: "desc" },
    include: {
      projects: true,
    },
  });

  res.status(200).json({
    success: true,
    results: userPortfolios.length,
    data: userPortfolios,
  });
});

/**
 * GET /api/v1/portfolios/:id
 * Get single portfolio owned by authenticated user
 */
export const getPortfolioById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const dbUser = getDbUser(req);

  const portfolio = await prisma.portfolio.findUnique({
    where: { id },
    include: {
      projects: true,
    },
  });

  if (!portfolio) {
    return next(new AppError("Portfolio not found.", 404, "NOT_FOUND"));
  }

  // Strict ownership security check
  if (portfolio.userId !== dbUser.id) {
    return next(new AppError("You do not have permission to view this private portfolio.", 403, "FORBIDDEN"));
  }

  res.status(200).json({
    success: true,
    data: portfolio,
  });
});

/**
 * POST /api/v1/portfolios
 * Create a new portfolio for the authenticated user
 */
export const createPortfolio = catchAsync(async (req, res, next) => {
  const { title, theme, content, slug: customSlug } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return next(new AppError("Portfolio title is required.", 400, "BAD_REQUEST"));
  }

  const dbUser = getDbUser(req);
  let slug = customSlug;

  if (slug) {
    const cleanSlug = slug.toLowerCase().trim();
    if (RESERVED_SLUGS.includes(cleanSlug)) {
      return next(new AppError(`The slug '${cleanSlug}' is a reserved system URL and cannot be used.`, 400, "BAD_REQUEST"));
    }
    if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
      return next(new AppError("Portfolio slug can only contain lowercase letters, numbers, and hyphens.", 400, "BAD_REQUEST"));
    }
    slug = cleanSlug;
  }

  if (!slug) {
    slug = await generateUniqueSlug(title);
  } else {
    // Check if custom slug is available
    const existing = await prisma.portfolio.findUnique({ where: { slug } });
    if (existing) {
      return next(new AppError("Portfolio slug is already taken. Please choose another.", 409, "CONFLICT"));
    }
  }

  try {
    const newPortfolio = await prisma.portfolio.create({
      data: {
        userId: dbUser.id,
        title: title.trim(),
        slug,
        theme: theme || "dark-glass",
        status: "DRAFT",
        content: content || {},
        viewsCount: 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Portfolio created successfully",
      data: newPortfolio,
    });
  } catch (err) {
    if (err.code === "P2002") {
      return next(new AppError("A portfolio with this slug already exists.", 409, "CONFLICT"));
    }
    return next(new AppError("Failed to create portfolio in database.", 500, "DATABASE_ERROR"));
  }
});

/**
 * PATCH /api/v1/portfolios/:id
 * Update an existing portfolio owned by authenticated user
 */
export const updatePortfolio = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const dbUser = getDbUser(req);

  const portfolio = await prisma.portfolio.findUnique({ where: { id } });

  if (!portfolio) {
    return next(new AppError("Portfolio not found.", 404, "NOT_FOUND"));
  }

  // Ownership check
  if (portfolio.userId !== dbUser.id) {
    return next(new AppError("You do not have permission to update this portfolio.", 403, "FORBIDDEN"));
  }

  const { title, theme, content, status } = req.body;

  try {
    const updatedPortfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(theme && { theme }),
        ...(content && { content }),
        ...(status && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status) && { status }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Portfolio updated successfully",
      data: updatedPortfolio,
    });
  } catch (err) {
    return next(new AppError("Failed to update portfolio.", 500, "DATABASE_ERROR"));
  }
});

/**
 * DELETE /api/v1/portfolios/:id
 * Delete a portfolio owned by authenticated user
 */
export const deletePortfolio = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const dbUser = getDbUser(req);

  const portfolio = await prisma.portfolio.findUnique({ where: { id } });

  if (!portfolio) {
    return next(new AppError("Portfolio not found.", 404, "NOT_FOUND"));
  }

  // Ownership check
  if (portfolio.userId !== dbUser.id) {
    return next(new AppError("You do not have permission to delete this portfolio.", 403, "FORBIDDEN"));
  }

  await prisma.portfolio.delete({ where: { id } });

  res.status(200).json({
    success: true,
    message: "Portfolio deleted successfully",
  });
});

/**
 * PATCH /api/v1/portfolios/:id/publish
 * Publish a portfolio owned by authenticated user
 */
export const publishPortfolio = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const dbUser = getDbUser(req);

  const portfolio = await prisma.portfolio.findUnique({ where: { id } });

  if (!portfolio) {
    return next(new AppError("Portfolio not found.", 404, "NOT_FOUND"));
  }

  // Ownership check
  if (portfolio.userId !== dbUser.id) {
    return next(new AppError("You do not have permission to publish this portfolio.", 403, "FORBIDDEN"));
  }

  const publishedPortfolio = await prisma.portfolio.update({
    where: { id },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  res.status(200).json({
    success: true,
    message: "Portfolio published successfully",
    data: publishedPortfolio,
  });
});

/**
 * GET /api/v1/public/portfolios/:slug
 * Public endpoint to fetch published portfolio by slug
 */
export const getPublicPortfolioBySlug = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
    include: {
      projects: true,
    },
  });

  if (!portfolio || portfolio.status !== "PUBLISHED") {
    return next(new AppError("Published portfolio not found.", 404, "NOT_FOUND"));
  }

  const updatedPortfolio = await prisma.portfolio.update({
    where: { id: portfolio.id },
    data: {
      viewsCount: { increment: 1 },
    },
  });

  res.status(200).json({
    success: true,
    data: updatedPortfolio,
  });
});

export default {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  publishPortfolio,
  getPublicPortfolioBySlug,
};
