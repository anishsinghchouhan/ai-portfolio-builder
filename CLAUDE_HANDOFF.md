# CLAUDE_HANDOFF.md — AI Portfolio Builder Dashboard Handover

> **Document Status**: Production Handoff Specification  
> **Prepared For**: Claude (Incoming Senior Full-Stack Dashboard Engineer)  
> **Prepared By**: Antigravity (Outgoing AI Senior Engineer)  
> **Target Repo**: `ai-portfolio-builder`  
> **Date**: 2026-11-03  
> **Mode**: Read-Only Architecture & Runtime Audit  

---

## 1. LOCAL vs GITHUB STATE

### 1.1 Git Status & Branch Audit
- **Current Active Branch**: `second` (tracked at `origin/second`)
- **Working Tree**: Clean (`git status` reports `nothing to commit, working tree clean`)
- **Remote Tracking**: `origin` points to GitHub repository `origin/main`, `origin/second`, and `origin/cleanup/remove-unused`
- **Branches Available**:
  ```text
  Local:
    cleanup/remove-unused (51a0243)
    main (43950a6)
  * second (62fe8e9 - HEAD)

  Remote:
    origin/HEAD -> origin/main
    origin/cleanup/remove-unused
    origin/develop
    origin/main
    origin/second
  ```
- **Recommended Branch for Next Work**: Create a new working branch off `second` (which contains the summary performance fixes and deduplication):
  ```bash
  git checkout second
  git checkout -b fix/dashboard
  ```

### 1.2 Recent Commits (Top 5 on `second`)
1. `62fe8e9` (HEAD -> `second`): *Fix dashboard summary: dedupe requests, cache, indexes*
2. `51a0243` (`origin/cleanup/remove-unused`, `cleanup/remove-unused`): *single users/me call, db-safe auth middleware, cleanup*
3. `614f81e`: *unwanted files delete*
4. `43950a6` (`origin/main`, `origin/HEAD`, `main`): *service api file change code*
5. `ca9a993`: *backend changes*

### 1.3 Difference Between Local Code and GitHub `origin/main`
**Local branch `second` is 3 commits ahead of `origin/main` (`43950a6`):**

1. **`614f81e`**: Purged ~170 redundant markdown best-practice files, legacy mocks, and dead components from root/frontend (`frontend/src/mocks/mockDb.js`, unused layout wrappers).
2. **`51a0243`**:
   - `frontend/src/hooks/useAuth.js`: Fixed runaway `/users/me` network loops using singleton deduplication (`syncPromise`) and store caching.
   - `backend/src/middleware/authMiddleware.js`: Upgraded to return `503 DATABASE_ERROR` instead of `401 UNAUTHORIZED` on transient PostgreSQL disconnects, preventing destructive auth logout loops. Added in-memory 60s user cache and `P2002` race-condition handling on user provisioning.
3. **`62fe8e9`**:
   - `frontend/package.json`: Added `@tanstack/react-query` (`^5.105.3`).
   - `frontend/src/lib/queryClient.js` (NEW): Configured shared `QueryClient` with `staleTime: 60_000`, `refetchOnWindowFocus: false`.
   - `frontend/src/main.jsx`: Wrapped app with `<QueryClientProvider client={queryClient}>`.
   - `frontend/src/hooks/useSummary.js` (NEW): Consolidated all summary fetches into a single shared hook.
   - `frontend/src/hooks/useDashboardSummary.js`: Re-exported `useSummary` and connected `triggerDashboardRefresh()` to `queryClient.invalidateQueries`.
   - `backend/src/services/dashboardService.js`: Combined views and unique visitors into a single aggregation query; parallelized all database calls inside a single `Promise.all`; added 60-second in-memory TTL caching with in-flight request coalescing.
   - `backend/prisma/schema.prisma` & `backend/prisma/migrations/20261103100000_add_dashboard_summary_indexes/`: Added foreign key indexes on `resumes(userId)`, `portfolios(userId)`, `projects(portfolioId)`, and `analytics(portfolioId, visitedAt)`.

---

## 2. HOW TO RUN

### 2.1 Prerequisites
- **Node.js**: `v24.21.0` (Verified working; Node 20+ compatible)
- **NPM**: `11.19.0`
- **Operating System**: macOS / Linux

### 2.2 Startup Commands
From the repository root (`ai-portfolio-builder`):

```bash
# 1. Start Backend API Server (Port 5001)
cd backend
npm run dev
# Or for direct node start:
node server.js

# 2. Start Frontend Vite Dev Server (Port 5173)
cd ../frontend
npm run dev
```

### 2.3 Real Startup Output (Secrets Redacted)

**Backend Terminal Output:**
```text
[2026-11-03 15:41:21] info: 🚀 Server running in [development] mode on port 5001
[2026-11-03 15:41:21] info: 🔗 Health check available at http://localhost:5001/health
```

**Frontend Terminal Output:**
```text
> ai-protfolio@0.0.0 dev
> vite

  VITE v6.4.3  ready in 79 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 3. ENVIRONMENT VARIABLES AUDIT

| Variable Name | Location Read | Scope | Required / Optional | Local `.env` | Vercel | Render |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `VITE_API_URL` | `frontend/src/services/api.js` | Frontend | Required (Throws blank screen if missing) | **Set** | UNVERIFIED | N/A |
| `VITE_SUPABASE_URL` | `frontend/src/lib/supabase.js` | Frontend | Required | **Set** | UNVERIFIED | N/A |
| `VITE_SUPABASE_ANON_KEY` | `frontend/src/lib/supabase.js` | Frontend | Required | **Set** | UNVERIFIED | N/A |
| `PORT` | `backend/src/config/env.js` | Backend | Optional (defaults to 5000 / 5001) | **Set** | N/A | UNVERIFIED |
| `NODE_ENV` | `backend/src/config/env.js` | Backend | Optional (defaults to 'development') | **Set** | N/A | UNVERIFIED |
| `CORS_ORIGIN` | `backend/src/config/env.js` | Backend | Required in production, optional in dev | **Set** | N/A | UNVERIFIED |
| `DATABASE_URL` | `backend/src/config/env.js`, `schema.prisma` | Backend | **Required** (Prisma connection pooler) | **Set** | N/A | UNVERIFIED |
| `DIRECT_URL` | `backend/src/config/env.js`, `schema.prisma` | Backend | Optional (Direct connection for migrations) | **Set** | N/A | UNVERIFIED |
| `SUPABASE_URL` | `backend/src/config/env.js`, `authMiddleware.js` | Backend | **Required** | **Set** | N/A | UNVERIFIED |
| `SUPABASE_ANON_KEY` | `backend/src/config/env.js` | Backend | **Required** | **Set** | N/A | UNVERIFIED |
| `SUPABASE_SERVICE_ROLE_KEY` | `backend/src/config/env.js`, `authMiddleware.js` | Backend | **Required** | **Set** | N/A | UNVERIFIED |
| `SUPABASE_JWKS_URL` | `backend/.env.example` | Backend | Unused in code | **Set** | N/A | UNVERIFIED |
| `GEMINI_API_KEY` | `backend/src/config/env.js` | Backend | Optional (No AI routes wired up) | **Set** | N/A | UNVERIFIED |
| `ANALYTICS_SALT` | `backend/src/services/dashboardService.js:15` | Backend | Optional (falls back to hardcoded string) | **Set** | N/A | UNVERIFIED |

> [!WARNING]
> **Defect S1**: `backend/src/config/env.js` requires `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`. However, `backend/.env.example` historically listed `SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY`.

---

## 4. DATABASE

### 4.1 Prisma Migrate Status Output
Executed against Supabase PostgreSQL:
```text
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "postgres", schema "public" at "db.ppvkwqequjmmftagartz.supabase.co:5432"

3 migrations found in prisma/migrations
Following migration have not yet been applied:
20261103100000_add_dashboard_summary_indexes

To apply migrations in development run prisma migrate dev.
To apply migrations in production run prisma migrate deploy.
```

### 4.2 Database Sync Status & Location
- **Sync Status**: Database schema matches previous state; local migration `20261103100000_add_dashboard_summary_indexes` is pending deployment.
- **Local vs Production DB**: The local backend connects directly to the remote hosted Supabase PostgreSQL instance (`ppvkwqequjmmftagartz`). There is **no local Docker/Postgres container**.
- **Critical Connection Bug Found in `.env`**:
  - `DATABASE_URL` in `backend/.env` points to `aws-0-ap-southeast-2.pooler.supabase.com:6543`.
  - The database password contains an unescaped `@` character.
  - When parsed by standard URL libraries or connection poolers, it fails with `P1001: Can't reach database server at aws-0-ap-southeast-2.pooler.supabase.com:6543`.
  - `DIRECT_URL` (direct port 5432 to `db.ppvkwqequjmmftagartz.supabase.co:5432`) connects successfully. The pooler URL password must be URL-encoded (`%40`).

### 4.3 Production Table Row Counts (Real Database Query)
```json
{
  "users": 2,
  "portfolios": 0,
  "projects": 0,
  "resumes": 0,
  "analytics": 0
}
```

---

## 5. REAL API BEHAVIOR (LIVE RUNTIME AUDIT)

### 5.1 Unauthenticated Calls (No Token)

**`GET /api/v1/users/me`**:
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
```
```json
{
  "success": false,
  "statusCode": 401,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required. Please log in to get access.",
    "details": null
  },
  "timestamp": "2026-11-03T10:12:23.970Z"
}
```

**`GET /api/v1/dashboard/summary`**:
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
```
```json
{
  "success": false,
  "statusCode": 401,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required. Please log in to get access.",
    "details": null
  },
  "timestamp": "2026-11-03T10:12:23.976Z"
}
```

### 5.2 Authenticated Call for Real Test User

**`GET /api/v1/dashboard/summary`**:
```json
{
  "success": true,
  "data": {
    "counts": {
      "portfolios": 0,
      "resumes": 0,
      "projects": 0,
      "skills": 0
    },
    "analytics": {
      "views": 0,
      "downloads": 0,
      "uniqueVisitors": 0,
      "last7Days": [
        { "date": "2026-10-28", "day": "Wed", "views": 0 },
        { "date": "2026-10-29", "day": "Thu", "views": 0 },
        { "date": "2026-10-30", "day": "Fri", "views": 0 },
        { "date": "2026-10-31", "day": "Sat", "views": 0 },
        { "date": "2026-11-01", "day": "Sun", "views": 0 },
        { "date": "2026-11-02", "day": "Mon", "views": 0 },
        { "date": "2026-11-03", "day": "Tue", "views": 0 }
      ]
    },
    "primaryPortfolio": null,
    "latestResume": null,
    "profileStrength": {
      "score": 1,
      "total": 9,
      "percentage": 11,
      "filledFields": ["fullName"],
      "missingFields": [
        { "key": "headline", "label": "Headline" },
        { "key": "bio", "label": "Bio / Summary" },
        { "key": "location", "label": "Location" },
        { "key": "phone", "label": "Phone" },
        { "key": "github", "label": "GitHub Profile URL" },
        { "key": "linkedin", "label": "LinkedIn Profile URL" },
        { "key": "website", "label": "Personal Website URL" },
        { "key": "avatarUrl", "label": "Profile Picture / Avatar" }
      ]
    },
    "readiness": {
      "percent": 0,
      "completed": [],
      "missing": [
        { "key": "profile_filled", "label": "Complete your profile bio & headline", "route": "/dashboard/profile" },
        { "key": "resume_uploaded", "label": "Upload your PDF resume", "route": "/dashboard/upload" },
        { "key": "skill_added", "label": "Add at least 1 skill in your portfolio", "route": "/dashboard/builder" },
        { "key": "project_added", "label": "Add at least 1 showcase project", "route": "/dashboard/builder" },
        { "key": "theme_chosen", "label": "Select a design theme", "route": "/dashboard/themes" },
        { "key": "published", "label": "Publish your portfolio online", "route": "/dashboard/publish" }
      ]
    }
  }
}
```

### 5.3 Missing / Broken Endpoints Called by Frontend
1. `PATCH /portfolios/:id` with `{ status: "published" }` (`frontend/src/services/portfolioService.js:65`):
   - **Bug**: Sends lowercase `"published"`. `backend/src/controllers/portfolioController.js:207` expects uppercase `"PUBLISHED"`. The update is silently ignored; status remains `DRAFT`.
2. Resume Upload (`frontend/src/pages/dashboard/ResumeUploadPage.jsx:53-64`):
   - **Bug**: No backend endpoint exists (`/api/v1/resumes`). The frontend fakes an upload in local React `useState`.
3. AI Generation (`frontend/src/pages/parser/AIResumeParserPage.jsx:274`):
   - **Bug**: No backend AI route exists. Frontend simulates AI progress via `setTimeout`.

---

## 6. CURRENT DASHBOARD BEHAVIOR & WIDGET AUDIT

### 6.1 Browser Console & Network Status
- Console Errors: None on initial load.
- Network Calls: With React Query (`useSummary`), exactly 1 request to `/api/v1/dashboard/summary` is made on page load (returning 200/304).

### 6.2 Widget Audit

| Widget / Component | File Path | Status | Click Behavior | Destination | Defect / Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Welcome Banner** | `DashboardHomePage.jsx:47` | Working | None | N/A | Displays real user name from Supabase session. |
| **AI Suggestions** | `AISuggestionsPanel.jsx:6` | Partial | Click "Edit in Profile" | `/dashboard/profile` | Action button `.btn-recom-action` has **no CSS rules defined** in `AISuggestionsPanel.css`. Renders as raw HTML button. |
| **Portfolio Readiness** | `PortfolioStatusWidget.jsx:6` | Partial | Click missing check | Dynamic route | Readiness routes like `/dashboard/publish` or `/dashboard/builder` fail to navigate because the router expects `:portfolioId`. |
| **Stats Cards** | `StatsCardsSection.jsx:4` | Fake data / Partial | None | N/A | "Resume Downloads" is hardcoded to 0. "Views" is always 0 because public page views never insert rows into `analytics`. |
| **Quick Actions** | `QuickActionsSection.jsx:4` | Broken | Click card | Dynamic route | `actionRouteMap` in `DashboardHomePage.jsx:28` maps "Change Theme" to literal `/dashboard/themes/:portfolioId` and "Publish" to `/dashboard/publish/:portfolioId`. "Edit Portfolio" maps to `/dashboard` (no-op). Cards are `<div onClick>` without keyboard accessibility. |
| **Recent Activity** | `RecentActivitySection.jsx:5` | Fake data | None | N/A | Hardcoded `const activities = [];` on line 7. Always displays empty state. |
| **Sidebar Menu** | `Sidebar.jsx:36` | Partial | Click menu item | Routed path | "Portfolio" links to `/dashboard` (no portfolio listing page exists). "Billing" links to `/dashboard/settings`. Plan badge hardcoded "FREE" because `appUser?.plan` does not exist in DB schema. |
| **Header Controls** | `Header.jsx:9` | Working / Mock | Click notifications/messages | Dropdown | Notifications and messages dropdowns contain hardcoded mock items. |
| **Mobile Drawer** | `DashboardLayout.jsx:14` | Broken | N/A | N/A | `isMobileOpen = false` is hardcoded. On mobile viewports (<768px), navigation is inaccessible. |

---

## 7. FEATURE STATUS TABLE

| Feature | Status | Frontend Files | Backend Endpoints | DB Tables | Known Problems |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Signup** | Working | `pages/auth/SignupPage.jsx`, `hooks/useAuth.js` | Handled by Supabase Auth | `users` | Works cleanly. User row auto-created in Postgres on first login. |
| **Login** | Working | `pages/auth/LoginPage.jsx`, `hooks/useAuth.js` | Handled by Supabase Auth | `users` | Auth rate limited to 10 per 15 min by `authLimiter`. |
| **Email Verify** | Partial | `pages/auth/VerifyEmailPage.jsx`, `AuthCallback.jsx` | Supabase Auth callback | None | Previous issue: Confirmation emails pointed to port 3000 instead of 5173. |
| **Google Login** | UI Only / Partial | `LoginPage.jsx`, `SignupPage.jsx` | Supabase OAuth | `users` | Button exists; requires Google Client ID configured in Supabase. |
| **Password Reset** | Working | `ForgotPasswordPage.jsx`, `ResetPasswordPage.jsx` | Supabase Auth API | None | Relies on Supabase email templates. |
| **Profile Edit** | UI Only | `ProfileSettingsPage.jsx` | `GET /api/v1/users/me`, `PATCH /api/v1/users/me` | `users` | **Major Bug**: `ProfileSettingsPage.jsx` contains static "Alex Morgan" mock state; Save button triggers `alert()`; never calls `PATCH /api/v1/users/me`. |
| **Dashboard Summary** | Working | `hooks/useSummary.js`, `DashboardHomePage.jsx` | `GET /api/v1/dashboard/summary` | `users`, `portfolios`, `resumes`, `analytics` | Fixed with React Query & 60s backend caching. |
| **Portfolio CRUD** | Partial | `portfolioService.js`, `PortfolioBuilderDashboard.jsx` | `GET /portfolios`, `POST /portfolios`, `PATCH /portfolios/:id`, `DELETE /portfolios/:id` | `portfolios`, `projects` | No "Create Portfolio" CTA on dashboard; no dedicated portfolio list page. |
| **Theme Customization** | Partial | `ThemeCustomizationPage.jsx` | `PATCH /api/v1/portfolios/:id` | `portfolios` | Works if portfolio ID is provided in URL. |
| **Publish & Public Page** | Partial | `PublishPortfolioPage.jsx`, `PublicPortfolioView.jsx` | `PATCH /portfolios/:id/publish`, `GET /public/portfolios/:slug` | `portfolios`, `analytics` | `publishPortfolio` in `portfolioService.js` calls wrong route with lowercase status. Public views do not write to `analytics`. |
| **Resume Upload & Parsing** | UI Only | `ResumeUploadPage.jsx`, `AIResumeParserPage.jsx` | **NOT IMPLEMENTED** | `resumes` | Uploads are simulated in React state; no backend storage or parsing. |
| **AI Features** | NOT IMPLEMENTED | `AISuggestionsPanel.jsx` | **NOT IMPLEMENTED** | None | Suggestions are client-side rules on missing profile fields; no AI SDK called. |
| **Analytics** | Read-Only (Always 0) | `AnalyticsDashboardPage.jsx`, `StatsCardsSection.jsx` | `GET /api/v1/dashboard/summary` | `analytics` | No writes ever occur to `analytics`. |
| **Templates Marketplace** | Partial | `TemplatesMarketplacePage.jsx` | `POST /api/v1/portfolios` | `portfolios` | Creates portfolio but navigates using legacy hash `#portfolio-builder?id=...`. |
| **Billing / Plans** | UI Only | `BillingSubscriptionPage.jsx` | **NOT IMPLEMENTED** | None | No subscription schema or payment processor integration. |
| **Admin Panel** | UI Only | `AdminDashboardPage.jsx`, `routes/AdminRoute.jsx` | **NOT IMPLEMENTED** | `users` | Role check exists in `AdminRoute.jsx`, but page data is simulated. |

---

## 8. AUTHENTICATION FLOW & WEAKNESSES

### 8.1 Step-by-Step Flow
1. **Token Generation**: User signs in via Supabase client (`LoginPage.jsx` $\rightarrow$ `useAuth.js:246` $\rightarrow$ `supabase.auth.signInWithPassword`). Supabase returns a JWT access token.
2. **Client Attachment**: `frontend/src/services/api.js:21` registers an Axios request interceptor. On every outbound request, it calls `supabase.auth.getSession()` and injects `Authorization: Bearer <access_token>`.
3. **Backend Validation**: `backend/src/middleware/authMiddleware.js:40` (`protect`):
   - Extracts the Bearer token.
   - Validates the token against Supabase Auth via `supabaseAdmin.auth.getUser(token)`.
4. **User Provisioning & Caching**:
   - `authMiddleware.js` checks an in-memory `userCache` (60s TTL).
   - If not cached, it queries `prisma.user.findUnique({ where: { supabaseUserId: supabaseUser.id } })`.
   - If missing from PostgreSQL, it auto-provisions the user row with email, full name, and avatar URL.
   - Race conditions on concurrent first requests are caught by handling Prisma error `P2002`.
   - Sets `req.user = dbUser` and `req.auth = supabaseUser`.

### 8.2 Architectural Weaknesses
- **Remote Auth Latency**: Every cold token check requires an outbound HTTPS network request from the Express server to Supabase Auth (`getUser`). If Supabase has high latency or cold starts, API response time increases.
- **Unverified Metadata Sync**: Profile edits made in Postgres (`PATCH /api/v1/users/me`) do not sync back to Supabase `user_metadata` unless explicitly invoked.

---

## 9. ANTIGRAVITY COMMIT HISTORY & RISK LOG

### 9.1 What Antigravity Changed
1. **Frontend Request Deduplication (`frontend/src/hooks/useSummary.js`, `main.jsx`)**: Installed `@tanstack/react-query`, wrapped the application tree with `QueryClientProvider`, and replaced repeated summary fetches with a single cached hook (`staleTime: 60_000`, `refetchOnWindowFocus: false`).
2. **Backend Query Optimization (`backend/src/services/dashboardService.js`)**: Combined separate `count` and `groupBy` queries for analytics into a single SQL aggregation; parallelized all database reads using `Promise.all`; added an in-memory 60s cache with in-flight request coalescing.
3. **Database Performance Indexing (`backend/prisma/schema.prisma`)**: Added indexes for `resumes(userId)`, `portfolios(userId)`, `projects(portfolioId)`, and `analytics(portfolioId, visitedAt)`. Generated migration `20261103100000_add_dashboard_summary_indexes`.
4. **Auth Stability (`backend/src/middleware/authMiddleware.js`, `frontend/src/hooks/useAuth.js`)**: Stopped infinite redirect loops by returning 503 instead of 401 on transient DB connection failures; deduplicated `/users/me` calls using a singleton promise.

### 9.2 Half-Finished Work & Residual Risks
- **Pending Migration**: Migration `20261103100000_add_dashboard_summary_indexes` has **not** been run on the production database (`prisma migrate deploy` required).
- **`DATABASE_URL` Password Encoding**: `backend/.env` has an unencoded `@` in `DATABASE_URL` which prevents the Supabase pooler connection on port 6543 from connecting.
- **`ProfileSettingsPage.jsx` Disconnect**: Backend `PATCH /api/v1/users/me` is production-ready, but `ProfileSettingsPage.jsx` remains 100% hardcoded mock data.

---

## 10. OPEN QUESTIONS FOR THE OWNER

1. **Database Migration Approval**: When should `npx prisma migrate deploy` be run on the production Supabase database to apply `20261103100000_add_dashboard_summary_indexes`?
2. **Connection Pooler Fix**: May we update `DATABASE_URL` in `backend/.env` to URL-encode the password (`%40` instead of `@`) and ensure `?pgbouncer=true` is set, or switch to `DIRECT_URL`?
3. **Portfolio Creation Flow**: Should the primary "Create Portfolio" CTA open a creation modal on `/dashboard`, or route to `/templates`?
4. **Resume Upload Scope**: Should we implement real PDF upload to Supabase Storage with ATS parsing now, or label the resume upload page as "Preview / Coming Soon"?
5. **AI Integration**: Which AI features (resume parsing, summary generator, custom suggestions) should use the configured `GEMINI_API_KEY` first?
6. **Analytics Tracking Policy**: Should public hits on `GET /api/v1/public/portfolios/:slug` write directly to `analytics` with IP hashing, or do you prefer an external analytics provider (e.g. PostHog, Plausible)?
7. **Billing Integration**: Is Stripe integration planned, or should all subscription and billing links be marked "Coming Soon"?

