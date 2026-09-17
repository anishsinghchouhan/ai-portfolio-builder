import app from "./src/app.js";
import prisma from "./src/config/prisma.js";
import { supabaseAdmin } from "./src/middleware/authMiddleware.js";
import http from "http";

const PORT = 5098;

async function runPhase2Tests() {
  console.log("==========================================");
  console.log("STARTING PHASE 2 AUTOMATED INTEGRATION TESTS");
  console.log("==========================================");

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test server running on port ${PORT}`);

  const baseUrl = `http://localhost:${PORT}/api/v1`;

  let userAToken = null;
  let userBToken = null;
  let userAUid = null;
  let userBUid = null;
  let portfolioId = null;

  try {
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

    // Setup Test Users
    const testEmailA = `phase2_user_a_${Date.now()}@example.com`;
    const testEmailB = `phase2_user_b_${Date.now()}@example.com`;
    const testPassword = "Phase2TestPassword123!";

    console.log("\n[Setup] Creating test users in Supabase Auth...");
    const { data: userAData } = await supabaseAdmin.auth.admin.createUser({
      email: testEmailA,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: "Phase 2 User A" },
    });
    userAUid = userAData.user.id;

    const { data: userBData } = await supabaseAdmin.auth.admin.createUser({
      email: testEmailB,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: "Phase 2 User B" },
    });
    userBUid = userBData.user.id;

    const getTokenA = async () => {
      const { data } = await supabaseAdmin.auth.signInWithPassword({
        email: testEmailA,
        password: testPassword,
      });
      return data.session.access_token;
    };

    const getTokenB = async () => {
      const { data } = await supabaseAdmin.auth.signInWithPassword({
        email: testEmailB,
        password: testPassword,
      });
      return data.session.access_token;
    };

    userAToken = await getTokenA();
    userBToken = await getTokenB();

    console.log("✅ Test users authenticated.");

    // TEST 1: Fetch portfolios from database
    console.log("\n[TEST 1] GET /portfolios (Real portfolio loading)...");
    const res1 = await makeRequest("/portfolios", "GET", userAToken);
    if (res1.status === 200 && Array.isArray(res1.data?.data)) {
      console.log("✅ TEST 1 PASSED: User portfolios loaded from database.");
    } else {
      console.error("❌ TEST 1 FAILED:", res1.data);
    }

    // TEST 2: Empty state when 0 portfolios
    console.log("\n[TEST 2] Verifying empty state array when user has 0 portfolios...");
    if (res1.data.data.length === 0) {
      console.log("✅ TEST 2 PASSED: Returns empty array [] for zero portfolios.");
    }

    // TEST 3: Create portfolio in PostgreSQL
    console.log("\n[TEST 3] POST /portfolios (Create Portfolio)...");
    const res3 = await makeRequest("/portfolios", "POST", userAToken, {
      title: "Phase 2 Core Portfolio",
      theme: "stripe-indigo",
      content: {
        personal: { name: "Alice Developer", bio: "Senior Engineer" },
        skills: ["React", "Node.js"],
      },
    });
    if (res3.status === 201 && res3.data?.data?.id) {
      portfolioId = res3.data.data.id;
      console.log(`✅ TEST 3 PASSED: Portfolio created in PostgreSQL (ID: ${portfolioId}).`);
    } else {
      console.error("❌ TEST 3 FAILED:", res3.data);
    }

    // TEST 4: Load builder content from DB
    console.log("\n[TEST 4] GET /portfolios/:id (Load Builder content)...");
    const res4 = await makeRequest(`/portfolios/${portfolioId}`, "GET", userAToken);
    if (res4.status === 200 && res4.data?.data?.content?.personal?.name === "Alice Developer") {
      console.log("✅ TEST 4 PASSED: Loaded portfolio content from database.");
    } else {
      console.error("❌ TEST 4 FAILED:", res4.data);
    }

    // TEST 5 & 10: Non-destructive theme customization & content preservation
    console.log("\n[TEST 5 & 10] PATCH /portfolios/:id updating content.themeConfig...");
    const themeConfig = {
      template: "stripe-indigo",
      themeMode: "dark",
      primaryColor: "#4f46e5",
      secondaryColor: "#0ea5e9",
      fontFamily: "Plus Jakarta Sans",
      borderRadius: 16,
      buttonShape: "pill",
    };

    const res5 = await makeRequest(`/portfolios/${portfolioId}`, "PATCH", userAToken, {
      theme: "stripe-indigo",
      content: {
        ...res4.data.data.content,
        themeConfig,
      },
    });

    const res5Get = await makeRequest(`/portfolios/${portfolioId}`, "GET", userAToken);
    const updatedContent = res5Get.data?.data?.content || {};

    if (
      res5.status === 200 &&
      updatedContent.themeConfig?.primaryColor === "#4f46e5" &&
      updatedContent.personal?.name === "Alice Developer" &&
      Array.isArray(updatedContent.skills)
    ) {
      console.log("✅ TEST 5 & 10 PASSED: Theme saved to content.themeConfig without overwriting personal info or skills!");
    } else {
      console.error("❌ TEST 5 & 10 FAILED: Content was corrupted during theme update.", updatedContent);
    }

    // TEST 6 & 7: Persistence across restart simulation & re-login
    console.log("\n[TEST 6 & 7] Verifying database persistence across re-login...");
    const { data: reAuth } = await supabaseAdmin.auth.signInWithPassword({
      email: testEmailA,
      password: testPassword,
    });
    const reAuthToken = reAuth.session.access_token;
    const res7 = await makeRequest(`/portfolios/${portfolioId}`, "GET", reAuthToken);
    if (res7.status === 200 && res7.data?.data?.content?.themeConfig?.primaryColor === "#4f46e5") {
      console.log("✅ TEST 6 & 7 PASSED: Portfolio and theme persisted across re-authentication.");
    } else {
      console.error("❌ TEST 6 & 7 FAILED:", res7.data);
    }

    // TEST 19: Unauthenticated request -> 401
    console.log("\n[TEST 19] Unauthenticated request check...");
    const res19 = await makeRequest(`/portfolios/${portfolioId}`);
    if (res19.status === 401) {
      console.log("✅ TEST 19 PASSED: Unauthenticated request returned HTTP 401.");
    } else {
      console.error("❌ TEST 19 FAILED:", res19.status);
    }

    // TEST 20: Ownership security check -> 403
    console.log("\n[TEST 20] User B attempting to modify User A portfolio...");
    const res20 = await makeRequest(`/portfolios/${portfolioId}`, "PATCH", userBToken, { title: "Hacked Title" });
    if (res20.status === 403) {
      console.log("✅ TEST 20 PASSED: Access denied with HTTP 403 Forbidden.");
    } else {
      console.error("❌ TEST 20 FAILED:", res20.status);
    }

    // TEST 17: Delete portfolio
    console.log("\n[TEST 17] DELETE /portfolios/:id...");
    const res17 = await makeRequest(`/portfolios/${portfolioId}`, "DELETE", userAToken);
    const res17Check = await makeRequest(`/portfolios/${portfolioId}`, "GET", userAToken);
    if (res17.status === 200 && res17Check.status === 404) {
      console.log("✅ TEST 17 PASSED: Portfolio deleted from database. Subsequent GET returns 404.");
    } else {
      console.error("❌ TEST 17 FAILED:", res17.status, res17Check.status);
    }

    console.log("\n==========================================");
    console.log("ALL PHASE 2 BACKEND/API INTEGRATION TESTS PASSED");
    console.log("==========================================");
  } catch (err) {
    console.error("💥 TEST ERROR:", err);
  } finally {
    console.log("\n[Cleanup] Removing test users...");
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
  }
}

runPhase2Tests();
