# 🛠️ Deployment & Maintenance Master Guide

This guide contains the exact commands and workflows for managing the blog application.

> **Note:** All commands are mapped to the active container names: `kaushik-blog`, `kaushik-gateway`, and `kaushik-postgres`.

---

## 📋 1. Container Reference Table

Keep this mapping in mind. **Docker Compose** commands use the _Service Name_, while **direct Docker** commands use the _Container Name_.

| Component       | Service Name (Compose) | Container Name (Real) | Port   |
| :-------------- | :--------------------- | :-------------------- | :----- |
| **Next.js App** | `web`                  | `kaushik-blog`        | 3000   |
| **Database**    | `postgres`             | `kaushik-postgres`    | 5432   |
| **Nginx**       | `nginx`                | `kaushik-gateway`     | 80/443 |
| **Certbot**     | `certbot`              | `kaushik-certbot`     | -      |

---

## 🔄 2. Deployment Workflows

### Scenario A: Standard Code Update

_Use this for frontend text changes, CSS fixes, or API logic updates._

```bash
# 1. Navigate to project
cd ~/my-blog

# 2. Pull changes
git pull origin main

# 3. Smart Rebuild (Zero downtime for DB/Nginx)
docker compose up -d --build web
```

```bash
# Force 'no-cache' to ensure new packages are installed
docker compose build --no-cache web
docker compose up -d
```

### Scenario C: Database Schema Changes

_Use this when editing schema.prisma._

```Bash

git pull origin main

# 1. Rebuild App to update Prisma Client
docker compose build --no-cache web
docker compose up -d

# 2. Apply Migration
docker compose exec web npx prisma migrate deploy
```

## 💾 3. Backup & Recovery

### A. Manual Backup

_Creates a compressed SQL dump in your home folder_

```bash
mkdir -p ~/backups
docker compose exec -T postgres pg_dump -U kaushik blogdb | gzip > ~/backups/backup_$(date +%F_%H%M).sql.gz
```

### B. Restore Database

```Bash

# 1. Stop the App
docker stop kaushik-blog

# 2. Drop & Recreate Empty DB
docker exec -it kaushik-postgres psql -U kaushik -d postgres -c "DROP DATABASE blogdb;"
docker exec -it kaushik-postgres psql -U kaushik -d postgres -c "CREATE DATABASE blogdb;"

# 3. Import Data (Replace 'filename' with your actual backup file)
gunzip -c ~/backups/backup_filename.sql.gz | docker exec -i kaushik-postgres psql -U kaushik -d blogdb

# 4. Restart App
docker start kaushik-blog
```

🔍 4. Troubleshooting Commands

## 🛠️ 5. Fixing Common Issues

### Issue 1: "Prisma Client not initialized"

_Cause: Schema changed but the container wasn't rebuilt. Fix:_

```Bash

docker compose build --no-cache web
docker compose up -d
```

### Issue 2: "Admin Login Fails"

_Fix (Reset Admin):_

```Bash

# 1. Delete all users
docker exec -it kaushik-postgres psql -U kaushik -d blogdb -c 'DELETE FROM "User";'

# 2. Run Seed Script
docker exec -it kaushik-blog npx -y ts-node --transpile-only --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

### Issue 3: SSL Certificate Renewal

```Bash

docker start kaushik-certbot
# OR force renewal
docker compose run --rm certbot renew --force-renewal
docker restart kaushik-gateway
```

## 🧹 6. Maintenance

_Run once a month to free up disk space from old Docker layers._

```Bash

docker system prune -f
`
```
