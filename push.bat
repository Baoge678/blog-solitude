@echo off
chcp 65001 >nul
echo ========================================
echo 自动推送更新到GitHub
echo ========================================
echo.

echo 1. 检查Git状态...
git status
echo.

echo 2. 智能添加文件（跳过有问题的文件）...
echo 正在添加主要文件...
git add source/
git add themes/
git add _config.yml
git add _config.solitude.yml
git add package.json
git add package-lock.json
git add README.md
git add .gitignore
git add push.ps1
git add push.bat
git add "推送说明.md"
git add "solitude推送到GitHub.txt"
git add "中文歌单推荐.md"
git add "音乐播放功能说明.md"
git add "播放器功能说明.md"
git add "自建歌单使用说明.md"
git add "音乐播放器测试.md"

echo 正在添加删除的文件状态（跳过tatus）...
git add "h --force-with-lease origin main"

echo 检查是否有tatus文件问题...
if exist "tatus" (
    echo 警告：发现tatus文件，跳过此文件
    echo 如需删除此文件，请手动执行：Remove-Item -Path "tatus" -Force
)

if %errorlevel% neq 0 (
    echo 错误：添加文件失败
    echo 尝试手动添加文件...
    git add source/ themes/ _config.yml _config.solitude.yml
    git add package.json package-lock.json README.md .gitignore
    git add push.ps1 push.bat "推送说明.md" "solitude推送到GitHub.txt"
    if %errorlevel% neq 0 (
        echo 错误：手动添加文件也失败
        pause
        exit /b 1
    )
)
echo.

echo 3. 提交更改...
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set mydate=%%c%%a%%b
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a%%b
set commitMessage=更新博客配置: %mydate% %mytime%
git commit -m "%commitMessage%"
if %errorlevel% neq 0 (
    echo 错误：提交失败
    pause
    exit /b 1
)
echo 提交信息: %commitMessage%
echo.

echo 4. 推送到远程仓库...
git push origin main
if %errorlevel% neq 0 (
    echo 错误：推送失败
    echo 可能需要先拉取远程更新: git pull origin main
    pause
    exit /b 1
)
echo.

echo ========================================
echo 推送完成！
echo Cloudflare Pages将自动重新部署...
echo ========================================
pause 