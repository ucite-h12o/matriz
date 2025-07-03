
Write-Host "📦 Building site..."
mkdocs build

Write-Host "🚀 Deploying to GitHub Pages..."
mkdocs gh-deploy --force

Write-Host "🔄 Syncing Git repository..."
git add .
git commit -m "Sync before pushing"
git pull origin main --rebase
git push origin main

Write-Host "✅ All done!"
