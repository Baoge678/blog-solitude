Write-Host "=== 自动推送更新到GitHub ===" -ForegroundColor Green
Write-Host ""

# 检查Git状态
Write-Host "1. 检查Git状态..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "发现未提交的更改:" -ForegroundColor Cyan
    $status | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
    Write-Host ""
    
    # 添加所有更改
    Write-Host "2. 添加所有更改..." -ForegroundColor Yellow
    git add .
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ 添加成功" -ForegroundColor Green
    } else {
        Write-Host "✗ 添加失败" -ForegroundColor Red
        Read-Host "按Enter键退出"
        exit 1
    }
    Write-Host ""
    
    # 提交更改
    Write-Host "3. 提交更改..." -ForegroundColor Yellow
    $date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Auto update: $date"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ 提交成功" -ForegroundColor Green
    } else {
        Write-Host "✗ 提交失败" -ForegroundColor Red
        Read-Host "按Enter键退出"
        exit 1
    }
    Write-Host ""
    
    # 推送到远程仓库
    Write-Host "4. 推送到远程仓库..." -ForegroundColor Yellow
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ 推送成功" -ForegroundColor Green
        Write-Host ""
        Write-Host "=== 所有操作完成！ ===" -ForegroundColor Green
    } else {
        Write-Host "✗ 推送失败" -ForegroundColor Red
        Write-Host "可能需要先拉取远程更新: git pull origin main" -ForegroundColor Yellow
        Read-Host "按Enter键退出"
        exit 1
    }
} else {
    Write-Host "没有发现未提交的更改。" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "按Enter键退出" 