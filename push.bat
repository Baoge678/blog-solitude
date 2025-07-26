@echo off
echo ========================================
echo 开始自动推送更新到GitHub...
echo ========================================

echo.
echo 1. 检查Git状态...
git status

echo.
echo 2. 添加所有更改...
git add .

echo.
echo 3. 提交更改...
git commit -m "自动更新: %date% %time%"

echo.
echo 4. 推送到远程仓库...
git push origin main

echo.
echo ========================================
echo 推送完成！
echo ========================================
pause 