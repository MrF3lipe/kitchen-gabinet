@echo off
REM ============================================================
REM  Kitchen Cabinet - GENERAR APK
REM  Compila la app web, sincroniza con Capacitor y construye
REM  el APK Android. El resultado se copia a tu Escritorio.
REM
REM  REQUISITOS (instalar una vez):
REM   1) Java JDK 21        https://adoptium.net/
REM   2) Android Studio     https://developer.android.com/studio
REM      (al instalarlo, deja que descargue Android SDK 34+)
REM   3) Variables de entorno (Panel de control > Sistema):
REM        JAVA_HOME    = ruta del JDK 21
REM        ANDROID_HOME = %LOCALAPPDATA%\Android\Sdk
REM        PATH         + %ANDROID_HOME%\platform-tools
REM ============================================================

setlocal
echo.
echo === [1/4] Construyendo la app web ===
call bun run build || call npm run build
if errorlevel 1 ( echo Error al construir. & pause & exit /b 1 )

echo.
echo === [2/4] Sincronizando con Android (Capacitor) ===
call bunx cap sync android || call npx cap sync android
if errorlevel 1 ( echo Error en cap sync. & pause & exit /b 1 )

echo.
echo === [3/4] Compilando APK (puede tardar varios minutos) ===
pushd android
call gradlew.bat assembleDebug
if errorlevel 1 ( popd & echo Error en gradle. & pause & exit /b 1 )
popd

echo.
echo === [4/4] Copiando APK al Escritorio ===
set "APK=android\app\build\outputs\apk\debug\app-debug.apk"
if not exist "%APK%" (
  echo [ERROR] No se encontro %APK%
  pause
  exit /b 1
)
copy /Y "%APK%" "%USERPROFILE%\Desktop\KitchenCabinet.apk"
echo.
echo ============================================================
echo  APK listo: %USERPROFILE%\Desktop\KitchenCabinet.apk
echo  Para instalarlo en tu telefono ejecuta INSTALAR-EN-TELEFONO.bat
echo ============================================================
pause
