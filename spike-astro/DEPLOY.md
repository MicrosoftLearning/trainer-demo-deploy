# Deploying the spike to a temp GitHub Pages repo

This spike (`spike-astro/`) can be published to a separate GitHub repo that
serves it via GitHub Pages — useful for sharing a working link without
exposing the upstream `trainer-demo-deploy` repo while iterating.

The deploy is intentionally **URL-compatible** with the production
Docusaurus site at
<https://microsoftlearning.github.io/trainer-demo-deploy/> — same base
path (`/trainer-demo-deploy/`), so deep links and asset paths render
identically.

The default deploy target is **`rob-foulkrod/trainer-demo-deploy`**
(configurable via `-TargetRepo`).

## How it works

```
spike-astro/  (this repo, source of truth)
  └── scripts/publish-to-temp-repo.ps1     ← run this locally
        ├── clones the target repo into a temp dir
        ├── wipes its contents
        ├── copies spike-astro/* into the clone (sans node_modules, dist, screenshots)
        ├── drops in .github/workflows/deploy.yml
        └── git commit + git push

<owner>/trainer-demo-deploy  (deploy target)
  └── .github/workflows/deploy.yml         ← run manually from the Actions tab
        ├── npm ci && npm run build (with BASE_PATH=/trainer-demo-deploy/)
        └── deploys dist/ to GitHub Pages
```

Two-step on purpose: the **publish** step uses your local git credentials
(which work cross-owner), and the **deploy** step uses the target repo's
default `GITHUB_TOKEN` (which only works same-owner — that's why the
workflow file lives inside the target repo, not inside this repo).

## Base path & target repo name (read this!)

GitHub Pages serves a project repo at
`https://<owner>.github.io/<repo-name>/`. For Astro's `base` to line up
with the URL the browser actually requests, **the target repo name must
match the configured base path**.

The workflow hardcodes `BASE_PATH=/trainer-demo-deploy/`, so:

| Target repo                              | Pages URL                                                                                | Works? |
| ---------------------------------------- | ---------------------------------------------------------------------------------------- | ------ |
| `<owner>/trainer-demo-deploy`            | `https://<owner>.github.io/trainer-demo-deploy/`                                         | ✅     |
| `<owner>/tdd`  (or anything else)        | `https://<owner>.github.io/tdd/` — but assets look in `/trainer-demo-deploy/` → 404      | ❌     |

If you have an existing differently-named repo (e.g. `rob-foulkrod/tdd`)
you have two options:

1. **Rename it** to `trainer-demo-deploy` (Settings → General → Repository name). Recommended — keeps URLs aligned with prod.
2. **Override `BASE_PATH`** in the workflow to match your repo name (e.g. `BASE_PATH: /tdd/`). URLs won't match prod, but the site will load.

## First-time setup

1. **Create the target repo** on GitHub: <https://github.com/new>
   - Owner: your account (e.g. `rob-foulkrod`)
   - Name: `trainer-demo-deploy` (see above for why)
   - Visibility: **Public** (required for GitHub Pages on a free account)
   - Do NOT initialize it with a README — the publish script handles that.
2. **Enable GitHub Pages** in the target repo:
   - Settings → Pages → "Build and deployment" → Source: **GitHub Actions**.
3. Confirm you can push to it:
   ```powershell
   git ls-remote https://github.com/rob-foulkrod/trainer-demo-deploy.git
   ```

## Publishing

From the workspace root:

```powershell
pwsh ./spike-astro/scripts/publish-to-temp-repo.ps1
```

Useful flags:

| Flag                          | Effect                                                 |
| ----------------------------- | ------------------------------------------------------ |
| `-TargetRepo "owner/repo"`    | Push to a different repo                                |
| `-TargetBranch "gh-pages"`    | Push to a different branch (default: `main`)            |
| `-CommitMessage "..."`        | Override the auto-generated commit message              |
| `-Force`                      | Skip the "overwrite?" confirmation prompt               |
| `-DryRun`                     | Print what would happen, but don't clone/copy/push      |

The script:

- Excludes `node_modules/`, `dist/`, `.astro/`, all `spike-home-real-*.png`
  screenshots, and `err.html` (dev runtime junk).
- Writes a small generated `README.md` to the target repo root so anyone
  who lands there understands it's auto-published.
- Tags the commit message with the upstream branch + short SHA so each
  deploy is traceable back to a specific upstream commit.

## Triggering the deploy

After publishing, open
<https://github.com/rob-foulkrod/trainer-demo-deploy/actions/workflows/deploy.yml>
and click **Run workflow** on the `main` branch. The site goes live at
**<https://rob-foulkrod.github.io/trainer-demo-deploy/>** within a couple
of minutes.

## Testing the build locally

The same env vars the workflow uses also work locally:

```powershell
cd spike-astro
$env:BASE_PATH = "/trainer-demo-deploy/"
$env:SITE_URL  = "https://rob-foulkrod.github.io"
npm run build
npm run preview            # serves dist/ at the configured base
Remove-Item Env:BASE_PATH  # so `npm run dev` goes back to serving at /
Remove-Item Env:SITE_URL
```

## Switching to a different target permanently

Change the default in:

- `spike-astro/scripts/publish-to-temp-repo.ps1` — `[string]$TargetRepo` default
- `spike-astro/DEPLOY.md` — the docs above

If you also need to change the base path (different repo name), edit
`spike-astro/.github-deploy/workflows/deploy.yml` — the `BASE_PATH` env in
the **Build** step.
