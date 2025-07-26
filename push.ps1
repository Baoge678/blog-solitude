Write-Host "Starting auto push to GitHub..." -ForegroundColor Green

# Check Git status
$status = git status --porcelain
if ($status) {
    Write-Host "Found uncommitted changes, processing..." -ForegroundColor Yellow
    
    # Add all changes
    git add .
    
    # Commit changes
    $date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Auto update: $date"
    
    # Push to remote repository
    git push origin main
    
    Write-Host "Push completed!" -ForegroundColor Green
} else {
    Write-Host "No uncommitted changes found." -ForegroundColor Yellow
}

Write-Host "Press Enter to continue..."
Read-Host 