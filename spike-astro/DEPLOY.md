# Deploying the spike to a temp GitHub Pages repo

This spike (`spike-astro/`) is published to GitHub Pages via the
**Deploy spike to GitHub Pages** workflow at
[`.github/workflows/deploy-spike.yml`](../.github/workflows/deploy-spike.yml).

The workflow is `workflow_dispatch` only and is **guarded** against running
on the upstream `MicrosoftLearning/trainer-demo-deploy` repo (which serves
the Docusaurus production site at the same Pages origin). It only runs in
forks/clones — e.g. `rob-foulkrod/tdd`.

## How it works

```
upstream (MicrosoftLearning/trainer-demo-deploy)
  └── .github/workflows/deploy-spike.yml   ← committed here; no-op on upstream
  └── spike-astro/                         ← source of truth

       ↓  git push <fork-remote> spike/astro

fork (e.g. rob-foulkrod/tdd)
  └── .github/workflows/deploy-spike.yml   ← active here
        ├── npm ci  (in spike-astro/)
        ├── npm run build  (BASE_PATH = /tdd/, derived from repo name)
        └── deploys spike-astro/dist to GitHub Pages
```

Same-owner deploy: the workflow runs in the fork it was dispatched from,
so the default `GITHUB_TOKEN` is enough — no PAT, no cross-owner secrets.

## First-time setup

1. **Create the target repo** on GitHub: <https://github.com/new>
   - Owner: your account (e.g. `rob-foulkrod`)
   - Name: `tdd` (or whatever — the workflow derives the Astro base path
     from the repo name, so the URL just follows)
   - Visibility: **Public** (required for GitHub Pages on a free account)
2. **Add a remote and push the `spike/astro` branch:**
   ```powershell
   git remote add demo https://github.com/<owner>/<repo>.git
   git push demo spike/astro
   ```
3. **Enable GitHub Pages** in the target repo:
   - Settings → Pages → "Build and deployment" → Source: **GitHub Actions**

## Deploying

1. Go to the target repo's **Actions** tab.
2. Pick **Deploy spike to GitHub Pages** from the sidebar.
3. Click **Run workflow** → pick the `spike/astro` branch → **Run**.
4. Site goes live at `https://<owner>.github.io/<repo-name>/` in ~1–2 min.

## How the base path works

GitHub Pages serves a project repo at
`https://<owner>.github.io/<repo-name>/`, so Astro must build with a
matching `base`. The workflow does this automatically:

```yaml
env:
  BASE_PATH: /${{ github.event.repository.name }}/
  SITE_URL: https://${{ github.repository_owner }}.github.io
```

| Target repo                  | Pages URL                                       | BASE_PATH          |
| ---------------------------- | ----------------------------------------------- | ------------------ |
| `<owner>/tdd`                | `https://<owner>.github.io/tdd/`                | `/tdd/`            |
| `<owner>/something-else`     | `https://<owner>.github.io/something-else/`     | `/something-else/` |

No workflow edits needed when targeting a different repo name.

## Testing the build locally

```powershell
cd spike-astro
$env:BASE_PATH = "/tdd/"
$env:SITE_URL  = "https://rob-foulkrod.github.io"
npm run build
npm run preview            # serves dist/ at the configured base
Remove-Item Env:BASE_PATH  # so `npm run dev` goes back to serving at /
Remove-Item Env:SITE_URL
```

## Re-deploying after upstream changes

After committing new spike work on `spike/astro`:

```powershell
git push demo spike/astro
```

Then dispatch the workflow again in the fork.
