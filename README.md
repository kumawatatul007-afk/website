# MMB IT Solutions — Laravel + React (Inertia.js)

## Git Clone ke Baad Setup (Fresh Install)

Jab bhi naye machine pe ya fresh clone karo, ye steps follow karo:

### Step 1 — PHP Dependencies Install karo
```bash
composer install
```

### Step 2 — .env File Banao
```bash
cp .env.example .env
php artisan key:generate
```

### Step 3 — Database Setup karo
`.env` file mein check karo:
```
DB_CONNECTION=sqlite
```
SQLite use ho raha hai to koi change nahi chahiye. Phir:
```bash
php artisan migrate --seed
```
Ye command:
- Saari tables banayegi
- Admin user create karega (email: `admin@mora.com`, password: `admin123`)
- Site settings aur services seed karega

### Step 4 — Storage Link banao
```bash
php artisan storage:link
```

### Step 5 — Node Modules Install karo
```bash
npm install
```

### Step 6 — Frontend Build karo
```bash
npm run build
```
> **Note:** `npm run dev` sirf development ke liye hai. Production ya testing ke liye `npm run build` use karo.

### Step 7 — Server Chalao
```bash
php artisan serve
```
Site ab `http://localhost:8000` pe chalegi.

---

## Kya Git Mein Nahi Hota (Isliye Clone ke Baad Setup Zaroori Hai)

| File/Folder | Reason |
|---|---|
| `/vendor` | PHP packages — `composer install` se aata hai |
| `/node_modules` | JS packages — `npm install` se aata hai |
| `/public/build` | Compiled JS/CSS — `npm run build` se banta hai |
| `.env` | Secrets/config — manually banao |
| `database.sqlite` | Database — `migrate --seed` se banta hai |
| `storage/*.key` | App keys — `key:generate` se banta hai |

---

## Admin Panel
URL: `/admin/login`
- Email: `admin@mora.com`
- Password: `admin123`

---

## Common Issues

**Services/Keywords 404 aa raha hai?**
Database mein data nahi hai. Run karo:
```bash
php artisan db:seed
```

**CSS/JS nahi load ho raha?**
```bash
npm run build
```

**Images nahi dikh rahi?**
```bash
php artisan storage:link
```
