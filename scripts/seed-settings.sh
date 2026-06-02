#!/usr/bin/env bash
# Seed Settings: Run this from the project root (Unix / WSL / macOS)
php artisan migrate --force
php artisan db:seed --class=SettingsSeeder --force
echo "Settings seeding complete."
