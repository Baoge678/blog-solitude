Write-Host "=== Auto Push to GitHub ===" -ForegroundColor Green
Write-Host ""

# Check Git status
Write-Host "1. Checking Git status..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "Found uncommitted changes:" -ForegroundColor Cyan
    $status | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
    Write-Host ""
    
    # Smart add files (skip problematic files)
    Write-Host "2. Smart adding files (skipping problematic files)..." -ForegroundColor Yellow
    Write-Host "Adding main files..." -ForegroundColor Cyan
    
    # Add main directories and files
    $addCommands = @(
        "source/",
        "themes/", 
        "_config.yml",
        "_config.solitude.yml",
        "package.json",
        "package-lock.json",
        "README.md",
        ".gitignore",
        "push.ps1",
        "push.bat",
        "推送说明.md",
        "solitude推送到GitHub.txt",
        "中文歌单推荐.md",
        "音乐播放功能说明.md",
        "播放器功能说明.md",
        "自建歌单使用说明.md",
        "音乐播放器测试.md"
    )
    
    foreach ($file in $addCommands) {
        git add $file
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Added: $file" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Skipped: $file" -ForegroundColor Yellow
        }
    }
    
    # Add deleted files (skip tatus)
    Write-Host "Adding deleted files status (skipping tatus)..." -ForegroundColor Cyan
    git add "h --force-with-lease origin main"
    
    # Check for tatus file problem
    if (Test-Path "tatus") {
        Write-Host "⚠ Warning: Found tatus file, skipping this file" -ForegroundColor Yellow
        Write-Host "To delete this file, run: Remove-Item -Path 'tatus' -Force" -ForegroundColor Gray
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