# 🏗️ NIRMAAN 2.0 — Construction Workforce & Governance Platform

> *"Your Work. Your Reputation. Your Future."*

NIRMAAN 2.0 is an enterprise-grade, database-driven construction workforce platform built to bring dignity, transparency, and verified credentials to India's skilled tradesmen (masons, electricians, plumbers, painters, carpenters, etc.), homeowners, contractors, and national infrastructure governance bodies.

Transitioned from an early prototype into a full-stack, database-backed application powered by **PHP 8+ (PDO)**, **MySQL (`nirmaan_db`)**, and a responsive **React 19 + TypeScript + Vite + Tailwind CSS** frontend.

---

## 🌟 Key Pillars & Highlights

1. **Genuinely Separate Multi-Role Application Shells:**
   - **WorkerShell:** Mobile-first, tactile UI with daily attendance geo-selfie, milestone earnings, matching jobs, and the flagship digital Nirmaan Work Passport.
   - **HomeownerShell:** Project builder, multi-profession tradesmen discovery, AI estimate assistant simulation, milestone escrow inspection, and two-sided review approvals.
   - **ContractorShell:** Multi-site crew management, site-level muster roll attendance, project progress Gantt-style trackers, sub-contractor job postings, and team wage disbursement.
   - **AdminShell (Nirmaan Control Centre):** Desktop-first institutional command centre with real-time statistics, KYC / trade skill verification queues, job & project monitoring, dispute arbitration, and emergency SOS protocol.

2. **11 Dynamic Profession-Specific Dashboards:**
   - Instead of generic jobs, each artisan sees their specialized trade ecosystem with customized metrics, matching skill tags, trade-specific quick actions, and tailored wage rates:
     - 🧱 `/worker/mason` — Masonry, RCC, Brickwork, Plastering, Foundation
     - ⚡ `/worker/electrician` — House Wiring, DB Installation, Solar Inverters, CCTV
     - 🔧 `/worker/plumber` — Pipe Fitting, Bathroom Drainage, Overhead Tank, Leak Repair
     - 🪚 `/worker/carpenter` — Modular Kitchens, Doors, Framing, Wooden Paneling
     - 🎨 `/worker/painter` — Interior Emulsion, Texture, Exterior Waterproofing
     - 📐 `/worker/tile-worker` — Floor Tiles, Granite Slabs, Wall Cladding, Epoxy Grouting
     - 🧑‍🏭 `/worker/welder` — Structural Fabrication, Grills, MS Gate Welding
     - ❄️ `/worker/hvac` — Split & Central AC, Ducting, Refrigerant Gas Charging
     - 🏠 `/worker/roofer` — Truss Fabrication, Corrugated Sheet Roofing, Terrace Seal
     - 🪵 `/worker/flooring` — Italian Marble Polishing, Hardwood, Kota Stone, Vinyl
     - 🤝 `/worker/helper` — Material Shifting, Concrete Mixing, Site Debris Clearance

3. **Database-Driven Architecture (MySQL + PHP 8):**
   - 24 relational tables in `database/nirmaan.sql` with referential integrity, indexes, and full seed data.
   - Zero hardcoding of worker or platform metrics in JSX; data flows directly from PDO REST endpoints.
   - Centralized API layer (`src/services/api.ts`) with graceful fallback diagnostics.

4. **Digital Nirmaan Work Passport:**
   - Immutable digital identity displaying verified trade skills, historical project evidence photos, homeowner ratings, emergency contact, and QR code verification.

5. **7-Step Artisan Registration:**
   - Comprehensive onboarding capturing trade, micro-skills, daily wage, tools, Aadhaar KYC, and experience.

---

## 🏛️ System Architecture

```
                   ┌──────────────────────────────────────┐
                   │    Vite + React 19 Frontend (TS)     │
                   │  Tailwind CSS • Lucide • Recharts    │
                   │        http://localhost:5173         │
                   └──────────────────┬───────────────────┘
                                      │ REST API (JSON / CORS)
                                      ▼
                   ┌──────────────────────────────────────┐
                   │       PHP 8+ Backend (PDO API)       │
                   │  Auth • Admin • Workers • Jobs • Pay │
                   │  http://localhost/nirmaan/backend/   │
                   └──────────────────┬───────────────────┘
                                      │ PDO MySQL Connection
                                      ▼
                   ┌──────────────────────────────────────┐
                   │           MySQL (nirmaan_db)         │
                   │  24 Tables: users, professions, jobs,│
                   │  passports, attendance, reviews, etc.│
                   └──────────────────────────────────────┘
```

---

## 🗄️ Database Tables (`database/nirmaan.sql`)

1. `roles` (SUPER_ADMIN, WORKER, HOMEOWNER, CONTRACTOR)
2. `professions` (11 distinct trades)
3. `skills` (micro-skills mapped to professions)
4. `users` (credentials, role, status, contact)
5. `worker_profiles` (experience, daily wage, city, passport ID)
6. `worker_skills` (verified skills link table)
7. `homeowner_profiles` (address, preferred contact)
8. `contractor_profiles` (company name, GST, team size)
9. `projects` (project details, budget, timeline, status)
10. `jobs` (individual trade job vacancies)
11. `job_applications` (worker proposals & status)
12. `project_workers` (assigned crew per site)
13. `attendance` (clock-in, clock-out, geo-location, selfie verification)
14. `milestones` (staged payments, inspection criteria, approval status)
15. `work_evidence` (photo proof-of-work, timestamp, progress stage)
16. `work_passports` (composite reputation, ratings, verified badge)
17. `reviews` (two-sided reviews between clients and tradesmen)
18. `payments` (milestone escrow releases, payment IDs)
19. `notifications` (system & site alerts)
20. `verification_requests` (KYC and trade certification queues)
21. `documents` (ID cards, artisan trade certificates)
22. `disputes` (formal mediation cases and status)
23. `emergency_reports` (on-site SOS incidents and responder logs)
24. `admin_logs` (audit trail of administrator actions)

---

## 🚀 Quick Start Guide

### 1. WAMP & MySQL Database Setup
1. Launch **WampServer** and ensure the tray icon is green (Apache & MySQL running).
2. Open phpMyAdmin at `http://localhost/phpmyadmin`.
3. Create database `nirmaan_db` (`utf8mb4_unicode_ci`).
4. Import `database/nirmaan.sql`.
5. Copy or symlink `backend/` into `C:\wamp64\www\nirmaan\backend` (or run `php -S localhost:8000 -t backend`).
6. *For detailed step-by-step instructions, see [`SETUP_PHP_MYSQL.md`](SETUP_PHP_MYSQL.md).*

### 2. Frontend Development Server
```bash
# Install dependencies
npm install

# Run Vite dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Pre-Seeded Login Credentials

| Role | Email / Phone | Password / OTP | Default Route |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@nirmaan.local` | `Admin@123` | `/admin/dashboard` |
| **Worker (Mason)** | `9876543210` / `ramesh@nirmaan.local` | `1234` | `/worker/mason` |
| **Worker (Electrician)** | `9876543212` / `amit@nirmaan.local` | `1234` | `/worker/electrician` |
| **Worker (Plumber)** | `9876543213` / `rajesh@nirmaan.local` | `1234` | `/worker/plumber` |
| **Homeowner** | `9812345678` / `priya@gmail.com` | `1234` | `/homeowner/home` |
| **Contractor** | `9898989898` / `vikram@sharma-infra.com` | `1234` | `/contractor/dashboard` |

---

## 🎭 Guided 25-Step Presentation Demo Flow

Use the floating **Role & Demo Bar** on screen to launch the 25-step automatic walkthrough covering:
1. Homeowner site creation & AI estimation.
2. Artisan discovery and hiring.
3. Mason dashboard with brickwork job matching.
4. Digital Work Passport inspection.
5. Electrician & Plumber specialized dashboard switches.
6. Contractor multi-site muster roll and crew tracking.
7. Super Admin Control Centre, verification queues, and dispute mediation.

---

## Deploy the Frontend to Vercel

Import this GitHub repository into Vercel. The included `vercel.json` configures the Vite production build and single-page app routes. Set the Vercel environment variable `VITE_API_URL` to the public URL of your PHP API, ending in `/api` (for example, `https://your-api-host/backend/api`).

The PHP and MySQL backend is not deployed by this frontend configuration. Host it on a PHP/MySQL provider, configure its database environment variables, and allow your Vercel site origin in the API's CORS settings.

## 🛡️ License & Acknowledgements
Built for the Nirmaan 2.0 Workforce Innovation Initiative.
Designed with accessible, mobile-first touch ergonomics and high-contrast institutional control centre standards.
