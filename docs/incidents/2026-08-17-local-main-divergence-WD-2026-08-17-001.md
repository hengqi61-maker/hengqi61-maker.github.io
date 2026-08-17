# Local main divergence and dirty generated assets

## Metadata

- Workaround debt ID: WD-2026-08-17-001
- Status: RESOLVED
- Scope: project
- Primary task: Reconcile the local main branch and remove the isolated-worktree push workaround
- Created: 2026-08-17
- Owner: repository maintainer

## Symptom

The primary workspace could not push `main` because its branch had diverged from the published branch. The workspace also contained unrelated generated demo edits and twelve private source photographs, so replacing the branch state without preservation risked data loss or accidental publication.

## Exact reproduction

At 2026-08-17 14:39 +08:00, with local `main` at `58a7fdc`, run `git push origin main` from the repository root. Expected: a fast-forward push. Actual: Git returns `! [rejected] main -> main (fetch first)` and exits nonzero. After fetching, `git rev-list --left-right --count main...origin/main` reports `1 11`.

## Observed facts

- Local commit `58a7fdc` changed the obsolete `graduatePlan` and `targetMatrix` structure in `src/data.ts` and the pre-refactor `src/main.tsx`.
- Remote commit `7bb3017` implements the same requested admissions content in the current `summerCamps` structure.
- `origin/main` includes the homepage and travel-album refactor absent from local `58a7fdc`.
- The dirty polarization demo referenced `/assets/index-Cy9CALjq.js`, which is incorrect for a page deployed below `em-polarization/`; the published version uses `./assets/index-fgNzp2qU.js`.
- Twelve untracked JPEG files were present at the repository root and did not belong in the public Git history.

## Hypotheses

1. The rejection was caused by transient network or GitHub state. Refuted by the deterministic `1 11` commit divergence and successful fetch.
2. The local commit contained unique work that required rebasing. Refuted by the current-architecture implementation in `7bb3017` and the absence of unique requested content in `58a7fdc`.
3. The earliest controllable cause was using a stale primary branch for new work while newer commits were produced elsewhere, without reconciling the primary workspace afterward. Supported by reflog timestamps, the obsolete component shape, and the remote-only commit sequence.

## Experiments and results

- Compared `58a7fdc..origin/main`: the remote branch contains the architecture refactor and an equivalent admissions update; rebasing the old component edit would create conflicts without adding value.
- Compared dirty demo files with `origin/main`: the local polarization HTML had invalid absolute asset URLs; restoring the remote generated output removes the deployment defect.
- Copied all twelve photographs to the Pictures archive and ran SHA-256 comparison between source and destination; all twelve matched before source removal.
- Created `archive/local-main-before-sync-20260817` at `58a7fdc`, backed up generated output, restored published demo files, and used `git reset --keep origin/main`; branch divergence changed from `1 11` to `0 0` without an unpreserved overwrite.

## Confirmed root cause

The primary workspace remained on an older commit while subsequent production work was committed and pushed from other branches or worktrees. A new content edit was then committed against that stale architecture. The non-fast-forward rejection was correct Git behavior; the isolated worktree only bypassed the stale primary workspace and left its state unresolved. Evidence strength is strong for the Git divergence and moderate for the exact process that allowed the primary branch to remain stale.

## Temporary workaround

A clean detached worktree based on the remote tip was used to create and push `7bb3017`. It was reversible and preserved the dirty primary workspace, but normal development from the primary workspace remained blocked until this cleanup.

## Candidate durable fixes

1. Rebase `58a7fdc` onto `origin/main` and resolve conflicts. Rejected because the commit targets removed component structures and its requested content already exists remotely; this has the highest conflict and regression risk.
2. Continue using detached worktrees for every push. Rejected because it preserves the stale primary branch and makes the workaround permanent.
3. Archive `58a7fdc`, preserve unrelated files outside the public repository, restore generated assets, and synchronize primary `main` to `origin/main`. Selected because it preserves all evidence, removes obsolete code, restores the supported workflow, and has a clear rollback.

## Selected fix

Option 3. The obsolete commit is retained on `archive/local-main-before-sync-20260817`; private photographs are in a hash-verified Pictures archive; generated output is in a dated backup directory; the primary branch now matches `origin/main` using `git reset --keep`.

## Verification

- `git rev-list --left-right --count main...origin/main` returned `0 0` after synchronization.
- The exact original `git push origin main` command returned `Everything up-to-date` with exit code 0.
- `npm ci` completed successfully; it reported five dependency vulnerabilities that are tracked as an audit finding rather than part of this Git incident.
- `npm run build` completed successfully after processing 1,590 modules.
- The entry points for `em-polarization`, `hydrogen-orbital`, and `hydrogen-orbital-demo` reference existing relative `./assets/...` resources and contain no absolute `/assets/...` references.
- All twelve private photographs passed `shasum -a 256 -c SHA256SUMS.txt` in the external archive, and none remains in the repository root.
- GitHub Pages workflow run `32002703054` completed successfully for commit `7bb3017`.
- The project debt checker accepts this entry with no task-related `OPEN` state.

## Rollback

- Restore the previous local commit by switching to `archive/local-main-before-sync-20260817` or creating a new recovery branch from it.
- Restore private photographs from `/Users/qi-heng/Pictures/personal-academic-site/2026-06-06/` after verifying `SHA256SUMS.txt`.
- Restore generated working-tree files from `/Users/qi-heng/Documents/personal-academic-site-backups/2026-08-17/generated-working-tree/` for forensic comparison only.

## Remaining uncertainty

No task-blocking uncertainty remains. Reopen on any push rejection, branch divergence, lost archive file, build failure, demo path failure, or failed Pages deployment.

## Final state

RESOLVED
