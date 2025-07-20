@echo off
echo.
echo ==========================================
echo     SNAKE AI - Demonstração de Versão
echo ==========================================
echo.

echo 📊 Versão atual:
for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set CURRENT_VERSION=%%i
echo    v%CURRENT_VERSION%

echo.
echo 🎮 Para ver a versão no jogo:
echo    1. Abra o index.html no navegador
echo    2. Olhe no canto inferior direito da tela
echo    3. Você verá: v%CURRENT_VERSION%

echo.
echo 🚀 Para incrementar versão automaticamente:
echo    git add .
echo    git commit -m "feat: nova funcionalidade"
echo    git push origin main
echo.
echo    📈 Após o push, a versão será: v1.2.0

echo.
echo 🔧 Para incrementar versão manualmente:
echo    node scripts/increment-version.js
echo    (ou execute: version-manager.bat)

echo.
echo ✨ Teste agora: Quer incrementar a versão manualmente? (S/N)
set /p choice="Digite sua escolha: "

if /i "%choice%"=="S" (
    echo.
    echo 🔄 Incrementando versão...
    node scripts/increment-version.js
    echo.
    echo 🎉 Nova versão:
    for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set NEW_VERSION=%%i
    echo    v!NEW_VERSION!
    echo.
    echo 💡 Atualize o navegador para ver a nova versão no jogo!
) else (
    echo.
    echo 👍 Tudo pronto! O sistema está configurado e funcionando.
)

echo.
pause
