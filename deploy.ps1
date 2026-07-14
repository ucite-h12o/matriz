param(
    [string]$Message = "Sync before pushing"
)

$ErrorActionPreference = "Stop"

Write-Host "Staging changes..."
git add --all
if ($LASTEXITCODE -ne 0) { throw "Could not stage the changes." }

git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "No new changes to commit."
}
elseif ($LASTEXITCODE -eq 1) {
    Write-Host "Creating commit..."
    git commit -m $Message
    if ($LASTEXITCODE -ne 0) { throw "Could not create the commit." }
}
else {
    throw "Could not inspect the staged changes."
}

Write-Host "Rebasing onto origin/main..."
git pull origin main --rebase
if ($LASTEXITCODE -ne 0) { throw "Pull/rebase failed. Resolve the problem before pushing." }

Write-Host "Pushing main..."
git push origin main
if ($LASTEXITCODE -ne 0) { throw "Push failed." }

Write-Host "Done. GitHub Actions will build MkDocs and deploy GitHub Pages."
