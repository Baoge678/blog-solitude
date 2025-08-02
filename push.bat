@echo off
echo ========================================
echo Auto Push to GitHub
echo ========================================
echo.

echo 1. Checking Git status...
git status
echo.

echo 2. Adding files...
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
git add "source/_posts/风华正茂 copy.md"
echo.

echo 3. Committing changes...
git commit -m "Update blog config"
echo.

echo 4. Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo Push completed!
echo ========================================
pause 