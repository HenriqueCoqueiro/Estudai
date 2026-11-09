@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   Estudai - gerando o APK para Android
echo ============================================
echo.
echo [1/3] Instalando dependencias (pode demorar alguns minutos)...
call npm install
if errorlevel 1 goto erro
echo.
echo [2/3] Entre com sua conta do expo.dev (crie gratis em https://expo.dev/signup)
call npx --yes eas-cli@latest login
if errorlevel 1 goto erro
echo.
echo [3/3] Gerando o APK nos servidores da Expo. Responda Y (sim) as perguntas.
call npx --yes eas-cli@latest build -p android --profile apk
if errorlevel 1 goto erro
echo.
echo PRONTO! Abra no celular o link que apareceu acima e instale o APK.
pause
exit /b 0
:erro
echo.
echo Deu erro. Copie o texto acima e mande para o Claude.
pause
exit /b 1
