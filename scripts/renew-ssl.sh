#!/bin/bash
# =============================================================================
# renew-ssl.sh — Auto-renew SSL certificates for desikingspices.com
#
# This script is called by cron. It only renews when the cert is within
# 30 days of expiry (certbot's default threshold).
#
# Cron setup (run as root):
#   sudo crontab -e
#   Add:  0 3 * * * /path/to/DesiKing/scripts/renew-ssl.sh >> /var/log/ssl-renew.log 2>&1
#
# This runs daily at 3 AM. Certbot will only renew if needed.
# =============================================================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_TAG="[ssl-renew]"
DOMAIN="desikingspices.com"

echo "$LOG_TAG $(date '+%Y-%m-%d %H:%M:%S') Starting renewal check for $DOMAIN"

cd "$PROJECT_DIR"

# Check if nginx is running; if not, skip (avoids renewing with the service down)
if ! docker ps --format '{{.Names}}' | grep -q '^nginx$'; then
  echo "$LOG_TAG nginx container is not running, skipping renewal"
  exit 1
fi

# Run certbot renew — only acts if cert expires within 30 days
RENEW_OUTPUT=$(docker compose run --rm certbot renew \
  --webroot \
  --webroot-path /var/www/certbot \
  --quiet \
  2>&1)

echo "$RENEW_OUTPUT"

# Reload nginx only if a cert was actually renewed
if echo "$RENEW_OUTPUT" | grep -q "Successfully renewed\|Congratulations"; then
  echo "$LOG_TAG Certificate renewed — reloading nginx"
  docker exec nginx nginx -s reload
  echo "$LOG_TAG nginx reloaded successfully"
else
  echo "$LOG_TAG No renewal needed or renewal skipped"
fi

echo "$LOG_TAG $(date '+%Y-%m-%d %H:%M:%S') Done"
