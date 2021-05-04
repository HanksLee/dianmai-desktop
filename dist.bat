@echo off

rd /s /Q %cd%\dist\assets\css\theme

xcopy %cd%\src\assets\css\theme\*.* %cd%\dist\assets\css\theme /s

pause