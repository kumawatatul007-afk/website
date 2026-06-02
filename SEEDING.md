# Database Seeding — Quick Instructions

This repository includes a seeder that sets site defaults (including `social_links`).

To apply the seed on your machine (Windows):

```bat
cd path\to\project
scripts\seed-settings.bat
```

On macOS / Linux / WSL:

```bash
cd /path/to/project
./scripts/seed-settings.sh
```

Alternatively, run the artisan commands directly:

```bash
php artisan migrate --force
php artisan db:seed --class=SettingsSeeder --force
```

After seeding, refresh the site (and rebuild assets with `npm run build` if necessary).
