#!/bin/bash
# =============================================================================
# init-ssl.sh — Force-renew the SSL certificate for desikingspices.com
#
# Run this ONCE on the server when the cert has expired or for initial setup:
#   chmod +x scripts/init-ssl.sh
#   sudo ./scripts/init-ssl.sh
#
# Prerequisites: Docker, docker-compose running, ports 80/443 accessible
# =============================================================================

set -e

DOMAIN="desikingspices.com"
EMAIL="care@agronexis.com"    # ← change to your real email for expiry alerts
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Starting SSL certificate renewal for $DOMAIN"
echo "==> Project directory: $PROJECT_DIR"

cd "$PROJECT_DIR"

# Ensure nginx is running so ACME challenges can be served
echo "==> Making sure nginx is up..."
docker compose up -d nginx

# Give nginx a moment to start
sleep 3

# Force-renew (or issue new) cert via webroot challenge
echo "==> Running certbot to issue/renew certificate..."
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --force-renewal \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  -d "cloud.$DOMAIN"

# Reload nginx so it picks up the new certificate without downtime
echo "==> Reloading nginx..."
docker exec nginx nginx -s reload

echo ""
echo "==> Done! Certificate renewed for $DOMAIN"
echo "==> New expiry:"
docker compose run --rm certbot certificates 2>/dev/null | grep -A3 "$DOMAIN" || \
  openssl x509 -noout -dates -in /etc/letsencrypt/live/$DOMAIN/cert.pem 2>/dev/null || true
