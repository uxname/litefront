See [AGENTS.md](./AGENTS.md) — it is the single entry point for this project.
Then read the `.agents/*.md` file that matches your task. When this repo sits inside the
LiteStack meta-repo, its root `AGENTS.md` covers everything that spans both sides.

## Coverage floors only go up

New code ships with tests that check its behaviour. Before you finish, run the
coverage task (`npm run test:cov`; floors in `vitest.config.ts`); if the measured coverage rose, raise the floors to
just under the new numbers in the same change — a point or two of headroom, no
more. Never lower a floor to get green: write the missing test.
