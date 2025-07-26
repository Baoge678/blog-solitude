Write-Host "开始自动推送更新到GitHub..." -ForegroundColor Green

# 检查Git状态
$status = git status --porcelain
if ($status) {
    Write-Host "发现未提交的更改，开始处理..." -ForegroundColor Yellow
    
    # 添加所有更改
    git add .
    
    # 提交更改
    $date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "自动更新: $date"
    
    # 推送到远程仓库
    git push origin main
    
    Write-Host "推送完成！" -ForegroundColor Green
} else {
    Write-Host "没有发现未提交的更改。" -ForegroundColor Yellow
}

Write-Host "按回车键继续..."
Read-Host 