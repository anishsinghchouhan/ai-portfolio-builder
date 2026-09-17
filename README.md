# AI Portfolio Builder (React 19 + Express + Prisma + Supabase)

An enterprise-grade Full-Stack Web Application for generating, customizing, and publishing AI-driven portfolios from uploaded resumes.

---

## 🏗️ Architecture Overview

```text
React 19 + Vite (Frontend)
   │
   ├── Supabase Auth (Sign Up, Sign In, Sign Out, Google OAuth, Password Reset)
   │
   ▼
Express.js REST API (/api/v1)
   │
   ├── Verifies Supabase JWT Token
   ├── Express Authorization & Ownership Checks
   │
   ▼
Prisma ORM
   │
   ▼
Supabase PostgreSQL Database
```

---

## 🛠️ Supabase Dashboard Setup Instructions

1. **Create a Supabase Project**:
   * Go to [Supabase Dashboard](https://database.new) and create a new project.
2. **Configure Authentication**:
   * Under **Authentication -> Providers**, enable **Email** (with Email Confirmation enabled) and **Google OAuth**.
   * Under **Authentication -> URL Configuration**, set Site URL to `http://localhost:5173` and add Redirect URLs:
     * `http://localhost:5173/#login`
     * `http://localhost:5173/#dashboard`
     * `http://localhost:5173/#reset-password`
3. **Obtain API Keys & Database Connection Strings**:
   * Go to **Project Settings -> API**: Copy `Project URL`, `anon public key`, and `service_role key`.
   * Go to **Project Settings -> Database**: Copy the Connection String (URI) for both **Transaction Pooler (Port 6543)** and **Direct Connection (Port 5432)**.

---

## ⚙️ Environment Variables Setup

### 1. Root `.env` (Frontend)
Create `.env` in project root:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Backend `backend/.env`
Create `.env` in `backend/` directory:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# PostgreSQL Connection Strings
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# Supabase Credentials
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

---

## 🚀 Development Quickstart Commands

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 2. Run Database Migrations
```bash
cd backend
npx prisma db push
npx prisma generate
```

### 3. Start Backend Server
```bash
cd backend
npm run dev
# Running on http://localhost:5000 (Health check: http://localhost:5000/health)
```

### 4. Start Frontend Client
```bash
# In project root
npm run dev
# Running on http://localhost:5173
```

---

## 🧪 Verification & Testing Checklist

- [x] **Sign Up**: Submit registration with Full Name, Email, Password. Check for verification link prompt.
- [x] **Email Verification**: Confirm email via Supabase Auth email link.
- [x] **Login**: Sign in with credentials $\rightarrow$ Redirects to `/#dashboard`.
- [x] **Google OAuth**: Click "Continue with Google" $\rightarrow$ Handled via Supabase OAuth.
- [x] **Forgot / Reset Password**: Request reset $\rightarrow$ Set new password.
- [x] **Protected API Authorization**: Requests to `/api/v1/portfolios` send `Authorization: Bearer <token>` and verify user ownership.
- [x] **Public Portfolios**: Unauthenticated access to `/api/v1/public/portfolios/:slug` only returns published portfolios.
