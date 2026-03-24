#!/bin/bash
# =============================================================================
# renew-ssl.sh — Auto-renew SSL certificates for desikingspices.com
#
# Uses standalone mode: stops nginx for ~10 seconds, runs certbot, restarts nginx.
# Certbot only renews when cert expires within 30 days (or is already expired).
#
# Cron setup (run scripts/setup-cron.sh once, or manually):
#   sudo crontab -e
#   Add:  0 3 * * * /var/www/agronexis/scripts/renew-ssl.sh >> /var/log/ssl-renew.log 2>&1
# =============================================================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_TAG="[ssl-renew]"
CERT="/etc/letsencrypt/live/desikingspices.com/cert.pem"

echo "$LOG_TAG $(date '+%Y-%m-%d %H:%M:%S') Starting renewal check"

cd "$PROJECT_DIR"

# Check if nginx is running
if ! docker ps --format '{{.Names}}' | grep -q '^nginx$'; then
  echo "$LOG_TAG nginx is not running — skipping"
  exit 1
fi

# Check if renewal is needed (expired or within 30 days)
if openssl x509 -checkend $((30 * 86400)) -noout -in "$CERT" 2>/dev/null; then
  echo "$LOG_TAG Certificate valid for more than 30 days — no action needed"
  exit 0
fi

echo "$LOG_TAG Renewal needed — stopping nginx briefly"
docker compose stop nginx

docker run --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -p 80:80 \
  certbot/certbot certonly --standalone \
  --non-interactive \
  --agree-tos \
  --no-eff-email \
  --email care@agronexis.com \
  --force-renewal \
  -d desikingspices.com \
  -d www.desikingspices.com \
  -d cloud.desikingspices.com

docker compose up -d nginx

echo "$LOG_TAG $(date '+%Y-%m-%d %H:%M:%S') Certificate renewed — nginx restarted"
