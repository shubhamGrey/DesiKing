
# 📘 Project Overview

This is a full-stack web application built with **Next.js (Pages Router)**, integrated with a **Nextcloud backend** for file uploads, and a **.NET backend API**. The project runs via **Docker Compose** and serves traffic through **NGINX** with automatic HTTPS support (Let's Encrypt).

---

## 🚀 Features

- ✅ Next.js frontend with Pages Router
- 🔐 Secure NGINX reverse proxy with TLS for:
  - `agronexis.com` (Next.js)
  - `cloud.agronexis.com` (Nextcloud)
- 🗃️ File upload to Nextcloud via WebDAV API
- 🧠 Backend API (ASPNET Core) proxied through NGINX
- 🐳 Full Docker Compose orchestration (frontend, backend, DBs, NGINX)

---

## 🛠 Getting Started

### 1. Clone & Setup Environment

```bash
git clone https://your-repo-url.git
cd your-project
cp .env.example .env.local
```

Set environment variables like:

```env
NEXTCLOUD_URL=https://cloud.agronexis.com/remote.php/dav/files/<username>/
NEXTCLOUD_USERNAME=your-username
NEXTCLOUD_PASSWORD=your-app-password
```

---

### 2. Run with Docker

```bash
docker-compose up --build
```

- App: [https://agronexis.com](https://agronexis.com)
- Nextcloud: [https://cloud.agronexis.com](https://cloud.agronexis.com)
- Backend API: proxied under `/api/` on the main domain

---

### 3. Development (Optional)

```bash
cd UI
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 📤 File Upload to Nextcloud

- Files uploaded via the frontend are sent to `/api/upload`
- The backend API uploads to Nextcloud using WebDAV
- Uploaded file URL is returned in the response

---

## 🔧 SSL Configuration

- Certbot auto-generates certs via Let's Encrypt:
  - `agronexis.com`: `/etc/letsencrypt/live/agronexis.com/`
  - `cloud.agronexis.com`: `/etc/letsencrypt/live/cloud.agronexis.com/`
- Mounted into Docker and used in NGINX config
- Supports automatic HTTPS redirection

---

## 📦 Tech Stack

- **Frontend**: Next.js, TypeScript, React
- **Backend**: ASP.NET Core API
- **Storage**: Nextcloud, PostgreSQL, MariaDB
- **Orchestration**: Docker Compose
- **Proxy**: NGINX
- **SSL**: Let's Encrypt + Certbot

---

## 📁 Project Structure

```
UI/                 ← Next.js frontend
Backend/            ← ASP.NET backend
docker-compose.yml  ← Multi-service orchestration
nginx/              ← NGINX reverse proxy config
```

---

## 🔒 Security Tips

- Use **Nextcloud app passwords**, not main passwords.
- Don't store sensitive keys in code — use `.env` and Docker secrets.
- Regularly renew and check certs: `sudo certbot renew --dry-run`

---

## 📚 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Nextcloud WebDAV API](https://docs.nextcloud.com/server/latest/user_manual/files/access_webdav.html)
- [Docker Compose](https://docs.docker.com/compose/)
- [Certbot](https://certbot.eff.org/instructions)
