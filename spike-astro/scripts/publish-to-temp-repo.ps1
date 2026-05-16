# Publish-to-temp-repo.ps1
#
# Mirrors the spike-astro/ folder into a temp git repo (default:
# robfoulk/tdd) so it can be deployed to GitHub Pages via the workflow
# that gets pushed alongside the source. Uses your local git credentials
# (so the user running this needs push access to the target repo).
#
# Usage (from the workspace root or anywhere — paths are resolved relative
# to this script):
#
#     pwsh ./spike-astro/scripts/publish-to-temp-repo.ps1
#     pwsh ./spike-astro/scripts/publish-to-temp-repo.ps1 -TargetRepo "robfoulk/tdd"
#     pwsh ./spike-astro/scripts/publish-to-temp-repo.ps1 -CommitMessage "spike: tweak carousel"
#     pwsh ./spike-astro/scripts/publish-to-temp-repo.ps1 -Force        # skip confirmation
#     pwsh ./spike-astro/scripts/publish-to-temp-repo.ps1 -DryRun       # show what would happen

[CmdletBinding()]
param(
  [string]$TargetRepo = "rob-foulkrod/trainer-demo-deploy",
  [string]$TargetBranch = "main",
  [string]$CommitMessage = "",
  [switch]$Force,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# --- Resolve paths ----------------------------------------------------------
$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$spikeRoot  = Resolve-Path (Join-Path $scriptDir "..") | Select-Object -ExpandProperty Path
$workflowSrc = Join-Path $spikeRoot ".github-deploy\workflows\deploy.yml"

if (-not (Test-Path $workflowSrc)) {
  throw "Deploy workflow template not found at: $workflowSrc"
}

# --- Stage the source we want to publish ------------------------------------
# We exclude generated junk, screenshots, dev caches, and the deploy template
# folder itself (which gets copied into .github/workflows/ separately).
$excludeDirs  = @("node_modules", "dist", ".astro", ".github-deploy")
$excludeFiles = @(
  "err.html",
  "spike-home-full.png",
  "spike-home-real-a-azure-start.png",
  "spike-home-real-b-azure-mid.png",
  "spike-home-real-c-azure-end.png",
  "spike-home-real-d-cps-start.png",
  "spike-home-real-e-cps-mid.png",
  "spike-home-real-f-cps-end.png",
  "spike-home-real-g-stress-start.png",
  "spike-home-real-h-stress-mid.png",
  "spike-home-real-i-stress-end.png"
)

# --- Prepare the target working clone in a temp dir -------------------------
$cloneDir = Join-Path ([System.IO.Path]::GetTempPath()) ("opx-publish-" + $TargetRepo.Replace("/", "-"))
$remoteUrl = "https://github.com/$TargetRepo.git"

Write-Host ""
Write-Host "Spike source : $spikeRoot" -ForegroundColor Cyan
Write-Host "Target repo  : $remoteUrl" -ForegroundColor Cyan
Write-Host "Target branch: $TargetBranch" -ForegroundColor Cyan
Write-Host "Working dir  : $cloneDir" -ForegroundColor Cyan
Write-Host ""

if (-not $Force -and -not $DryRun) {
  $reply = Read-Host "This will FORCE-OVERWRITE the contents of $TargetRepo@$TargetBranch with the current spike source. Continue? (y/N)"
  if ($reply -notmatch '^[Yy]') { Write-Host "Aborted."; exit 1 }
}

# Clean any previous working clone so we always start fresh.
if (Test-Path $cloneDir) {
  if ($DryRun) {
    Write-Host "[dry-run] Would remove existing working clone: $cloneDir" -ForegroundColor Yellow
  } else {
    Remove-Item -Recurse -Force $cloneDir
  }
}

if ($DryRun) {
  Write-Host "[dry-run] Would clone $remoteUrl into $cloneDir" -ForegroundColor Yellow
} else {
  Write-Host "Cloning $remoteUrl ..." -ForegroundColor Green
  # Try to clone the target branch; if it doesn't exist yet (empty repo),
  # fall back to an init+orphan-branch workflow.
  $cloneOk = $true
  try {
    git clone --depth 1 --branch $TargetBranch $remoteUrl $cloneDir 2>$null
    if ($LASTEXITCODE -ne 0) { $cloneOk = $false }
  } catch { $cloneOk = $false }

  if (-not $cloneOk) {
    Write-Host "  branch '$TargetBranch' not found on remote (likely empty repo); initializing locally." -ForegroundColor Yellow
    git clone $remoteUrl $cloneDir 2>$null
    if (-not (Test-Path $cloneDir)) {
      # Repo doesn't exist at all OR we have no read access.
      throw "Could not clone $remoteUrl. Make sure the repo exists on GitHub and you're authenticated (run ``gh auth status`` or ``git ls-remote $remoteUrl``)."
    }
    Push-Location $cloneDir
    try {
      git checkout --orphan $TargetBranch 2>$null | Out-Null
      git rm -rf . 2>$null | Out-Null
    } finally {
      Pop-Location
    }
  }
}

# --- Wipe the clone's contents (keep .git) ----------------------------------
if ($DryRun) {
  Write-Host "[dry-run] Would wipe contents of $cloneDir (except .git)" -ForegroundColor Yellow
} else {
  Get-ChildItem -Path $cloneDir -Force | Where-Object { $_.Name -ne ".git" } | ForEach-Object {
    Remove-Item -Recurse -Force $_.FullName
  }
}

# --- Copy spike-astro/ contents into the clone root -------------------------
Write-Host "Copying spike source into clone..." -ForegroundColor Green
$items = Get-ChildItem -Path $spikeRoot -Force | Where-Object {
  ($excludeDirs  -notcontains $_.Name) -and
  ($excludeFiles -notcontains $_.Name) -and
  ($_.Name -ne ".git")
}
foreach ($item in $items) {
  $dest = Join-Path $cloneDir $item.Name
  if ($DryRun) {
    Write-Host "  [dry-run] copy $($item.Name) -> $dest" -ForegroundColor Yellow
  } else {
    if ($item.PSIsContainer) {
      Copy-Item -Recurse -Force $item.FullName $dest
    } else {
      Copy-Item -Force $item.FullName $dest
    }
  }
}

# --- Drop in the deploy workflow --------------------------------------------
$workflowDestDir = Join-Path $cloneDir ".github\workflows"
$workflowDest    = Join-Path $workflowDestDir "deploy.yml"
if ($DryRun) {
  Write-Host "[dry-run] Would copy $workflowSrc -> $workflowDest" -ForegroundColor Yellow
} else {
  New-Item -ItemType Directory -Path $workflowDestDir -Force | Out-Null
  Copy-Item -Force $workflowSrc $workflowDest
}

# --- A short README explaining where this code came from -------------------
$generatedReadme = @"
# Trainer Demo Deploy — Astro spike (deployed copy)

> ⚠️  **This repo is auto-generated.** Do not edit files here directly — your
> changes will be wiped on the next publish.

The canonical source lives in
[MicrosoftLearning/trainer-demo-deploy](https://github.com/MicrosoftLearning/trainer-demo-deploy)
on the ``spike/astro`` branch, under ``spike-astro/``. This repo exists
only as a deploy target for the Astro spike on GitHub Pages.

## Re-publishing

From the upstream workspace:

``````powershell
pwsh ./spike-astro/scripts/publish-to-temp-repo.ps1
``````

Then go to the **Actions** tab in this repo and manually run the
**Deploy spike to GitHub Pages** workflow.

The site is served at ``https://<owner>.github.io/<repo-name>/``.
"@

if ($DryRun) {
  Write-Host "[dry-run] Would write generated README.md to clone root" -ForegroundColor Yellow
} else {
  Set-Content -Path (Join-Path $cloneDir "README.md") -Value $generatedReadme -Encoding utf8
}

# --- Commit + push ----------------------------------------------------------
if ($DryRun) {
  Write-Host ""
  Write-Host "[dry-run] Skipping git commit/push." -ForegroundColor Yellow
  Write-Host "[dry-run] Working clone left at: $cloneDir" -ForegroundColor Yellow
  exit 0
}

Push-Location $cloneDir
try {
  # Capture upstream SHA for the commit message (so the deploy is traceable).
  Push-Location $spikeRoot
  $upstreamSha = (git rev-parse --short HEAD).Trim()
  $upstreamBranch = (git rev-parse --abbrev-ref HEAD).Trim()
  Pop-Location

  if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
    $CommitMessage = "Publish spike-astro from $upstreamBranch@$upstreamSha"
  }

  git add -A
  $status = git status --porcelain
  if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "Nothing changed since the last publish. Skipping commit." -ForegroundColor Yellow
  } else {
    git -c user.email="spike-publisher@local" -c user.name="spike-publisher" commit -m $CommitMessage | Out-Null
    Write-Host "Pushing to $remoteUrl ($TargetBranch) ..." -ForegroundColor Green
    git push origin "HEAD:$TargetBranch"
  }
} finally {
  Pop-Location
}

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host "Next step: open https://github.com/$TargetRepo/actions and run 'Deploy spike to GitHub Pages'." -ForegroundColor Cyan
