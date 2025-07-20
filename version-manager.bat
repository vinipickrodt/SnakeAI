@echo off
echo.
echo ===================================
echo     SNAKE AI - Version Manager
echo ===================================
echo.

echo 🔄 Incrementando versão...
node scripts/increment-version.js

echo.
echo 📋 Status atual:
for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set VERSION=%%i
echo    Versão: v%VERSION%

echo.
echo 🎯 Para fazer push com nova versão:
echo    git add . 
echo    git commit -m "feat: nova funcionalidade"
echo    git push origin main
echo.
echo ✨ O hook pre-push irá incrementar automaticamente a versão no próximo push!
echo.
pause
