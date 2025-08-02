Write-Host "=== Auto Push to GitHub ===" -ForegroundColor Green
Write-Host ""

# Check Git status
Write-Host "1. Checking Git status..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "Found uncommitted changes:" -ForegroundColor Cyan
    $status | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
    Write-Host ""
    
    # Add all changes
    Write-Host "2. Adding all changes..." -ForegroundColor Yellow
    git add .
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Add successful" -ForegroundColor Green
    } else {
        Write-Host "✗ Add failed" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host ""
    
    # Commit changes
    Write-Host "3. Committing changes..." -ForegroundColor Yellow
    $date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $commitMessage = "Update blog config: $date"
    git commit -m $commitMessage
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Commit successful" -ForegroundColor Green
        Write-Host "Commit message: $commitMessage" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Commit failed" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host ""
    
    # Push to remote repository
    Write-Host "4. Pushing to remote repository..." -ForegroundColor Yellow
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Push successful" -ForegroundColor Green
        Write-Host ""
        Write-Host "=== All operations completed! ===" -ForegroundColor Green
        Write-Host "Cloudflare Pages will auto-deploy..." -ForegroundColor Cyan
    } else {
        Write-Host "✗ Push failed" -ForegroundColor Red
        Write-Host "May need to pull remote updates first: git pull origin main" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "No uncommitted changes found." -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit" 