@echo off
REM ============================================================
REM  Kitchen Cabinet - INSTALAR DEPENDENCIAS
REM  Ejecuta esto la primera vez (solo una vez).
REM ============================================================
echo.
echo === Instalando dependencias del proyecto ===
echo.

where bun >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  bun install
) else (
  where npm >nul 2>nul
  if %ERRORLEVEL% EQU 0 (
    npm install
  ) else (
    echo [ERROR] No se encontro Bun ni npm.
    echo Instala Node.js desde https://nodejs.org o Bun desde https://bun.sh
    pause
    exit /b 1
  )
)

echo.
echo === Listo. Ahora ejecuta GENERAR-APK.bat ===
pause
