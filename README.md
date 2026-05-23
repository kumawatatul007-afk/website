# My Laravel App — Setup Guide

Clone karne ke baad yeh steps follow karo:

## Requirements
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL

---

## Step 1 — Dependencies install karo

```bash
composer install
npm install
```

## Step 2 — .env file banao

```bash
cp .env.example .env
php artisan key:generate
```

Phir `.env` file open karo aur apna database configure karo:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=root
DB_PASSWORD=your_password
```

## Step 3 — Database setup karo

```bash
php artisan migrate
php artisan db:seed
```

## Step 4 — Storage link banao (IMPORTANT — images ke liye)

```bash
php artisan storage:link
```

> Yeh step zaroor karo warna uploaded images show nahi hongi.

## Step 5 — Frontend build karo

```bash
npm run build
```

## Step 6 — Server start karo

```bash
php artisan serve
```

Website ab `http://localhost:8000` pe chalegi.

---

## Admin Login

Default admin credentials (`database/seeders/AdminSeeder.php` se):

| Email | Password |
|-------|----------|
| admin@mora.com | admin123 |

---

## Images / Uploads ke baare mein

- `storage/app/public/` mein uploaded files hoti hain
- `public/storage` ek symlink hai jo `storage:link` se banta hai
- Agar images phir bhi nahi aa rahi toh dobara run karo:
  ```bash
  php artisan storage:link
  ```
