@echo off
REM ============================================================
REM  Kitchen Cabinet - INSTALAR EN TELEFONO via USB
REM
REM  ANTES de ejecutar:
REM   1) Activa "Opciones de desarrollador" en tu telefono:
REM      Ajustes > Acerca del telefono > toca "Numero de compilacion" 7 veces.
REM   2) Activa "Depuracion USB" en Opciones de desarrollador.
REM   3) Conecta el telefono por USB y autoriza la conexion en el popup.
REM ============================================================

set "APK=%USERPROFILE%\Desktop\KitchenCabinet.apk"
if not exist "%APK%" (
  echo [ERROR] No se encontro %APK%
  echo Ejecuta primero GENERAR-APK.bat
  pause
  exit /b 1
)

where adb >nul 2>nul
if errorlevel 1 (
  echo [ERROR] adb no esta en el PATH.
  echo Anade %%LOCALAPPDATA%%\Android\Sdk\platform-tools al PATH del sistema.
  pause
  exit /b 1
)

echo === Dispositivos conectados ===
adb devices
echo.
echo === Instalando KitchenCabinet.apk ===
adb install -r "%APK%"
if errorlevel 1 (
  echo Error al instalar. Verifica la conexion USB y la depuracion.
  pause
  exit /b 1
)
echo.
echo ============================================================
echo  Instalado. Busca "Kitchen Cabinet" en el menu de apps.
echo ============================================================
pause
