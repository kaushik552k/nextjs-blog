# 🚀 Next.js Blog Application

A full-stack, production-ready blog platform built with a focus on type-safety, performance, and containerized deployment.

---
## 🛠️ Tech Stack

### Frontend

| Category         | Technology                                        |
| :--------------- | :------------------------------------------------ |
| **Framework**    | Next.js 16 (App Router)                           |
| **Language**     | TypeScript (Strict Mode)                          |
| **Styling**      | Tailwind CSS                                      |
| **Rendering**    | React Server Components (RSC) + Client Components |
| **Optimization** | `next/image`, `next/font`                         |
| **Build Tool**   | Turbopack                                         |

### Backend & Database

| Category             | Technology                          |
| :------------------- | :---------------------------------- |
| **Database**         | PostgreSQL 15 (Alpine Docker Image) |
| **ORM**              | Prisma (Schema-first)               |
| **Authentication**   | Auth.js (v5) / NextAuth             |
| **Security**         | Bcrypt.js (Password Hashing)        |
| **API Architecture** | Next.js API Routes & Server Actions |
| **Reverse Proxy**    | Nginx (SSL Termination)             |
| **SSL**              | Certbot (Let's Encrypt)             |

---

## ✨ Key Features & Implementation

- **Rich Content Storage:** Leverages PostgreSQL `JSONB` to store flexible content blocks (e.g., code, text, images).
- **Type-Safe Ecosystem:** End-to-end type safety using auto-generated Prisma Clients and TypeScript strict mode.
- **Admin Dashboard:** Secure management interface protected by NextAuth middleware.
- **Advanced Dockerization:** - **Multi-stage builds:** Optimized "Builder" vs "Runner" stages to minimize production image footprint.
  - **Cross-Platform:** Custom `binaryTargets` for ARM64/AMD64 compatibility.
- **Automated Seeding:** Custom TypeScript scripts for automated database population and relation handling.

---

## 🏗️ Project Structure

```bash
/my-nextjs-blog/
├── app/                  # App Router Source
│   ├── (main)/           # Public facing pages (Blog, Home)
│   ├── admin/            # Protected Admin Dashboard
│   ├── api/              # API Endpoints (Auth, Data)
│   ├── auth/             # Login/Register Pages
│   └── data/             # Mock data & Seed content
├── prisma/               # Database Layer
│   ├── migrations/       # SQL Migration history
│   ├── schema.prisma     # DB Source of Truth
│   └── seed.ts           # Database populator
├── nginx/                # Web Server Config
│   └── default.conf      # Reverse Proxy settings
├── lib/                  # Shared utilities (Prisma singleton)
├── docker-compose.yml    # Orchestration Config
├── Dockerfile            # Multi-stage Production Recipe
└── middleware.ts         # Auth protection rules
```
