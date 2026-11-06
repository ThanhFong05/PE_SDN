const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🚀 Starting SDN302 Exam Automated Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAILED: ${message}`);
      failed++;
    }
  }

  // 1. Auth Register Tests
  console.log('--- 1. Testing POST /api/auth/register ---');
  const regUser = `test_${Date.now()}@example.com`;
  
  // Validation errors
  const r1 = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: '', password: 'password', confirmPassword: 'password' }),
  });
  assert(r1.status === 400, 'Empty email returns 400');

  const r2 = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bademail', password: 'password', confirmPassword: 'password' }),
  });
  assert(r2.status === 400, 'Invalid email format returns 400');

  const r3 = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: regUser, password: '123', confirmPassword: '123' }),
  });
  assert(r3.status === 400, 'Password < 6 chars returns 400');

  const r4 = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: regUser, password: 'password123', confirmPassword: 'different' }),
  });
  assert(r4.status === 400, 'Password mismatch returns 400');

  // Valid registration
  const r5 = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: regUser, password: 'password123', confirmPassword: 'password123' }),
  });
  assert(r5.status === 201, 'Valid register returns 201');
  const r5Data = await r5.json();
  assert(r5Data.email === regUser && typeof r5Data.id === 'string', 'Register returns { id, email }');
  assert(!r5.headers.get('set-cookie'), 'Register does NOT set cookie');

  // Duplicate email
  const r6 = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: regUser, password: 'password123', confirmPassword: 'password123' }),
  });
  assert(r6.status === 409, 'Duplicate register returns 409');

  // 2. Auth Login Tests
  console.log('\n--- 2. Testing POST /api/auth/login ---');
  const l1 = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: regUser, password: 'wrongpassword' }),
  });
  assert(l1.status === 401, 'Wrong password returns 401');
  const l1Data = await l1.json();
  assert(l1Data.error === 'Invalid email or password', 'Error message matches exactly "Invalid email or password"');

  const l2 = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: regUser, password: 'password123' }),
  });
  assert(l2.status === 200, 'Valid login returns 200');
  const setCookieHeader = l2.headers.get('set-cookie');
  assert(setCookieHeader && setCookieHeader.includes('session_token'), 'Login sets session_token cookie');
  const cookieMatch = setCookieHeader?.split(';')[0];

  // 3. GET /api/auth/me
  console.log('\n--- 3. Testing GET /api/auth/me ---');
  const meUnauthorized = await fetch(`${BASE_URL}/api/auth/me`);
  assert(meUnauthorized.status === 401, 'GET /api/auth/me without cookie returns 401');

  const meAuthorized = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: cookieMatch || '' },
  });
  assert(meAuthorized.status === 200, 'GET /api/auth/me with cookie returns 200');
  const meData = await meAuthorized.json();
  assert(meData.email === regUser, 'GET /api/auth/me returns current user');

  // 4. POST /api/reading-logs
  console.log('\n--- 4. Testing POST /api/reading-logs ---');
  const pNoAuth = await fetch(`${BASE_URL}/api/reading-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookTitle: 'Test', minutesRead: 30, genre: 'Fiction', readOn: '2026-10-20' }),
  });
  assert(pNoAuth.status === 401, 'POST without auth returns 401');

  // Test validations with exact error messages
  const errEmptyTitle = await fetch(`${BASE_URL}/api/reading-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieMatch || '' },
    body: JSON.stringify({ bookTitle: '', minutesRead: 30, genre: 'Fiction', readOn: '2026-10-20' }),
  });
  const errEmptyTitleData = await errEmptyTitle.json();
  assert(errEmptyTitle.status === 400 && errEmptyTitleData.error === 'Book title is required', 'Validates empty book title');

  const errLongTitle = await fetch(`${BASE_URL}/api/reading-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieMatch || '' },
    body: JSON.stringify({ bookTitle: 'A'.repeat(81), minutesRead: 30, genre: 'Fiction', readOn: '2026-10-20' }),
  });
  const errLongTitleData = await errLongTitle.json();
  assert(errLongTitle.status === 400 && errLongTitleData.error === 'Book title must be at most 80 characters', 'Validates > 80 chars title');

  const errNoMinutes = await fetch(`${BASE_URL}/api/reading-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieMatch || '' },
    body: JSON.stringify({ bookTitle: 'Book', minutesRead: '', genre: 'Fiction', readOn: '2026-10-20' }),
  });
  const errNoMinutesData = await errNoMinutes.json();
  assert(errNoMinutes.status === 400 && errNoMinutesData.error === 'Minutes read is required', 'Validates empty minutes');

  const errNegMinutes = await fetch(`${BASE_URL}/api/reading-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieMatch || '' },
    body: JSON.stringify({ bookTitle: 'Book', minutesRead: -10, genre: 'Fiction', readOn: '2026-10-20' }),
  });
  const errNegMinutesData = await errNegMinutes.json();
  assert(errNegMinutes.status === 400 && errNegMinutesData.error === 'Minutes read must be a positive number', 'Validates negative minutes');

  const errNoGenre = await fetch(`${BASE_URL}/api/reading-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieMatch || '' },
    body: JSON.stringify({ bookTitle: 'Book', minutesRead: 30, genre: '', readOn: '2026-10-20' }),
  });
  const errNoGenreData = await errNoGenre.json();
  assert(errNoGenre.status === 400 && errNoGenreData.error === 'Please choose a genre', 'Validates unchosen genre');

  const errBadGenre = await fetch(`${BASE_URL}/api/reading-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieMatch || '' },
    body: JSON.stringify({ bookTitle: 'Book', minutesRead: 30, genre: 'Fantasy', readOn: '2026-10-20' }),
  });
  const errBadGenreData = await errBadGenre.json();
  assert(errBadGenre.status === 400 && errBadGenreData.error === 'Invalid genre', 'Validates invalid genre');

  const errNoDate = await fetch(`${BASE_URL}/api/reading-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieMatch || '' },
    body: JSON.stringify({ bookTitle: 'Book', minutesRead: 30, genre: 'Fiction', readOn: '' }),
  });
  const errNoDateData = await errNoDate.json();
  assert(errNoDate.status === 400 && errNoDateData.error === 'Date is required', 'Validates missing date');

  const errFutureDate = await fetch(`${BASE_URL}/api/reading-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieMatch || '' },
    body: JSON.stringify({ bookTitle: 'Book', minutesRead: 30, genre: 'Fiction', readOn: '2099-01-01' }),
  });
  const errFutureDateData = await errFutureDate.json();
  assert(errFutureDate.status === 400 && errFutureDateData.error === 'Date cannot be in the future', 'Validates future date');

  // Valid create 1
  const create1 = await fetch(`${BASE_URL}/api/reading-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieMatch || '' },
    body: JSON.stringify({ bookTitle: 'Atomic Habits', minutesRead: 40, genre: 'Non-Fiction', note: 'Chapter 3', readOn: '2026-10-20' }),
  });
  assert(create1.status === 201, 'Valid POST returns 201');
  const item1 = await create1.json();
  assert(item1.bookTitle === 'Atomic Habits' && item1.readOn === '2026-10-20', 'Returns exact shape with readOn YYYY-MM-DD');

  // Duplicate check
  const duplicateRes = await fetch(`${BASE_URL}/api/reading-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieMatch || '' },
    body: JSON.stringify({ bookTitle: 'Atomic Habits', minutesRead: 40, genre: 'Non-Fiction', readOn: '2026-10-20' }),
  });
  assert(duplicateRes.status === 409, 'Duplicate POST returns 409');
  const dupData = await duplicateRes.json();
  assert(dupData.error === 'Duplicate reading session: a reading session with the same book title, minutes and date already exists', 'Exact duplicate message verified');

  // Create additional items for testing sort, breakdown, and tie breaking
  await fetch(`${BASE_URL}/api/reading-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieMatch || '' },
    body: JSON.stringify({ bookTitle: 'Dune', minutesRead: 60, genre: 'Sci-Fi', note: 'Arrakis', readOn: '2026-10-22' }),
  });

  await fetch(`${BASE_URL}/api/reading-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieMatch || '' },
    body: JSON.stringify({ bookTitle: 'apple of eden', minutesRead: 50, genre: 'Fiction', readOn: '2026-10-20' }),
  });

  // 5. GET /api/reading-logs and Sorting
  console.log('\n--- 5. Testing GET /api/reading-logs ---');
  const listRes = await fetch(`${BASE_URL}/api/reading-logs`, {
    headers: { Cookie: cookieMatch || '' },
  });
  assert(listRes.status === 200, 'GET list returns 200');
  const listData = await listRes.json();
  assert(listData.length === 3, 'Returns 3 items');
  assert(listData[0].bookTitle === 'Dune', 'Most recent readOn (2026-10-22) comes first');
  // Ties on 2026-10-20: 'apple of eden' vs 'Atomic Habits' (case-insensitive alphabetical)
  assert(listData[1].bookTitle === 'apple of eden', 'Tie-break case-insensitive alphabetical: "apple" before "Atomic"');
  assert(listData[2].bookTitle === 'Atomic Habits', 'Atomic Habits follows');

  // Filtering
  const filterGenreRes = await fetch(`${BASE_URL}/api/reading-logs?genre=Sci-Fi`, {
    headers: { Cookie: cookieMatch || '' },
  });
  const filterGenreData = await filterGenreRes.json();
  assert(filterGenreData.length === 1 && filterGenreData[0].genre === 'Sci-Fi', 'Filters by genre');

  const searchRes = await fetch(`${BASE_URL}/api/reading-logs?q=habits`, {
    headers: { Cookie: cookieMatch || '' },
  });
  const searchData = await searchRes.json();
  assert(searchData.length === 1 && searchData[0].bookTitle === 'Atomic Habits', 'Search q matches bookTitle case-insensitive');

  // 6. GET /api/reading-logs/summary
  console.log('\n--- 6. Testing GET /api/reading-logs/summary ---');
  const sumRes = await fetch(`${BASE_URL}/api/reading-logs/summary`, {
    headers: { Cookie: cookieMatch || '' },
  });
  assert(sumRes.status === 200, 'Summary returns 200');
  const sumData = await sumRes.json();
  assert(sumData.count === 3, 'Summary count = 3');
  assert(sumData.totalMinutes === 150, 'Summary totalMinutes = 150 (40+60+50)');
  assert(Array.isArray(sumData.breakdown), 'Summary has breakdown array');

  // 7. PATCH /api/reading-logs/:id
  console.log('\n--- 7. Testing PATCH /api/reading-logs/:id ---');
  const patchRes = await fetch(`${BASE_URL}/api/reading-logs/${item1.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookieMatch || '' },
    body: JSON.stringify({ favorite: true }),
  });
  assert(patchRes.status === 200, 'PATCH returns 200');
  const patchedItem = await patchRes.json();
  assert(patchedItem.favorite === true, 'Favorite toggled to true');

  // Verify favorite filter works now
  const favListRes = await fetch(`${BASE_URL}/api/reading-logs?favorite=true`, {
    headers: { Cookie: cookieMatch || '' },
  });
  const favListData = await favListRes.json();
  assert(favListData.length === 1 && favListData[0].id === item1.id, 'Favorite filter returns favorited session');

  // 8. Cross-User Isolation
  console.log('\n--- 8. Testing User Isolation (Security) ---');
  const regUser2 = `user2_${Date.now()}@example.com`;
  await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: regUser2, password: 'password123', confirmPassword: 'password123' }),
  });
  const lUser2 = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: regUser2, password: 'password123' }),
  });
  const cookieUser2 = lUser2.headers.get('set-cookie')?.split(';')[0];

  // User 2 cannot access user 1's item
  const u2Patch = await fetch(`${BASE_URL}/api/reading-logs/${item1.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookieUser2 || '' },
    body: JSON.stringify({ favorite: false }),
  });
  assert(u2Patch.status === 404, 'Cross-user PATCH returns 404');

  const u2Delete = await fetch(`${BASE_URL}/api/reading-logs/${item1.id}`, {
    method: 'DELETE',
    headers: { Cookie: cookieUser2 || '' },
  });
  assert(u2Delete.status === 404, 'Cross-user DELETE returns 404');

  const u2List = await fetch(`${BASE_URL}/api/reading-logs`, {
    headers: { Cookie: cookieUser2 || '' },
  });
  const u2ListData = await u2List.json();
  assert(u2ListData.length === 0, 'User 2 sees 0 items (complete isolation)');

  // 9. DELETE /api/reading-logs/:id
  console.log('\n--- 9. Testing DELETE /api/reading-logs/:id ---');
  const delRes = await fetch(`${BASE_URL}/api/reading-logs/${item1.id}`, {
    method: 'DELETE',
    headers: { Cookie: cookieMatch || '' },
  });
  assert(delRes.status === 200, 'DELETE returns 200');
  const delData = await delRes.json();
  assert(delData.success === true, 'DELETE returns { success: true }');

  // 10. POST /api/auth/logout
  console.log('\n--- 10. Testing POST /api/auth/logout ---');
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { Cookie: cookieMatch || '' },
  });
  assert(logoutRes.status === 200, 'Logout returns 200');

  // 11. Grader Account Registration
  console.log('\n--- 11. Registering Official Grader Account ---');
  const graderEmail = 'grader.qe190030@example.com';
  const graderPassword = 'Test1234!';
  const graderReg = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: graderEmail, password: graderPassword, confirmPassword: graderPassword }),
  });
  assert(graderReg.status === 201 || graderReg.status === 409, 'Grader account registered/exists');

  const graderLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: graderEmail, password: graderPassword }),
  });
  assert(graderLogin.status === 200, 'Grader account logs in successfully');

  console.log(`\n========================================`);
  console.log(`TEST SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

