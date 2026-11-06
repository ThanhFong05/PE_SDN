CHECKLIST:
Project: ReadLog — Personal Reading Session Tracker & Real-time Genre Analytics

A. Setup, Architecture & Database
[SETUP-01] Next.js App Router & TypeScript Architecture
- Built with Next.js (App Router, TypeScript) exposing clean REST API Route Handlers.
- Automated client generation configured via "build": "prisma generate && next build" in package.json.
- Application builds cleanly using only three environment variables: DATABASE_URL, DIRECT_URL, and AUTH_SECRET.

[SETUP-02] UI Framework & Design System
- Styled with Tailwind CSS and ShadCN UI (components.json at project root).
- Uses multiple ShadCN components (Button, Input, Card, Label) with a custom Orange & Beige aesthetic.
- Fully responsive design: zero horizontal scrolling at mobile width (375px), two-column layout on desktop (1280px).

[DATA-01] Relational Schema Design (Prisma & Supabase Postgres)
- Uses Supabase PostgreSQL exclusively through Prisma ORM (no Supabase Auth SDK).
- Model User: id, email (unique), passwordHash (bcrypt hash, never plain text), createdAt.
- Model ReadingLog: id, userId (relation to User with CASCADE delete), bookTitle, minutesRead, genre, note, favorite, readOn, createdAt.

[DATA-02] Database Migration Integrity
- Database schema applied directly to Supabase PostgreSQL using Prisma migrations.
- prisma/migrations directory committed to the repository for reproducible deployment.

B. Authentication & Security
[AUTH-01] Custom User Registration (POST /api/auth/register)
- Users register with email, password, and confirmPassword.
- Validates required fields, valid email format, minimum 6-character password, and password confirmation match.
- Passwords are securely hashed using bcryptjs before storage.
- Returns 201 with { id, email } without automatically logging the user in.
- Re-registering an existing email returns an appropriate error message shown in error-auth.

[AUTH-02] Custom User Login (POST /api/auth/login)
- Users authenticate using their email and password.
- Sets an HttpOnly, secure cookie named session_token upon successful authentication.
- Returns 200 with { id, email }.
- Invalid credentials return 401 with exact JSON error: { "error": "Invalid email or password" }.

[AUTH-03] Session Verification & Secure Logout
- GET /api/auth/me verifies session_token via JWT (jose) and returns 200 with { id, email }, or 401 with { "error": "Unauthorized" }.
- POST /api/auth/logout clears the session_token cookie immediately; subsequent calls to /api/auth/me return 401.

[AUTH-04] Server-side Ownership Enforcement & Route Protection
- Every /api/reading-logs* route strictly requires an authenticated session (401 returned if missing or invalid).
- User ownership is strictly derived from the verified session_token, never from request body or query parameters.
- Users can only read, create, modify, or delete their own reading logs.

C. Reading Log Management (REST API & UI)
[LOG-01] Create Reading Session (POST /api/reading-logs)
- Form on /reading-logs (reading-log-form, noValidate) accepts book title, minutes read, genre, date, and optional note.
- Strict validation rules with exact error messages:
  - Book title: required / max 80 characters.
  - Minutes read: required / must be a positive integer.
  - Genre: must be one of Fiction, Non-Fiction, Sci-Fi, Biography, Other.
  - Date: required / cannot be in the future.
- Duplicate detection: Prevents duplicate sessions with the same book title, minutes read, and date for the current user (returns 409).
- Success state displays reading-log-success ("Reading session added"), clears the form, and updates the list immediately without page reload.

[LOG-02] Reading Session List (GET /api/reading-logs)
- Retrieves all sessions belonging to the logged-in user in reading-log-list.
- Primary sorting by readOn descending (most recent first); ties broken alphabetically by bookTitle (case-insensitive).
- Displays reading-logs-empty ("No reading sessions found") when no sessions match.
- Each item (reading-log-item) displays book title, minutes read, genre, date, optional note, favorite toggle, and delete button.

[LOG-03] Favorite Toggle & Inline Updates (PATCH /api/reading-logs/:id)
- Clicking the star/favorite button toggles favorite status via PATCH request immediately.
- Button accurately maintains aria-pressed="true" / "false" attributes.
- Persists across page refreshes.

[LOG-04] Immediate Session Deletion (DELETE /api/reading-logs/:id)
- Clicking Delete (btn-delete-reading-log) sends DELETE request and removes the item from the list at once without page refresh.
- Attempting to delete or update a non-existent log or a log belonging to another user returns 404 { "error": "Reading log not found" }.

D. Search, Filtering & Real-time Genre Analytics
[ANALYTICS-01] Combined Multi-criteria Filters
- Genre filter (filter-genre): Dropdown with All (empty value) and the 5 specific genres.
- Favorites filter (filter-favorite): Checkbox filtering only favorited sessions.
- Keyword search (search-input): Real-time search matching book title or note (case-insensitive, trims surrounding spaces).
- Filters combine dynamically with immediate list and summary updates on input.

[ANALYTICS-02] Instant Filter Reset
- Clear button (btn-clear-filters) resets genre, favorites-only checkbox, and search input simultaneously.

[ANALYTICS-03] Live Reading Summary Metrics
- Live metric counters update dynamically to reflect matching sessions:
  - Total sessions count: reading-log-count (plain integer).
  - Favorite sessions count: favorite-count (plain integer).
  - Total minutes read: total-minutes (plain integer).

[ANALYTICS-04] Genre Breakdown (GET /api/reading-logs/summary)
- Container genre-breakdown renders one breakdown-row per genre present in the active filtered set.
- Displays breakdown-name, breakdown-count, and breakdown-total per genre.
- Ranked by total minutes descending; equal totals ordered Fiction -> Non-Fiction -> Sci-Fi -> Biography -> Other.

E. State Management & Automated Test Compliance
[STATE-01] Shared React Context (ReadingLogContext)
- Reading sessions, filters, and summary calculations are centralized in React Context.
- Ensures synchronized state across the add form, session list, filter toolbar, and summary cards without prop drilling.
- Logging out clears in-memory state completely so subsequent logins never see previous user data.

[TEST-01] Strict Automated Grader Hook Implementation
- Exact data-testid tags implemented on all required routes (/ and header, /login, /register, /reading-logs).
- Client validation messages render only when triggered and disappear automatically when fields become valid.
- Exact error messages match the SDN302 exam specification case-sensitively.

[TEST-02] Pre-seeded Test Accounts
- Grader test account created and verified: grader.qe190030@example.com / Test1234!
- Student test account created and populated with sample reading sessions.

F. Deployment & Submission
[DEPLOY-01] Vercel Production Deployment
- Deployed on Vercel Production with Vercel Authentication disabled.
- Environment variables configured securely in Vercel: DATABASE_URL, DIRECT_URL, and AUTH_SECRET.

[DEPLOY-02] Public GitHub Repository
- Public GitHub repository: https://github.com/ThanhFong05/PE_SDN
- Contains clean source code, Prisma migrations, and .env.example (no credentials committed).
