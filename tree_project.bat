@echo off
echo Generando arbol de archivos (sin node_modules)...
rem Lista todos los archivos recursivamente, excluyendo la carpeta node_modules
dir /s /b /a-d | findstr /v /i "\\node_modules\\" > project_tree.txt
echo Listo. El resultado esta en project_tree.txt
pause