const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const scenario = process.argv.includes('--fail') ? 'fail' : 'pass';

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function colorize(color, text) {
  return `${colors[color] || ''}${text}${colors.reset}`;
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function line(char = '=', width = 78) {
  return char.repeat(width);
}

function printHeader() {
  console.log(colorize('cyan', line()));
  console.log(colorize('bold', 'THE SERENE PATH :: RECORD-ONLY CONFIGURATION VERIFICATION'));
  console.log(colorize('cyan', line()));
  console.log(`Mode        : ${scenario.toUpperCase()}`);
  console.log('Purpose     : Documentation / screenshot evidence only');
  console.log('Safety      : Read-only checks against project files; no app, API, or DB mutation');
  console.log(`Project Root: ${root}`);
  console.log(colorize('cyan', line('-')));
}

function evaluateCheck(check) {
  try {
    const passed = check.run();
    return {
      ...check,
      passed,
      details: passed ? check.passDetail : check.failDetail
    };
  } catch (error) {
    return {
      ...check,
      passed: false,
      details: `Exception while evaluating check: ${error.message}`
    };
  }
}

function printSection(title, checks) {
  console.log(colorize('bold', title));
  let passedCount = 0;

  for (const check of checks) {
    const result = evaluateCheck(check);
    const tag = result.passed
      ? colorize('green', '[PASS]')
      : colorize('red', '[FAIL]');

    if (result.passed) passedCount += 1;

    console.log(`${tag} ${result.id} :: ${result.name}`);
    console.log(`       Expected: ${result.expected}`);
    console.log(`       Actual  : ${result.details}`);
  }

  console.log(colorize('cyan', line('-')));
  return { passedCount, totalCount: checks.length };
}

const appJs = readFile('src/App.js');
const serverIndex = readFile('server/index.js');

const ciChecks = [
  {
    id: 'CI-001',
    name: 'Frontend SPA core exists',
    expected: 'package.json, public/index.html, src/index.js, and src/App.js are present',
    run: () =>
      exists('package.json') &&
      exists('public/index.html') &&
      exists('src/index.js') &&
      exists('src/App.js'),
    passDetail: 'Frontend entry/config files detected in the repository.',
    failDetail: 'One or more frontend entry/config files are missing.'
  },
  {
    id: 'CI-002',
    name: 'Backend API core exists',
    expected: 'server/package.json and server/index.js are present',
    run: () => exists('server/package.json') && exists('server/index.js'),
    passDetail: 'Backend package manifest and API entry point detected.',
    failDetail: 'Backend manifest or entry point is missing.'
  },
  {
    id: 'CI-003',
    name: 'Database model layer exists',
    expected: 'User, Journal, Mood, Feedback, and LoginEvent models are present',
    run: () => {
      const requiredModels = [
        'server/models/User.js',
        'server/models/Journal.js',
        'server/models/Mood.js',
        'server/models/Feedback.js',
        scenario === 'fail'
          ? 'server/models/AdminAudit.js'
          : 'server/models/LoginEvent.js'
      ];
      return requiredModels.every(exists);
    },
    passDetail: 'All expected data model files were found.',
    failDetail:
      scenario === 'fail'
        ? 'Intentional negative control: expected server/models/AdminAudit.js, which is not part of the real project.'
        : 'One or more expected model files are missing.'
  }
];

const dependencyChecks = [
  {
    id: 'FD-001',
    name: 'Frontend routing dependency map is intact',
    expected: 'src/App.js wires core routes to Home, Login, Register, Dashboard, Journal, Sanctuary, Feedback, and AdminRoute',
    run: () => {
      const fragments = [
        "import Home from './Home'",
        "import Dashboard from './Dashboard'",
        "import Login from './Login'",
        "import Register from './Register'",
        "import Journal from './Journal'",
        "import Sanctuary from './Sanctuary'",
        "import Feedback from './Feedback'",
        "import AdminRoute from './AdminRoute'",
        'path="/dashboard"',
        'path="/journal"',
        'path="/admin"'
      ];
      return fragments.every((fragment) => appJs.includes(fragment));
    },
    passDetail: 'App router imports and route bindings were detected in src/App.js.',
    failDetail: 'A required import or route binding was not found in src/App.js.'
  },
  {
    id: 'FD-002',
    name: 'Backend data dependency map is intact',
    expected: 'server/index.js connects to MongoDB and imports User, Journal, Feedback, Mood, and LoginEvent models',
    run: () => {
      const fragments = [
        "mongoose.connect(\"mongodb://127.0.0.1:27017/serenepath\")",
        "require('./models/User')",
        "require('./models/Journal')",
        "require('./models/Feedback')",
        "require('./models/Mood')",
        scenario === 'fail'
          ? "require('./models/AdminAudit')"
          : "require('./models/LoginEvent')"
      ];
      return fragments.every((fragment) => serverIndex.includes(fragment));
    },
    passDetail: 'MongoDB connection and backend model imports were confirmed in server/index.js.',
    failDetail:
      scenario === 'fail'
        ? "Intentional negative control: checked for require('./models/AdminAudit'), which does not exist in the real backend."
        : 'A required database connection or model import was not found in server/index.js.'
  },
  {
    id: 'FD-003',
    name: 'Cross-layer feature endpoints are defined',
    expected: 'Backend exposes auth, journal, feedback, admin overview, and emotion-regulation routes used by the application',
    run: () => {
      const routes = [
        "/api/auth/register",
        "/api/auth/login",
        "/api/journal/sync",
        "/api/feedback",
        "/api/admin/overview",
        "/api/emotion-regulation/guide"
      ];
      return routes.every((route) => serverIndex.includes(route));
    },
    passDetail: 'Expected application-facing API routes were found in the backend entry point.',
    failDetail: 'One or more expected application-facing API routes were not found.'
  }
];

function printSummary(ciSummary, fdSummary) {
  const passed = ciSummary.passedCount + fdSummary.passedCount;
  const total = ciSummary.totalCount + fdSummary.totalCount;
  const failed = total - passed;
  const overallPass = failed === 0;
  const statusText = overallPass
    ? colorize('green', 'OVERALL RESULT: PASS')
    : colorize('red', 'OVERALL RESULT: FAIL');

  console.log(colorize('bold', 'SUMMARY'));
  console.log(`CIs Checked : ${ciSummary.passedCount}/${ciSummary.totalCount}`);
  console.log(`FDs Checked : ${fdSummary.passedCount}/${fdSummary.totalCount}`);
  console.log(`Totals      : ${passed}/${total} passed, ${failed} failed`);
  console.log(statusText);
  console.log(colorize('cyan', line()));

  if (!overallPass && scenario === 'fail') {
    console.log(colorize('yellow', 'Note: FAIL mode is intentional for documentation screenshots.'));
    console.log(colorize('yellow', '      It validates that the record-only verifier can visibly detect a mismatch.'));
    console.log(colorize('cyan', line()));
  }

  process.exitCode = overallPass ? 0 : 1;
}

printHeader();
const ciSummary = printSection('CONFIGURATION ITEMS', ciChecks);
const fdSummary = printSection('FUNCTIONAL DEPENDENCIES', dependencyChecks);
printSummary(ciSummary, fdSummary);
