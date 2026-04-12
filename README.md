# CodeRabbit Feature Test Repo

This repository is a small Node.js project used to exercise CodeRabbit review,
planning, pre-merge checks, finishing touches, merge-conflict resolution, and
other gated features.

## Project layout

- `src/server.js`: tiny HTTP API for user and invoice flows
- `src/lib/user-store.js`: in-memory user management helpers
- `src/lib/pricing.js`: invoice calculation helpers
- `src/lib/alerts.ts`: TypeScript service for queued alerts
- `.coderabbit.yaml`: CodeRabbit configuration used for feature testing

## Suggested test flows

1. Open pull requests that modify public functions without docstrings.
2. Ask CodeRabbit to generate unit tests for changed files.
3. Run custom finishing touches on deliberate cleanup tasks.
4. Run pre-merge checks against intentionally weak PR titles or descriptions.
5. Create conflicting branches and ask CodeRabbit to resolve merge conflicts.

## Test PR marker

This line was added on April 12, 2026 to create a minimal public test PR.
