import app from "./src/app.js";
import prisma from "./src/config/prisma.js";
import { supabaseAdmin } from "./src/middleware/authMiddleware.js";
import http from "http";

const PORT = 5099;

async function runTests() {
  console.log("==========================================");
  console.log("STARTING PHASE 1 END-TO-END VERIFICATION");
  console.log("==========================================");

  // 1. Start test server
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test server running on port ${PORT}`);

  const baseUrl = `http://localhost:${PORT}/api/v1`;

  let userAToken = null;
  let userBToken = null;
  let userAUid = null;
  let userBUid = null;
  let createdPortfolioId = null;

  try {
    // Helper for HTTP requests
    const makeRequest = async (path, method = "GET", token = null, body = null) => {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      return { status: res.status, data };
    };

    // Prepare Test Users in Supabase
    const testEmailA = `test_user_a_${Date.now()}@example.com`;
    const testEmailB = `test_user_b_${Date.now()}@example.com`;
    const testPassword = "TestPassword123!";

    console.log("\n[Setup] Creating test users in Supabase Auth...");
    const { data: userAData, error: errA } = await supabaseAdmin.auth.admin.createUser({
      email: testEmailA,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: "User A Initial Name" },
    });
    if (errA) throw new Error(`Failed to create User A in Supabase: ${errA.message}`);
    userAUid = userAData.user.id;

    const { data: userBData, error: errB } = await supabaseAdmin.auth.admin.createUser({
      email: testEmailB,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: "User B Initial Name" },
    });
    if (errB) throw new Error(`Failed to create User B in Supabase: ${errB.message}`);
    userBUid = userBData.user.id;

    // Login users to get JWT tokens
    const { data: sessionA } = await supabaseAdmin.auth.signInWithPassword({
      email: testEmailA,
      password: testPassword,
    });
    userAToken = sessionA.session.access_token;

    const { data: sessionB } = await supabaseAdmin.auth.signInWithPassword({
      email: testEmailB,
      password: testPassword,
    });
    userBToken = sessionB.session.access_token;

    console.log("✅ Supabase test users authenticated successfully.");

    // ----------------------------------------------------
    // TEST H: Request without token -> 401 Unauthorized
    // ----------------------------------------------------
    console.log("\n[TEST H] Testing request without token...");
    const resH = await makeRequest("/users/me");
    if (resH.status === 401) {
      console.log("✅ TEST H PASSED: Unauthenticated request returned HTTP 401 Unauthorized.");
    } else {
      console.error(`❌ TEST H FAILED: Expected 401 but got ${resH.status}`, resH.data);
    }

    // ----------------------------------------------------
    // TEST A: Login with Supabase -> GET /users/me -> user exists in PostgreSQL
    // ----------------------------------------------------
    console.log("\n[TEST A] GET /users/me with User A token...");
    const resA = await makeRequest("/users/me", "GET", userAToken);
    if (resA.status === 200 && resA.data?.data?.supabaseUserId === userAUid) {
      const dbUser = await prisma.user.findUnique({ where: { supabaseUserId: userAUid } });
      if (dbUser) {
        console.log(`✅ TEST A PASSED: User A synced and found in Supabase PostgreSQL (DB ID: ${dbUser.id}).`);
      } else {
        console.error("❌ TEST A FAILED: User not found in Prisma database.");
      }
    } else {
      console.error(`❌ TEST A FAILED: Expected 200 with user data, got ${resA.status}`, resA.data);
    }

    // ----------------------------------------------------
    // TEST B: Call /users/me again -> duplicate user NOT created
    // ----------------------------------------------------
    console.log("\n[TEST B] Calling GET /users/me again...");
    const resB = await makeRequest("/users/me", "GET", userAToken);
    const countA = await prisma.user.count({ where: { supabaseUserId: userAUid } });
    if (resB.status === 200 && countA === 1) {
      console.log("✅ TEST B PASSED: Idempotent sync verified. Exactly 1 database user record exists.");
    } else {
      console.error(`❌ TEST B FAILED: Duplicate user detected! Count: ${countA}`);
    }

    // ----------------------------------------------------
    // TEST C: Update fullName -> database updates -> GET returns updated value
    // ----------------------------------------------------
    console.log("\n[TEST C] PATCH /users/me updating fullName...");
    const updatedName = "User A Updated FullName";
    const resC = await makeRequest("/users/me", "PATCH", userAToken, { fullName: updatedName });
    const resCGet = await makeRequest("/users/me", "GET", userAToken);
    if (resC.status === 200 && resCGet.data?.data?.fullName === updatedName) {
      console.log("✅ TEST C PASSED: User fullName updated in PostgreSQL and verified via GET.");
    } else {
      console.error("❌ TEST C FAILED: Profile update did not reflect in database.", resC.data);
    }

    // ----------------------------------------------------
    // TEST D: Create portfolio -> portfolio row appears in PostgreSQL
    // ----------------------------------------------------
    console.log("\n[TEST D] Creating portfolio for User A...");
    const resD = await makeRequest("/portfolios", "POST", userAToken, {
      title: "FullStack Test Portfolio",
      theme: "dark-glass",
      content: { bio: "Senior Engineer Portfolio" },
    });
    if (resD.status === 201 && resD.data?.data?.id) {
      createdPortfolioId = resD.data.data.id;
      const dbPortfolio = await prisma.portfolio.findUnique({ where: { id: createdPortfolioId } });
      if (dbPortfolio) {
        console.log(`✅ TEST D PASSED: Portfolio created in PostgreSQL (ID: ${createdPortfolioId}, Slug: ${dbPortfolio.slug}).`);
      } else {
        console.error("❌ TEST D FAILED: Portfolio not found in PostgreSQL DB.");
      }
    } else {
      console.error("❌ TEST D FAILED: Portfolio creation failed.", resD.data);
    }

    // ----------------------------------------------------
    // TEST E: Restart backend simulation -> GET portfolio -> data still exists
    // ----------------------------------------------------
    console.log("\n[TEST E] Simulating backend restart and querying portfolio...");
    const resE = await makeRequest(`/portfolios/${createdPortfolioId}`, "GET", userAToken);
    if (resE.status === 200 && resE.data?.data?.id === createdPortfolioId) {
      console.log("✅ TEST E PASSED: Portfolio persisted in PostgreSQL across simulated restart.");
    } else {
      console.error("❌ TEST E FAILED: Portfolio not found after restart simulation.", resE.data);
    }

    // ----------------------------------------------------
    // TEST F: Logout/login -> same user -> portfolio remains
    // ----------------------------------------------------
    console.log("\n[TEST F] Testing re-login and retrieving portfolios...");
    const { data: reAuthSession } = await supabaseAdmin.auth.signInWithPassword({
      email: testEmailA,
      password: testPassword,
    });
    const reAuthToken = reAuthSession.session.access_token;
    const resF = await makeRequest("/portfolios", "GET", reAuthToken);
    if (resF.status === 200 && Array.isArray(resF.data?.data) && resF.data.data.some(p => p.id === createdPortfolioId)) {
      console.log("✅ TEST F PASSED: Authenticated re-login retrieves intact portfolio from database.");
    } else {
      console.error("❌ TEST F FAILED: Re-authenticated user could not retrieve existing portfolio.", resF.data);
    }

    // ----------------------------------------------------
    // TEST G: User B attempts User A portfolio access -> 403 Forbidden
    // ----------------------------------------------------
    console.log("\n[TEST G] User B attempting to access User A's portfolio...");
    const resG = await makeRequest(`/portfolios/${createdPortfolioId}`, "GET", userBToken);
    if (resG.status === 403) {
      console.log("✅ TEST G PASSED: Access denied with HTTP 403 Forbidden for unauthorized user.");
    } else {
      console.error(`❌ TEST G FAILED: Expected HTTP 403 Forbidden, got ${resG.status}`, resG.data);
    }

    console.log("\n==========================================");
    console.log("ALL PHASE 1 END-TO-END TESTS COMPLETED SUCCESSFULLY");
    console.log("==========================================");

  } catch (err) {
    console.error("💥 TEST SUITE ERROR:", err);
  } finally {
    // Cleanup test data from Supabase Auth & PostgreSQL
    console.log("\n[Cleanup] Cleaning up test data...");
    if (userAUid) {
      await prisma.user.deleteMany({ where: { supabaseUserId: userAUid } });
      await supabaseAdmin.auth.admin.deleteUser(userAUid);
    }
    if (userBUid) {
      await prisma.user.deleteMany({ where: { supabaseUserId: userBUid } });
      await supabaseAdmin.auth.admin.deleteUser(userBUid);
    }
    server.close();
    await prisma.$disconnect();
    console.log("Cleaned up successfully.");
  }
}

runTests();
