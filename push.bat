@echo off
chcp 65001 >nul
echo ========================================
echo 自动推送更新到GitHub
echo ========================================
echo.

echo 1. 检查Git状态...
git status
echo.

echo 2. 添加所有更改...
git add .
if %errorlevel% neq 0 (
    echo 错误：添加文件失败
    pause
    exit /b 1
)
echo.

echo 3. 提交更改...
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set mydate=%%c%%a%%b
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a%%b
git commit -m "Auto update: %mydate% %mytime%"
if %errorlevel% neq 0 (
    echo 错误：提交失败
    pause
    exit /b 1
)
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
echo ========================================
pause 