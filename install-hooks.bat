@echo off
echo.
echo ========================================
echo     SNAKE AI - Instalação dos Hooks
echo ========================================
echo.

echo 🔧 Configurando hooks do Git...

REM Verifica se estamos em um repositório Git
if not exist ".git" (
    echo ❌ Erro: Este diretório não é um repositório Git!
    echo    Execute: git init
    pause
    exit /b 1
)

echo ✅ Repositório Git detectado

REM Copia o hook pre-push
if exist ".git\hooks\pre-push.bat" (
    echo ✅ Hook pre-push.bat já existe
) else (
    echo ⚠️  Hook pre-push.bat não encontrado
)

REM Testa o script de versão
echo.
echo 🧪 Testando script de incremento de versão...
node scripts/increment-version.js

echo.
echo 🎯 Configuração concluída!
echo.
echo 📋 Próximos passos:
echo    1. Faça suas alterações no código
echo    2. git add .
echo    3. git commit -m "sua mensagem"
echo    4. git push origin main  ← A versão será incrementada automaticamente!
echo.
echo 🔍 Versão atual:
for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set VERSION=%%i
echo    v%VERSION%
echo.
pause
