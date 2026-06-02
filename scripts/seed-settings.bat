@echo off
REM Seed Settings: Run this from the project root (Windows)
php artisan migrate --force
php artisan db:seed --class=SettingsSeeder --force
echo.
echo Settings seeding complete.
pause
