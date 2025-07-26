# 一键推送脚本
Write-Host "========================================" -ForegroundColor Green
Write-Host "开始自动推送更新到GitHub..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# 检查是否有未提交的更改
$status = git status --porcelain
if ($status) {
    Write-Host "发现未提交的更改，开始处理..." -ForegroundColor Yellow
    
    # 1. 添加所有更改
    Write-Host "1. 添加所有更改..." -ForegroundColor Cyan
    git add .
    
    # 2. 提交更改
    $commitMessage = "自动更新: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    Write-Host "2. 提交更改: $commitMessage" -ForegroundColor Cyan
    git commit -m $commitMessage
    
    # 3. 推送到远程仓库
    Write-Host "3. 推送到远程仓库..." -ForegroundColor Cyan
    git push origin main
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "推送完成！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host "没有发现未提交的更改。" -ForegroundColor Yellow
}

Write-Host "按任意键继续..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 