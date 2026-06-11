# Record-Only Verification

This folder contains an isolated, read-only verification script for documentation and screenshot capture.

It does not start the frontend, backend, or database.
It does not write to application data.
It only inspects the repository structure and selected source files.

Commands:

```powershell
node .\docs\record-tests\verify-serene-path.js --fail
node .\docs\record-tests\verify-serene-path.js
node .\docs\record-tests\dynamic-analysis-serene-path.js --fail
node .\docs\record-tests\dynamic-analysis-serene-path.js
npm run record:dynamic:fail
npm run record:dynamic:pass
```

Use `--fail` to generate an intentional documentation-only FAIL screenshot.
Run without flags to generate the real PASS screenshot based on the current project structure.

The dynamic analysis script is also read-only and prints these report sections:
- Runtime Error Detection
- Memory Leak Detection
- Performance Analysis
- Post Execution File Integrity
- Dynamic Behavior Analysis
