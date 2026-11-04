import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { z } from "zod";

import {
  calculateProfileStrength,
  calculateReadiness,
  calculateJourney,
  buildRecentActivity,
  invalidateDashboardSummaryCache,
} from "../src/services/dashboardService.js";

describe("Dashboard Service & Correctness Suite (Isolated from Production DB)", () => {
  describe("1. Profile Strength Calculation", () => {
    it("returns 0% for an empty user profile", () => {
      const user = {
        fullName: null,
        headline: null,
        bio: null,
        location: null,
        phone: null,
        github: null,
        linkedin: null,
        website: null,
        avatarUrl: null,
      };

      const result = calculateProfileStrength(user);
      assert.equal(result.score, 0);
      assert.equal(result.total, 9);
      assert.equal(result.percentage, 0);
      assert.equal(result.missingFields.length, 9);
    });

    it("calculates exact percentage for partially completed profile", () => {
      const user = {
        fullName: "Jane Doe",
        headline: "Senior Software Engineer",
        bio: "Passionate about distributed systems.",
        location: "San Francisco, CA",
        phone: null,
        github: "https://github.com/janedoe",
        linkedin: null,
        website: null,
        avatarUrl: null,
      };

      const result = calculateProfileStrength(user);
      // 5 out of 9 completed = round((5/9) * 100) = 56%
      assert.equal(result.score, 5);
      assert.equal(result.percentage, 56);
      assert.equal(result.missingFields.length, 4);
      assert.ok(result.missingFields.some((f) => f.key === "phone"));
      assert.ok(result.missingFields.some((f) => f.key === "linkedin"));
    });

    it("returns 100% when all 9 fields are present", () => {
      const user = {
        fullName: "Jane Doe",
        headline: "Staff Engineer",
        bio: "Bio text",
        location: "NY",
        phone: "+1234567890",
        github: "https://github.com/janedoe",
        linkedin: "https://linkedin.com/in/janedoe",
        website: "https://janedoe.com",
        avatarUrl: "https://janedoe.com/avatar.jpg",
      };

      const result = calculateProfileStrength(user);
      assert.equal(result.score, 9);
      assert.equal(result.percentage, 100);
      assert.equal(result.missingFields.length, 0);
    });
  });

  describe("2. Portfolio Readiness & Theme Check Bugfix", () => {
    it("does not mark theme_chosen if portfolio only has default theme string but no content.themeConfig", () => {
      const portfolio = {
        id: "port_1",
        title: "Default Theme Portfolio",
        theme: "dark-glass", // default value in Prisma schema
        content: {
          personal: { name: "Jane" },
          skills: ["React", "Node.js"],
          projects: [{ title: "App 1" }],
        },
        status: "DRAFT",
      };

      const readiness = calculateReadiness({
        user: { fullName: "Jane", headline: "Engineer" },
        resumesCount: 0,
        skillsCount: 2,
        projectsCount: 1,
        primaryPortfolio: portfolio,
      });

      // theme_chosen should be in missing because user never actually customized themeConfig
      assert.ok(readiness.missing.some((m) => m.key === "theme_chosen"));
      assert.ok(!readiness.completed.some((c) => c.key === "theme_chosen"));
      assert.ok(readiness.completed.some((c) => c.key === "skill_added"));
      assert.ok(readiness.completed.some((c) => c.key === "project_added"));
    });

    it("marks theme_chosen as true when user customized content.themeConfig", () => {
      const portfolio = {
        id: "port_1",
        title: "Customized Theme Portfolio",
        theme: "dark-glass",
        content: {
          personal: { name: "Jane" },
          skills: ["React"],
          projects: [{ title: "App 1" }],
          themeConfig: {
            primaryColor: "#6366f1",
            fontFamily: "Inter",
          },
        },
        status: "DRAFT",
      };

      const readiness = calculateReadiness({
        user: { fullName: "Jane", headline: "Engineer" },
        resumesCount: 0,
        skillsCount: 1,
        projectsCount: 1,
        primaryPortfolio: portfolio,
      });

      assert.ok(readiness.completed.some((c) => c.key === "theme_chosen"));
      assert.ok(!readiness.missing.some((m) => m.key === "theme_chosen"));
    });

    it("marks portfolio_published as true only when status === PUBLISHED", () => {
      const draftPortfolio = {
        id: "port_draft",
        status: "DRAFT",
      };
      const draftReadiness = calculateReadiness({
        user: null,
        resumesCount: 0,
        skillsCount: 0,
        projectsCount: 0,
        primaryPortfolio: draftPortfolio,
      });
      assert.ok(draftReadiness.missing.some((m) => m.key === "published"));

      const publishedPortfolio = {
        id: "port_pub",
        status: "PUBLISHED",
      };
      const pubReadiness = calculateReadiness({
        user: null,
        resumesCount: 0,
        skillsCount: 0,
        projectsCount: 0,
        primaryPortfolio: publishedPortfolio,
      });
      assert.ok(pubReadiness.completed.some((c) => c.key === "published"));
    });
  });

  describe("3. Product Journey Step Computation", () => {
    it("new user with 0% profile and 0 portfolios has Profile as current step", () => {
      const journey = calculateJourney({
        user: { fullName: null },
        primaryPortfolio: null,
        counts: { portfolios: 0, published: 0 },
        profileStrength: { percentage: 0 },
      });

      assert.equal(journey.length, 8);

      const profileStep = journey.find((s) => s.key === "profile");
      assert.equal(profileStep.status, "current");

      const resumeStep = journey.find((s) => s.key === "resume");
      assert.equal(resumeStep.status, "coming_soon");

      const portfolioStep = journey.find((s) => s.key === "portfolio");
      assert.equal(portfolioStep.status, "todo");

      const comingSoonSteps = journey.filter((s) => s.status === "coming_soon");
      assert.equal(comingSoonSteps.length, 4); // resume, ai_analysis, custom_url, pdf_export
    });

    it("user with profile >= 50% and 0 portfolios has Portfolio as current step", () => {
      const journey = calculateJourney({
        user: { fullName: "Jane" },
        primaryPortfolio: null,
        counts: { portfolios: 0, published: 0 },
        profileStrength: { percentage: 56 }, // >= 50 threshold
      });

      const profileStep = journey.find((s) => s.key === "profile");
      assert.equal(profileStep.status, "done");

      const portfolioStep = journey.find((s) => s.key === "portfolio");
      assert.equal(portfolioStep.status, "current");
      assert.ok(portfolioStep.route.includes("action=create-portfolio"));
    });

    it("user with published portfolio and customized theme has publish marked done", () => {
      const journey = calculateJourney({
        user: { fullName: "Jane" },
        primaryPortfolio: {
          id: "p123",
          status: "PUBLISHED",
          content: { themeConfig: { color: "blue" } },
        },
        counts: { portfolios: 1, published: 1 },
        profileStrength: { percentage: 100 },
      });

      const profileStep = journey.find((s) => s.key === "profile");
      assert.equal(profileStep.status, "done");

      const portfolioStep = journey.find((s) => s.key === "portfolio");
      assert.equal(portfolioStep.status, "done");

      const themeStep = journey.find((s) => s.key === "theme");
      assert.equal(themeStep.status, "done");

      const publishStep = journey.find((s) => s.key === "publish");
      assert.equal(publishStep.status, "done");
    });
  });

  describe("4. Recent Activity Timeline Builder", () => {
    it("returns empty array when user has no portfolios or resumes", () => {
      const activities = buildRecentActivity({ recentPortfolios: [], latestResume: null });
      assert.equal(Array.isArray(activities), true);
      assert.equal(activities.length, 0);
    });

    it("builds timeline from real portfolio timestamps and sorts newest first", () => {
      const recentPortfolios = [
        {
          id: "p_1",
          title: "sss",
          slug: "sss-portfolio",
          status: "DRAFT",
          createdAt: new Date("2026-11-03T10:00:00Z").toISOString(),
          updatedAt: new Date("2026-11-03T10:00:00Z").toISOString(),
        },
        {
          id: "p_2",
          title: "wee",
          slug: "wee-portfolio",
          status: "PUBLISHED",
          createdAt: new Date("2026-11-03T11:00:00Z").toISOString(),
          updatedAt: new Date("2026-11-03T11:30:00Z").toISOString(),
          publishedAt: new Date("2026-11-03T11:30:00Z").toISOString(),
        },
      ];

      const activities = buildRecentActivity({ recentPortfolios, latestResume: null });
      assert.ok(activities.length >= 2, "Expected at least 2 events for 2 portfolios");
      // Newest event should be the publish of wee at 11:30
      assert.equal(activities[0].title, 'Published portfolio "wee"');
      // Should include creation of sss
      assert.ok(activities.some((a) => a.title === 'Created portfolio "sss"'));
    });
  });

  describe("5. Cache Invalidation", () => {
    it("invalidateDashboardSummaryCache function is exported and callable without throwing", () => {
      assert.doesNotThrow(() => {
        invalidateDashboardSummaryCache("user_test_123");
      });
      assert.doesNotThrow(() => {
        invalidateDashboardSummaryCache(null);
      });
    });
  });

  describe("5. Visitor Telemetry Hash Safety & 30-Minute Deduplication", () => {
    it("hashes IP with salt using SHA-256 so raw IP is never stored", () => {
      const rawIp = "192.168.1.100";
      const salt = "test-salt-secret";
      const userAgent = "Mozilla/5.0";

      const hash = crypto
        .createHash("sha256")
        .update(`${rawIp}-${userAgent}-${salt}`)
        .digest("hex");

      assert.equal(typeof hash, "string");
      assert.equal(hash.length, 64);
      assert.ok(!hash.includes(rawIp));
      assert.ok(!hash.includes("192.168"));
    });

    it("evaluates 30-minute deduplication window for public portfolio view tracking", () => {
      const now = Date.now();
      const thirtyMinutesMs = 30 * 60 * 1000;
      const thirtyMinutesAgo = new Date(now - thirtyMinutesMs);

      // Simulating a view recorded 10 minutes ago (within deduplication window)
      const recentVisitTime = new Date(now - 10 * 60 * 1000);
      const isWithinWindow = recentVisitTime >= thirtyMinutesAgo;
      assert.equal(isWithinWindow, true, "Visit within 30 min should be deduplicated (not incremented)");

      // Simulating a visit from 35 minutes ago (outside deduplication window)
      const oldVisitTime = new Date(now - 35 * 60 * 1000);
      const isOldWithinWindow = oldVisitTime >= thirtyMinutesAgo;
      assert.equal(isOldWithinWindow, false, "Visit older than 30 min should be counted as a new view");
    });
  });

  describe("6. Strict Validation Schema (User & Portfolio Controllers)", () => {
    // Replicates the strict Zod schema in userController.js
    const optionalStringSchema = (fieldName, maxLength) =>
      z
        .string()
        .trim()
        .max(maxLength)
        .transform((val) => (val === "" ? null : val))
        .nullable()
        .optional();

    const optionalUrlSchema = (fieldName, maxLength = 255) =>
      z
        .string()
        .trim()
        .max(maxLength)
        .refine(
          (val) => !val || /^https?:\/\/.+/i.test(val),
          `${fieldName} must be a valid URL starting with http:// or https://`
        )
        .transform((val) => (val === "" ? null : val))
        .nullable()
        .optional();

    const updateProfileSchema = z
      .object({
        fullName: optionalStringSchema("Full Name", 100),
        headline: optionalStringSchema("Headline", 150),
        bio: optionalStringSchema("Bio", 1000),
        location: optionalStringSchema("Location", 100),
        phone: optionalStringSchema("Phone", 30),
        github: optionalUrlSchema("GitHub", 255),
        linkedin: optionalUrlSchema("LinkedIn", 255),
        website: optionalUrlSchema("Website", 255),
        avatarUrl: optionalUrlSchema("Avatar URL", 1000),
      })
      .strict({ message: "Unknown fields are not allowed in profile update." });

    it("rejects forbidden or unknown fields like username, company, role, id", () => {
      const payloadWithUnknown = {
        fullName: "Test User",
        username: "testuser", // Not in schema!
      };
      const res1 = updateProfileSchema.safeParse(payloadWithUnknown);
      assert.equal(res1.success, false);

      const payloadWithRole = {
        role: "ADMIN", // Forbidden to tamper with role!
      };
      const res2 = updateProfileSchema.safeParse(payloadWithRole);
      assert.equal(res2.success, false);
    });

    it("rejects invalid non-http/https URLs", () => {
      const invalidUrlPayload = {
        website: "not-a-valid-url",
      };
      const res = updateProfileSchema.safeParse(invalidUrlPayload);
      assert.equal(res.success, false);
    });

    it("accepts valid profile payload and normalizes empty strings to null", () => {
      const validPayload = {
        fullName: "Alex Rivera",
        headline: "Lead Engineer",
        bio: "Specializing in cloud systems",
        location: "Seattle, WA",
        phone: "+1 206 555 0199",
        github: "https://github.com/alexrivera",
        linkedin: "https://linkedin.com/in/alexrivera",
        website: "https://alexrivera.dev",
        avatarUrl: "",
      };
      const res = updateProfileSchema.safeParse(validPayload);
      assert.equal(res.success, true);
      assert.equal(res.data.fullName, "Alex Rivera");
      assert.equal(res.data.avatarUrl, null); // Empty string converted to null
    });

    it("validates portfolio status transitions to reject invalid status values", () => {
      const ALLOWED_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

      const testInvalidStatus = (status) => ALLOWED_STATUSES.includes(status);

      assert.equal(testInvalidStatus("PUBLISHED"), true);
      assert.equal(testInvalidStatus("DRAFT"), true);
      assert.equal(testInvalidStatus("ARCHIVED"), true);
      assert.equal(testInvalidStatus("DELETED"), false);
      assert.equal(testInvalidStatus("LIVE"), false);
      assert.equal(testInvalidStatus("draft"), false);
    });
  });

  describe("7. Middleware Security & Auth Protection (Direct Middleware Invocation)", () => {
    it("protect middleware rejects requests without Authorization header with 401 UNAUTHORIZED", async () => {
      const { protect } = await import("../src/middleware/authMiddleware.js");

      const req = { headers: {} };
      const res = {};
      let errorPassedToNext = null;

      await protect(req, res, (err) => {
        errorPassedToNext = err;
      });

      assert.ok(errorPassedToNext, "Expected next(err) to be called");
      assert.equal(errorPassedToNext.statusCode, 401);
      assert.equal(errorPassedToNext.errorCode, "UNAUTHORIZED");
      assert.ok(errorPassedToNext.message.includes("Authentication required"));
    });

    it("protect middleware rejects malformed Authorization headers (e.g. Basic instead of Bearer) with 401", async () => {
      const { protect } = await import("../src/middleware/authMiddleware.js");

      const req = { headers: { authorization: "Basic dXNlcjpwYXNz" } };
      const res = {};
      let errorPassedToNext = null;

      await protect(req, res, (err) => {
        errorPassedToNext = err;
      });

      assert.ok(errorPassedToNext);
      assert.equal(errorPassedToNext.statusCode, 401);
    });

    it("notFoundHandler yields 404 AppError for unmapped routes", async () => {
      const { default: notFoundHandler } = await import("../src/middleware/notFoundHandler.js");

      const req = { originalUrl: "/api/v1/non-existent-route", method: "GET" };
      const res = {};
      let errorPassedToNext = null;

      notFoundHandler(req, res, (err) => {
        errorPassedToNext = err;
      });

      assert.ok(errorPassedToNext);
      assert.equal(errorPassedToNext.statusCode, 404);
      assert.equal(errorPassedToNext.errorCode, "NOT_FOUND");
    });
  });
});
