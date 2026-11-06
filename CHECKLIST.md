# SDN302 Practical Exam - Comprehensive Verification Checklist (ReadLog)

**Student Code:** `QE190030`  
**Subject:** SDN302 (Practical Exam - Fall 2026)  
**Project:** ReadLog  
**Repository:** [https://github.com/ThanhFong05/PE_SDN](https://github.com/ThanhFong05/PE_SDN)  
**Test Account:** `grader.qe190030@example.com` / `Test1234!`

---

## A. Setup, Architecture & Database

- [x] **A.1 Framework & Language:** Next.js App Router with TypeScript.
- [x] **A.2 Styling & Components:** Tailwind CSS & ShadCN UI initialized (`components.json` at root; `Button`, `Input`, `Card`, `Label` actively used).
- [x] **A.3 Theme Requirements:** Refined Orange & Beige warm editorial palette applied across all pages.
- [x] **A.4 Zero Hardcoded Secrets:** Connection strings and secret keys are never hardcoded in the codebase.
- [x] **A.5 Exactly Three Environment Variables:**
  - `DATABASE_URL` (Supabase connection pooler, port 6543)
  - `DIRECT_URL` (Supabase direct connection, port 5432)
  - `AUTH_SECRET` (JWT signing secret key)
- [x] **A.6 Automated Build Generation:** `package.json` build script runs `"build": "prisma generate && next build"` and `"postinstall": "prisma generate"`. Builds cleanly on fresh clone.
- [x] **A.7 Prisma Schema (`prisma/schema.prisma`):**
  - `User`: `id` (String), `email` (String @unique), `passwordHash` (String), `createdAt` (DateTime), `logs ReadingLog[]`.
  - `ReadingLog`: `id` (String), `userId` (String), `bookTitle` (String), `minutesRead` (Int), `genre` (String), `note` (String @default("")), `favorite` (Boolean @default(false)), `readOn` (DateTime @db.Date), `createdAt` (DateTime), `@@index([userId, readOn])`.
- [x] **A.8 Database Migrations:** Migration `20261106124500_init` applied to live Supabase PostgreSQL and committed under `prisma/migrations/`.
- [x] **A.9 Clean Env Template:** `.env.example` committed with empty values; `.env` excluded via `.gitignore`.

---

## B. Authentication & Security

- [x] **B.1 Custom Auth Implementation:** Custom JWT authentication using `jose` and `bcryptjs` (no NextAuth.js or Supabase Auth).
- [x] **B.2 Session Cookie:** HttpOnly cookie named exactly `session_token` with `sameSite: 'lax'`, `path: '/'`, and `secure` in production.
- [x] **B.3 Register API (`POST /api/auth/register`):**
  - Accepts `{ email, password, confirmPassword }`.
  - Validates email format, password >= 6 characters, confirmPassword match.
  - Hashes password with bcrypt (`passwordHash`).
  - Returns status `201` with `{ id, email }`.
  - **Does NOT log the user in** (no cookie set on register).
  - Duplicate email returns `409` with descriptive error.
- [x] **B.4 Login API (`POST /api/auth/login`):**
  - Accepts `{ email, password }`.
  - On failure: returns `401` with exact JSON `{ "error": "Invalid email or password" }` and sets no cookie.
  - On success: sets `session_token` cookie and returns `200` with `{ id, email }`.
- [x] **B.5 Logout API (`POST /api/auth/logout`):**
  - Clears `session_token` cookie (maxAge: 0) and returns `200`. Subsequent `GET /api/auth/me` returns `401`.
- [x] **B.6 Me API (`GET /api/auth/me`):**
  - Returns `200` with `{ id, email }` when authenticated.
  - Returns `401` with `{ "error": "Unauthorized" }` when cookie is missing or invalid.
- [x] **B.7 Route Protection & Security:**
  - Every `/api/reading-logs*` route requires an active session, returning `401` without touching the database.
  - The server always derives the owner from the session token, strictly ignoring any `userId` or `ownerId` in request bodies.
  - Cross-user authorization: attempting to access, update, or delete another user's item returns `404 { "error": "Reading log not found" }` (never 403, preventing resource enumeration).
  - All database queries use Prisma query builder methods (no raw SQL string concatenation).

---

## C. Reading Log Management (REST API & UI)

- [x] **C.1 Output Serialization:**
  - Every reading log matches the exact JSON shape: `{ id, bookTitle, minutesRead, genre, note, favorite, readOn: "YYYY-MM-DD", createdAt: "ISO" }`.
- [x] **C.2 Error Response Format:**
  - Every error response uses the shape `{ "error": "<exact message>" }`.
- [x] **C.3 Create Log API (`POST /api/reading-logs`):**
  - Evaluates validations in strict order:
    1. `bookTitle`: empty -> `"Book title is required"`, > 80 chars -> `"Book title must be at most 80 characters"`.
    2. `minutesRead`: missing -> `"Minutes read is required"`, <= 0 or non-integer -> `"Minutes read must be a positive number"`.
    3. `genre`: missing -> `"Please choose a genre"`, invalid -> `"Invalid genre"`.
    4. `readOn`: missing -> `"Date is required"`, future date -> `"Date cannot be in the future"`.
  - Duplicate check: same user, book title (case-insensitive), minutes, and date -> returns `409` with `{ "error": "Duplicate reading session: a reading session with the same book title, minutes and date already exists" }`.
  - On success: returns `201` with serialized session.
- [x] **C.4 List Logs API (`GET /api/reading-logs`):**
  - Returns only current user's sessions.
  - Ordered by `readOn` descending (most recent first); ties broken by `bookTitle` alphabetically, case-insensitive.
- [x] **C.5 Update & Toggle Favorite (`PATCH /api/reading-logs/:id`):**
  - Validates only fields provided; checks duplicates if title, minutes, or date are changed.
  - Missing or other user's session returns `404 { "error": "Reading log not found" }`.
  - Returns `200` with updated session.
- [x] **C.6 Delete API (`DELETE /api/reading-logs/:id`):**
  - Deletes user's session and returns `200 { "success": true }`.
  - Missing or other user's session returns `404 { "error": "Reading log not found" }`.
- [x] **C.7 Add Session Form UI (`reading-log-form`, `noValidate`):**
  - Inputs: `input-book-title`, `input-minutes`, `input-genre` (first choice `"Choose genre"` with empty value), `input-note`, `input-date`.
  - Submit: `btn-add-reading-log`.
  - Error messages: `error-book-title`, `error-minutes`, `error-genre`, `error-date`, `error-reading-log`.
  - Success message: `reading-log-success` with text `"Reading session added"`.
  - Session immediately appears in list without page reload; form fields cleared.
- [x] **C.8 Session List UI (`reading-log-list`):**
  - Each item: `reading-log-item`.
  - Displays: `reading-log-title`, `reading-log-minutes`, `reading-log-genre`, `reading-log-date`.
  - Favorite button: `btn-toggle-favorite` with dynamic `aria-pressed="true"` or `"false"`.
  - Delete button: `btn-delete-reading-log`.
  - Empty state: displays `reading-logs-empty` with text `"No reading sessions found"` when list is empty.

---

## D. Search, Filtering & Real-time Genre Analytics

- [x] **D.1 Filter Controls UI:**
  - Genre filter select: `filter-genre` (empty value = All, then 5 genres).
  - Favorites checkbox: `filter-favorite`.
  - Search box: `search-input` (case-insensitive keyword search matching `bookTitle` or `note`, surrounding spaces ignored).
  - Clear button: `btn-clear-filters` (resets all three filters).
- [x] **D.2 Combined Filtering:**
  - Filters combine together via `AND` logic.
  - Triggers immediate refetch of logs and summary without needing a submit button.
  - Un-favoriting an item while `filter-favorite` is active immediately removes it from the screen.
- [x] **D.3 Summary API (`GET /api/reading-logs/summary`):**
  - Computes counts over filtered matching set: `count`, `favoriteCount`, `totalMinutes`, `breakdown`.
  - Breakdown lists only genres present in matching set, ordered by `total` minutes descending; equal totals ordered: `Fiction` -> `Non-Fiction` -> `Sci-Fi` -> `Biography` -> `Other`.
  - When nothing matches: returns `{ count: 0, favoriteCount: 0, totalMinutes: 0, breakdown: [] }`.
- [x] **D.4 Summary UI:**
  - `reading-log-count` (plain integer).
  - `favorite-count` (plain integer).
  - `total-minutes` (plain integer).
  - `genre-breakdown` (container).
  - Each genre row: `breakdown-row` containing:
    - `breakdown-name`
    - `breakdown-count` (plain integer)
    - `breakdown-total` (plain integer)

---

## E. State Management & Automated Test Compliance

- [x] **E.1 Shared Context Architecture:**
  - `AuthContext`: handles user session, loading state, login, register, and logout.
  - `ReadingLogsContext`: single source of truth for logs, summary, filters, and mutations across Form, List, Filters, and Summary.
- [x] **E.2 Session Isolation (Section 2.6):**
  - On user change or logout, session logs in memory immediately reset to `[]`, preventing data leaks between consecutive users.
- [x] **E.3 Protected Route Guard (`/reading-logs`):**
  - Unauthenticated visitors immediately redirected to `/login`.
  - Displays `null` while verifying session to prevent content flash or false redirects.
  - Main container has `data-testid="reading-logs-page"`.
- [x] **E.4 Strict DOM Rendering Rules:**
  - **Conditional Rendering:** Error elements (`error-email`, `error-password`, `error-book-title`, etc.) and success elements (`form-success`, `reading-log-success`) are **only rendered in the DOM when a message exists**. No empty elements exist in the DOM.
  - Forms use `noValidate` to suppress browser default popups.
- [x] **E.5 Responsive Layout (Section 2.7):**
  - 375px mobile view: completely fluid without horizontal scrolling (`break-words`, `min-w-0`).
  - 1280px desktop view: two-column layout with Form & Summary on the left and List on the right.
- [x] **E.6 Header Navigation Test Hooks:**
  - Logged out: `btn-login`, `btn-register`.
  - Logged in: `user-email`, `link-reading-logs`, `btn-logout`.
- [x] **E.7 Home Page Test Hooks:**
  - Title element: `data-testid="home-title"` with exact text `"ReadLog"`.
  - Contains at least 3 feature cards ("Log every session", "Sort by genre", "See minutes read").
- [x] **E.8 Automated Test Suite:**
  - Comprehensive automated test script (`scripts/test-exam-suite.mjs`) ran and passed **50/50 test cases**.

---

## F. Deployment & Submission

- [x] **F.1 Public GitHub Repository:**
  - Clean repository with all commits pushed to branch `main`: [https://github.com/ThanhFong05/PE_SDN](https://github.com/ThanhFong05/PE_SDN).
- [x] **F.2 Vercel Configuration:**
  - Project imported on Vercel from GitHub repository.
  - Exactly 3 Environment Variables configured: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`.
  - "Vercel Authentication" disabled under Settings -> Deployment Protection.
- [x] **F.3 Pre-registered Grader Account:**
  - Created through the application's register API (never through Supabase Auth dashboard):
    - **Email:** `grader.qe190030@example.com`
    - **Password:** `Test1234!`
  - Verified active and can log in successfully.
- [x] **F.4 Word Document (`QE190030.docx`):**
  - Real Word document (.docx) created in the root folder with exact template text:
    ```text
    Student Code: QE190030
    Full Name: Le Thanh Phong
    GitHub Repository URL: https://github.com/ThanhFong05/PE_SDN
    Vercel Production URL: https://pe-sdn.vercel.app
    Test account email: grader.qe190030@example.com
    Test account password: Test1234!
    ```
- [x] **F.5 Submission Archive (`QE190030.zip`):**
  - `package.json` at root level of zip.
  - Contains `package-lock.json`, `tsconfig.json`, `next.config.ts`, `components.json`, `.env.example`, `prisma/schema.prisma`, `prisma/migrations/`, `src/`, `public/`.
  - Excludes `node_modules`, `.next`, `.git`, and any `.env` with actual credentials.
- [x] **F.6 Independent Build Verification:**
  - Verified `npm run build` runs `prisma generate && next build` and compiles with 0 errors.
