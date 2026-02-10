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

### Scenario A: Standard Code Update (Frontend/API Changes)

_Use this for frontend text changes, CSS fixes, or API logic updates._

```bash
# 1. Navigate to project
cd ~/my-blog

# 2. Pull changes
git pull origin main

# 3. Rebuild and restart the web container
docker compose up -d --build web
```

**Note:** This will cause a brief downtime (~10-30 seconds) while the container rebuilds.

---

### Scenario B: Force Clean Rebuild (Package Updates)

_Use when package.json changes or you need to ensure fresh dependencies._

```bash
# 1. Pull changes
git pull origin main

# 2. Force no-cache rebuild to ensure new packages are installed
docker compose build --no-cache web
docker compose up -d
```

---

### Scenario C: Database Schema Changes

_Use this when editing schema.prisma._

```bash
# 1. Pull changes
git pull origin main

# 2. Rebuild app to update Prisma Client
docker compose build --no-cache web
docker compose up -d

# 3. Apply migration
docker compose exec web npx prisma migrate deploy
```

---

### Scenario D: Environment Variable Changes

_Use when .env file is updated._

```bash
# 1. Pull changes (if .env is in git) or manually update .env
git pull origin main

# 2. Restart containers to pick up new env vars
docker compose down
docker compose up -d
```

---

### Scenario E: Full Stack Restart

_Use when you need to restart everything (database, nginx, app)._

```bash
# 1. Stop all containers
docker compose down

# 2. Start all containers
docker compose up -d

# 3. Verify all services are running
docker compose ps
```

---

## 💾 3. Backup & Recovery

### A. Manual Backup

_Creates a compressed SQL dump in your home folder_

```bash
mkdir -p ~/backups
docker compose exec -T postgres pg_dump -U kaushik blogdb | gzip > ~/backups/backup_$(date +%F_%H%M).sql.gz
```

### B. Restore Database

```bash
# 1. Stop the app
docker stop kaushik-blog

# 2. Drop & recreate empty DB
docker exec -it kaushik-postgres psql -U kaushik -d postgres -c "DROP DATABASE blogdb;"
docker exec -it kaushik-postgres psql -U kaushik -d postgres -c "CREATE DATABASE blogdb;"

# 3. Import data (replace 'filename' with your actual backup file)
gunzip -c ~/backups/backup_filename.sql.gz | docker exec -i kaushik-postgres psql -U kaushik -d blogdb

# 4. Restart app
docker start kaushik-blog
```

---

## 🔍 4. Monitoring & Logs

### View Logs

```bash
# View all logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View specific service logs
docker compose logs web
docker compose logs postgres
docker compose logs nginx

# View last 100 lines
docker compose logs --tail=100 web
```

### Check Container Status

```bash
# List all containers
docker compose ps

# Check resource usage
docker stats kaushik-blog kaushik-postgres kaushik-gateway
```

---

## 🛠️ 5. Fixing Common Issues

### Issue 1: "Prisma Client not initialized"

_Cause: Schema changed but the container wasn't rebuilt. Fix:_

```bash
docker compose build --no-cache web
docker compose up -d
```

---

### Issue 2: "Admin Login Fails"

_Fix (Reset Admin):_

```bash
# 1. Delete all users
docker exec -it kaushik-postgres psql -U kaushik -d blogdb -c 'DELETE FROM "User";'

# 2. Run seed script
docker exec -it kaushik-blog npx -y ts-node --transpile-only --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

---

### Issue 3: SSL Certificate Renewal

```bash
# Start certbot container
docker start kaushik-certbot

# OR force renewal
docker compose run --rm certbot renew --force-renewal

# Restart nginx to pick up new certificates
docker restart kaushik-gateway
```

---

### Issue 4: Database Connection Errors

```bash
# 1. Check if postgres is running
docker compose ps postgres

# 2. If not running, start it
docker compose up -d postgres

# 3. Check logs for errors
docker compose logs postgres

# 4. Restart web container
docker compose restart web
```

---

### Issue 5: Port Already in Use

```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill the process (replace PID with actual process ID)
sudo kill -9 PID

# Or use a different port in docker-compose.yml
```

---

## 🧹 6. Maintenance

### Clean Up Docker Resources

_Run once a month to free up disk space from old Docker layers._

```bash
# Remove unused containers, networks, images
docker system prune -f

# Remove unused volumes (BE CAREFUL - this deletes data!)
docker system prune -a --volumes
```

### Update Docker Images

```bash
# Pull latest base images
docker compose pull

# Rebuild with latest images
docker compose build --no-cache
docker compose up -d
```

---

## 🚀 7. Quick Reference Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Restart a specific service
docker compose restart web

# View logs
docker compose logs -f web

# Execute command in container
docker compose exec web npm run build

# Access database shell
docker exec -it kaushik-postgres psql -U kaushik -d blogdb

# Access container shell
docker exec -it kaushik-blog sh
```

---

## ⚠️ Important Notes

1. **Always backup before major changes** (schema migrations, data imports)
2. **Test locally first** before deploying to production
3. **Monitor logs** after deployment to catch errors early
4. **Keep .env secure** - never commit sensitive credentials
5. **SSL certificates auto-renew** via certbot cron job

