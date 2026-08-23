# NPM audit reports high severity vulnerabilities

## Metadata

- Workaround debt ID: WD-2026-08-24-001
- Status: RESOLVED
- Scope: project
- Primary task: Publish transcript on personal homepage
- Created: 2026-08-24

## Symptom

`npm ci` completed but reported five dependency vulnerabilities, including three high-severity findings, during the transcript homepage update.

## Exact reproduction

On 2026-08-24 Asia/Shanghai, run `npm ci` from the repository at commit `0deaeeb`, then run `npm audit --json`. Expected: zero vulnerabilities. Actual: five findings (two low and three high) affecting Vite and its build-time dependency graph.

## Observed facts

- The affected packages were `vite`, `postcss`, `nanoid`, `esbuild`, and `@babel/core`.
- Vite was a direct development dependency at 7.3.3; the others were transitive build dependencies.
- The site is statically deployed, but the vulnerable versions remained in the development and CI toolchain.
- `npm audit fix --dry-run` proposed only compatible version updates and no removals or major-version changes.

## Hypotheses

1. The lockfile pinned versions that predated available patched releases. Supported if compatible lockfile refresh removes all findings.
2. The declared semver ranges prevented patched versions. Refuted by the dry run selecting fixed versions without editing the declared ranges.

## Experiments and results

1. Baseline `npm audit --json`: five findings, three high.
2. `npm audit fix --dry-run --json`: proposed 27 compatible package updates, including Vite 7.3.3 to 7.3.6, with no package removals.
3. `npm audit fix`: updated the lockfile and installed graph; immediate audit reported zero findings.
4. Clean `npm ci`, exact `npm audit --json`, and `npm run build`: all succeeded with zero findings and Vite 7.3.6.

## Confirmed root cause

The package lock pinned vulnerable build-tool versions even though patched releases satisfied the existing dependency ranges. Evidence strength is strong: refreshing only the lockfile versions removed the audit findings, and a clean reinstall reproduced the secure dependency graph.

## Temporary workaround

None. The primary task was paused while the dependency issue was investigated and fixed.

## Candidate durable fixes

1. Run `npm audit fix` within existing semver ranges. Best evidence, minimal source impact, easy rollback through the lockfile.
2. Add explicit overrides for each affected transitive package. More configuration and maintenance burden, with weaker alignment to normal dependency resolution.
3. Upgrade Vite to a new major version. Potentially durable but unnecessarily broad and higher regression risk for a patch-level vulnerability fix.

## Selected fix

Refresh the dependency graph with `npm audit fix` inside the existing compatible ranges. This addresses the earliest controllable cause without broad source or toolchain changes.

## Verification

- The exact original `npm audit --json` path reports zero vulnerabilities after the fix.
- A clean `npm ci` reports zero vulnerabilities.
- `npm run build` succeeds with Vite 7.3.6 before and after the responsive layout adjustment.
- Desktop and mobile browser QA completed with zero console errors or warnings.

## Rollback

Restore the prior `package-lock.json` from Git and run `npm ci`. No runtime data or external configuration changed.

## Remaining uncertainty

The package manager still notes two unreviewed install scripts (`esbuild` and optional `fsevents`), but the scripts were not bypassed and the production build succeeded. Reopen if `npm audit` reports new findings or clean installation/build fails.

## Final state

RESOLVED
