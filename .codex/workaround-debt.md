# Workaround debt

## WD-2026-08-17-001

Status: RESOLVED
Scope: project
Task: Reconcile the local main branch and remove the isolated-worktree push workaround
Created: 2026-08-17
Incident: docs/incidents/2026-08-17-local-main-divergence-WD-2026-08-17-001.md
Failure: `git push origin main` was rejected because local `main` contained obsolete commit `58a7fdc` while `origin/main` contained newer homepage commits; unrelated generated demo changes and twelve untracked photographs prevented a blind branch reset.
Reproduction: From the original workspace at local commit `58a7fdc`, run `git push origin main`; Git returns a non-fast-forward rejection because the branch is one commit ahead and eleven commits behind `origin/main`.
Temporary workaround: A detached worktree based on the remote tip was used to reapply the requested admissions update and push commit `7bb3017` directly to `main`.
Why the workaround restored progress: The detached worktree started at the remote tip, so its commit was a fast-forward even though the original workspace remained divergent and dirty.
Unresolved: None. The primary workspace, archive, generated demos, production build, original push path, and published deployment have all been verified.
Impact: Before cleanup, normal pushes from the primary workspace were unreliable and could accidentally mix obsolete homepage code, broken generated assets, or private source photographs into a public commit.
Evidence: The local commit is preserved on `archive/local-main-before-sync-20260817`; twelve photographs pass the archived SHA-256 manifest in `/Users/qi-heng/Pictures/personal-academic-site/2026-06-06/`; generated demo output is preserved in `/Users/qi-heng/Documents/personal-academic-site-backups/2026-08-17/`; `git rev-list --left-right --count main...origin/main` returned `0 0`; the exact original `git push origin main` path returned `Everything up-to-date`; `npm ci` and `npm run build` succeeded; all three demo entry points use existing `./assets/...` resources; GitHub Pages run `32002703054` succeeded for `7bb3017`.
Next action: None. Continue normal development from the synchronized primary workspace.
Reopen trigger: Any non-fast-forward push, local/remote divergence, untracked private photograph, generated demo drift, failed build, broken demo resource path, or failed Pages deployment.
## WD-2026-08-24-001

Status: RESOLVED
Scope: project
Task: Publish transcript on personal homepage
Created: 2026-08-24
Incident: docs/incidents/2026-08-24-npm-audit-reports-high-severity-vulnerabilities-WD-2026-08-24-001.md
Failure: `npm ci` reported five dependency vulnerabilities, including three high-severity findings in the Vite build-tool dependency graph.
Reproduction: At commit `0deaeeb`, run `npm ci` and then `npm audit --json`; the audit identifies vulnerable `vite`, `postcss`, `nanoid`, `esbuild`, and `@babel/core` versions.
Temporary workaround: None; the homepage update was paused for a durable dependency fix.
Why the workaround restored progress: Not applicable.
Unresolved: None. Compatible lockfile updates removed every reported vulnerability.
Impact: Before the fix, local and CI build tooling used versions with published path-disclosure or denial-of-service advisories; the deployed site remained static.
Evidence: `npm audit fix --dry-run` proposed only compatible updates; `npm audit fix` updated 27 packages; a clean `npm ci` and the exact `npm audit --json` reproduction both reported zero vulnerabilities; final production build passed with Vite 7.3.6.
Next action: None. Keep regular dependency audits in the update workflow.
Reopen trigger: Any future nonzero `npm audit`, clean-install failure, or build regression.
