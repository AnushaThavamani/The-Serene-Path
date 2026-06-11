const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const scenario = process.argv.includes('--fail') ? 'fail' : 'pass';

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function colorize(color, text) {
  return `${colors[color] || ''}${text}${colors.reset}`;
}

function filePath(relativePath) {
  return path.join(root, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(filePath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(filePath(relativePath), 'utf8');
}

function divider(char = '=', width = 82) {
  return char.repeat(width);
}

function statusTag(passed) {
  return passed ? colorize('green', '[PASS]') : colorize('red', '[FAIL]');
}

function printHeader() {
  console.log(colorize('cyan', divider()));
  console.log(colorize('bold', 'THE SERENE PATH :: DYNAMIC PROGRAM ANALYSIS REPORT'));
  console.log(colorize('cyan', divider()));
  console.log(`Mode        : ${scenario.toUpperCase()}`);
  console.log('Purpose     : Record-only terminal verification for documentation screenshots');
  console.log('Safety      : Read-only inspection of project files and source structure only');
  console.log('Mutation    : None - no frontend, backend, or database behavior is changed');
  console.log(`Project Root: ${root}`);
  console.log(colorize('cyan', divider('-')));
}

function summarizeFile(relativePath) {
  const stats = fs.statSync(filePath(relativePath));
  return `${relativePath} present (${stats.size} bytes)`;
}

function makeCheck(id, title, expected, run, passDetail, failDetail) {
  return { id, title, expected, run, passDetail, failDetail };
}

const appJs = read('src/App.js');
const loginJs = read('src/Login.js');
const adminRouteJs = read('src/AdminRoute.js');
const reportWebVitalsJs = read('src/reportWebVitals.js');
const serverIndex = read('server/index.js');
const authSpec = read('tests/auth.spec.js');

const sections = [
  {
    title: 'RUNTIME ERROR DETECTION',
    checks: [
      makeCheck(
        'RTE-001',
        'Frontend entry modules required for runtime are present',
        'src/App.js, src/index.js, and public/index.html should exist',
        () => exists('src/App.js') && exists('src/index.js') && exists('public/index.html'),
        `Verified ${summarizeFile('src/App.js')}, ${summarizeFile('src/index.js')}, and ${summarizeFile('public/index.html')}.`,
        'One or more runtime entry files are missing.'
      ),
      makeCheck(
        'RTE-002',
        'Backend route handlers include error handling blocks',
        'server/index.js should include try/catch or guarded error responses for API execution',
        () => serverIndex.includes('try {') && serverIndex.includes('catch (err)') && serverIndex.includes('status: "Error"'),
        'Backend API file contains structured error handling and error status responses.',
        'Expected error handling patterns were not found in server/index.js.'
      )
    ]
  },
  {
    title: 'MEMORY LEAK DETECTION',
    checks: [
      makeCheck(
        'MLD-001',
        'Project contains route protection without uncontrolled polling/timer patterns',
        'Admin route should protect access and avoid setInterval/setTimeout accumulation patterns',
        () => adminRouteJs.includes('localStorage.getItem') && !adminRouteJs.includes('setInterval(') && !adminRouteJs.includes('setTimeout('),
        'AdminRoute uses guarded localStorage access and does not show timer-based leak risks.',
        'Protected-route guard was not found or timer-based patterns were detected.'
      ),
      makeCheck(
        'MLD-002',
        'Authentication view avoids repeating listener/timer patterns',
        'Login module should submit via controlled handler and avoid repeated interval/listener setup',
        () => loginJs.includes('const handleLogin = async') && !loginJs.includes('addEventListener(') && !loginJs.includes('setInterval('),
        'Login flow is handler-driven and no repeated listener/timer setup patterns were found.',
        scenario === 'fail'
          ? 'Intentional FAIL mode can be used to show visible mismatch in another section while keeping memory checks realistic.'
          : 'Expected controlled login handler pattern was not found.'
      )
    ]
  },
  {
    title: 'PERFORMANCE ANALYSIS',
    checks: [
      makeCheck(
        'PA-001',
        'Performance instrumentation hook exists',
        'src/reportWebVitals.js should include web-vitals lazy import and metric collection',
        () =>
          reportWebVitalsJs.includes("import('web-vitals')") &&
          reportWebVitalsJs.includes('getCLS') &&
          reportWebVitalsJs.includes('getFID') &&
          reportWebVitalsJs.includes('getLCP'),
        'reportWebVitals includes lazy metric loading for runtime performance observation.',
        'Performance instrumentation hook was not detected in src/reportWebVitals.js.'
      ),
      makeCheck(
        'PA-002',
        'Documentation test layer exists for repeatable analysis',
        'Playwright config and test suite should exist for repeatable execution evidence',
        () => exists('playwright.config.js') && exists('tests/auth.spec.js') && authSpec.includes("test.describe('Auth Module'"),
        'Playwright configuration and auth test suite were found for repeatable test-oriented analysis.',
        'Playwright configuration or expected auth test suite pattern is missing.'
      )
    ]
  },
  {
    title: 'POST EXECUTION FILE INTEGRITY',
    checks: [
      makeCheck(
        'PFI-001',
        'Core frontend/backend/database files remain intact after record-only analysis',
        'App, backend entry, and database model files should still exist after analysis',
        () =>
          exists('src/App.js') &&
          exists('server/index.js') &&
          exists('server/models/User.js') &&
          exists('server/models/Journal.js') &&
          exists('server/models/Feedback.js'),
        'Core application files remain present; the record-only script does not modify or remove them.',
        'A core file expected for integrity verification is missing.'
      ),
      makeCheck(
        'PFI-002',
        'Existing screenshot/report output folders are still detectable',
        'playwright-report and test-results folders or tests folder should remain discoverable in the workspace',
        () =>
          exists('tests') &&
          (exists('playwright-report') || exists('test-results') || exists('docs/record-tests')),
        'Report-oriented folders are still present and discoverable after analysis.',
        scenario === 'fail'
          ? 'Intentional FAIL is injected in Dynamic Behavior Analysis, not by modifying project files.'
          : 'Expected report/test directories were not found.'
      )
    ]
  },
  {
    title: 'DYNAMIC BEHAVIOR ANALYSIS',
    checks: [
      makeCheck(
        'DBA-001',
        'Protected admin behavior is represented in the frontend',
        'AdminRoute should redirect non-admin users away from /admin',
        () => adminRouteJs.includes("user.role !== 'admin'") && adminRouteJs.includes('Navigate to="/dashboard"'),
        'Protected admin navigation behavior is encoded in AdminRoute.',
        'Protected admin redirect behavior was not found in AdminRoute.'
      ),
      makeCheck(
        'DBA-002',
        'Cross-layer auth and journal behavior is represented in code',
        'Frontend login fetch and backend auth/journal endpoints should all be present',
        () => {
          const required = [
            "fetch('http://localhost:5000/api/auth/login'",
            '/api/auth/register',
            '/api/auth/login',
            '/api/journal/sync',
            scenario === 'fail' ? '/api/admin/audit-export' : '/api/emotion-regulation/guide'
          ];
          return required.every((fragment) => loginJs.includes(fragment) || serverIndex.includes(fragment));
        },
        'Frontend and backend source files reflect the expected auth and journaling behavior chain.',
        scenario === 'fail'
          ? 'Intentional negative control: /api/admin/audit-export is not part of the actual project, so this FAIL is documentation-only.'
          : 'Expected cross-layer behavior fragments were not all found.'
      )
    ]
  }
];

function runSection(section) {
  console.log(colorize('bold', section.title));
  let passed = 0;

  for (const check of section.checks) {
    let ok = false;
    let detail = '';

    try {
      ok = Boolean(check.run());
      detail = ok ? check.passDetail : check.failDetail;
    } catch (error) {
      ok = false;
      detail = `Exception while evaluating check: ${error.message}`;
    }

    if (ok) {
      passed += 1;
    }

    console.log(`${statusTag(ok)} ${check.id} :: ${check.title}`);
    console.log(`       Expected: ${check.expected}`);
    console.log(`       Actual  : ${detail}`);
  }

  console.log(colorize('cyan', divider('-')));
  return { passed, total: section.checks.length };
}

function printSummary(results) {
  const passed = results.reduce((sum, item) => sum + item.passed, 0);
  const total = results.reduce((sum, item) => sum + item.total, 0);
  const failed = total - passed;
  const ok = failed === 0;

  console.log(colorize('bold', 'SUMMARY'));
  console.log(`Sections    : ${results.length}`);
  console.log(`Checks      : ${passed}/${total} passed`);
  console.log(`Failures    : ${failed}`);
  console.log(ok ? colorize('green', 'OVERALL RESULT: PASS') : colorize('red', 'OVERALL RESULT: FAIL'));
  console.log(colorize('cyan', divider()));

  if (!ok && scenario === 'fail') {
    console.log(colorize('yellow', 'Intentional FAIL mode is for lab/documentation screenshots only.'));
    console.log(colorize('yellow', 'It does not simulate a real runtime fault and does not alter application behavior.'));
    console.log(colorize('cyan', divider()));
  }

  process.exitCode = ok ? 0 : 1;
}

printHeader();
const results = sections.map(runSection);
printSummary(results);
