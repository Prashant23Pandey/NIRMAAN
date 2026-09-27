# NIRMAAN 2.0 — PHP 8+ & MySQL Setup Guide (WAMP Server)

This guide walks you through setting up and running the database-backed version of **NIRMAAN 2.0** on your local machine using **WAMP Server**, **phpMyAdmin**, and the **Vite React Frontend**.

---

## 🏗️ Architecture Overview

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS (`http://localhost:5173`)
- **Backend:** PHP 8+ REST API with PDO (`http://localhost/nirmaan/backend/api/...` or `http://localhost:8000/api/...`)
- **Database:** MySQL (`nirmaan_db`, default port `3306`)
- **Database GUI:** phpMyAdmin (`http://localhost/phpmyadmin`)

---

## 📋 Prerequisites

1. **WAMP Server** (with Apache 2.4+ and MySQL 8.0+ / MariaDB, PHP 8+) installed (typically at `C:\wamp64`).
2. **Node.js** (v18+) and npm installed.

---

## 🚀 Step-by-Step Setup Instructions

### Step 1: Install / Start WAMP Server
1. Launch **WampServer** from your Start Menu or Desktop shortcut.
2. Check the WAMP tray icon in your Windows Taskbar:
   - 🟢 **Green icon:** All services (Apache & MySQL) are running correctly.
   - 🟠 **Orange icon:** One of the services failed to start (check if port 80 or 3306 is occupied by IIS, Skype, or Docker).

### Step 2: Ensure Apache & MySQL are Running
- Left-click on the green WAMP tray icon.
- Verify **Apache > Service administration > Start/Resume Service** is active.
- Verify **MySQL > Service administration > Start/Resume Service** is active.

### Step 3: Open phpMyAdmin
1. Open your web browser and navigate to:
   ```
   http://localhost/phpmyadmin
   ```
2. Log in using default WAMP credentials:
   - **Username:** `root`
   - **Password:** *(leave blank / empty)*
   - **Server Choice:** MySQL (Port 3306)

### Step 4: Create the Database (`nirmaan_db`)
1. In phpMyAdmin, click on **Databases** tab in the top navigation bar.
2. In the **Create database** input box:
   - Database name: `nirmaan_db`
   - Collation: `utf8mb4_unicode_ci`
3. Click **Create**.

### Step 5: Import `database/nirmaan.sql`
1. Select `nirmaan_db` from the left sidebar database list in phpMyAdmin.
2. Click on the **Import** tab at the top.
3. Click **Choose File** (or "Browse") and select:
   ```
   <YOUR_WORKSPACE_PATH>\database\nirmaan.sql
   ```
   *(e.g., `C:\Users\prash\OneDrive\Desktop\NIRMAAN APP\database\nirmaan.sql`)*
4. Ensure the character set is set to `utf-8`.
5. Scroll down and click **Import** (or **Go**).
6. You will see a success message: `Import has been successfully finished, XX queries executed`.
7. Verify all 24 tables are created:
   - `users`, `roles`, `professions`, `skills`, `worker_profiles`, `worker_skills`, `homeowner_profiles`, `contractor_profiles`, `jobs`, `job_applications`, `projects`, `project_workers`, `attendance`, `work_evidence`, `work_passports`, `reviews`, `payments`, `milestones`, `notifications`, `verification_requests`, `documents`, `disputes`, `emergency_reports`, `admin_logs`.

---

### Step 6: Deploy Backend to WAMP `www` Directory

To make the PHP API accessible under `http://localhost/nirmaan/backend/api/...`:

#### Option A: Copy / Symlink to WAMP `www` (Standard WAMP Approach)
1. In your WAMP installation directory:
   ```
   C:\wamp64\www\
   ```
2. Create a folder named `nirmaan`:
   ```
   C:\wamp64\www\nirmaan\
   ```
3. Copy the entire `backend` and `database` folders into `C:\wamp64\www\nirmaan\`:
   ```
   C:\wamp64\www\nirmaan\
   ├── backend\
   │   ├── api\
   │   ├── config\
   │   ├── middleware\
   └── database\
       └── nirmaan.sql
   ```

#### Option B: Standalone Built-in PHP Development Server (Alternative & Instant)
If you prefer not moving files to `C:\wamp64\www\`, you can start PHP's built-in web server directly from this repository:
```bash
# In NIRMAAN APP root:
php -S localhost:8000 -t backend
```
*(If using Option B, set `VITE_API_URL=http://localhost:8000/api` in your `.env` or the frontend will automatically connect!)*

---

### Step 7: Configure Database Connection
Verify settings in `backend/config/database.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'nirmaan_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_PORT', '3306');
```
If your MySQL root user has a password, update `DB_PASS` accordingly.

---

### Step 8: Test PHP API Endpoints in Your Browser

Verify that Apache and PHP are serving the API correctly:

1. **System Health / Professions API:**
   ```
   http://localhost/nirmaan/backend/api/professions/list.php
   ```
   *Expected Response:* JSON array with all 11 professions (`Mason`, `Electrician`, `Plumber`, `Carpenter`, `Painter`, `Tile Worker`, etc.).

2. **Admin Statistics API:**
   ```
   http://localhost/nirmaan/backend/api/admin/statistics.php
   ```
   *Expected Response:* JSON object with counts for workers, jobs, projects, verified users, charts, and platform activity.

3. **Workers List API:**
   ```
   http://localhost/nirmaan/backend/api/workers/list.php
   ```
   *Expected Response:* Seed workers list (Ramesh Kumar, Sunil Yadav, Amit Kumar, etc.).

---

### Step 9: Start the React Frontend

Open a terminal in the project root:
```bash
npm install
npm run dev
```
The React frontend will launch at:
```
http://localhost:5173
```

---

### Step 10: Demo Logins & Testing Flow

| Role | Username / Email | Password / OTP | Default Route |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@nirmaan.local` | `Admin@123` | `/admin/login` & `/admin/dashboard` |
| **Worker (Mason)** | `9876543210` / `ramesh@nirmaan.local` | OTP `1234` | `/worker/mason` |
| **Worker (Electrician)** | `9876543212` / `amit@nirmaan.local` | OTP `1234` | `/worker/electrician` |
| **Worker (Plumber)** | `9876543213` / `rajesh@nirmaan.local` | OTP `1234` | `/worker/plumber` |
| **Homeowner** | `9812345678` / `priya@gmail.com` | OTP `1234` | `/homeowner/home` |
| **Contractor** | `9898989898` / `vikram@sharma-infra.com` | OTP `1234` | `/contractor/dashboard` |

> **Quick Switcher:** You can also use the floating **Role & Demo Bar** at the top/bottom of any page to quickly toggle roles or run the guided 25-step presentation demo!

---

## 🛠️ Troubleshooting & Error Messages

1. **"Unable to connect to Nirmaan server. Please check that Apache and MySQL are running."**
   - Ensure WAMP tray icon is green.
   - Check if MySQL service is running on port 3306.
   - Check if `nirmaan_db` was created in phpMyAdmin.

2. **CORS Error in Browser Console:**
   - The backend `backend/config/cors.php` is pre-configured to allow `http://localhost:5173` and common local hosts.
   - If running frontend on another port (e.g., `5174`), update `backend/config/cors.php` or `VITE_API_URL`.

3. **Passwords not working:**
   - The passwords in `nirmaan.sql` are securely hashed using PHP `password_hash('Admin@123', PASSWORD_BCRYPT)`.
   - The worker mobile OTP authentication accepts `1234` in demo mode.

---

## 📂 Backend File Structure

```
backend/
├── config/
│   ├── cors.php          # Full CORS headers for Vite frontend
│   └── database.php      # PDO database connection for MySQL
├── middleware/
│   └── auth.php          # Token validation and role permissions
└── api/
    ├── admin/
    │   ├── disputes.php
    │   ├── emergency.php
    │   ├── statistics.php
    │   ├── users.php
    │   └── verification.php
    ├── attendance/
    │   ├── add_photo.php
    │   └── checkin.php
    ├── auth/
    │   ├── login.php
    │   └── register_worker.php
    ├── contractor/
    │   └── dashboard.php
    ├── jobs/
    │   ├── accept.php
    │   ├── create.php
    │   └── list.php
    ├── milestones/
    │   └── approve.php
    ├── payments/
    │   └── list.php
    ├── professions/
    │   ├── create.php
    │   ├── get.php
    │   ├── list.php
    │   └── update.php
    ├── projects/
    │   ├── create.php
    │   ├── get.php
    │   └── list.php
    ├── reviews/
    │   └── create.php
    ├── skills/
    │   ├── create.php
    │   └── list.php
    └── workers/
        ├── dashboard.php
        ├── get.php
        └── list.php
```
