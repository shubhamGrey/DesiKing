#!/bin/bash

# Quick Fix Script for ACME Challenge Issues
echo "Fixing ACME Challenge Issues..."

# 1. Ensure webroot directory exists with proper permissions
echo "Setting up webroot directory..."
mkdir -p ./certbot-webroot/.well-known/acme-challenge
chmod -R 755 ./certbot-webroot
chown -R 1000:1000 ./certbot-webroot 2>/dev/null || true

# 2. Restart nginx to reload configuration
echo "Restarting nginx to reload configuration..."
docker-compose restart nginx

# 3. Wait for nginx to start
sleep 5

# 4. Test nginx configuration
echo "Testing nginx configuration..."
docker exec nginx nginx -t

# 5. Test ACME challenge path
echo "Testing ACME challenge path..."
echo "test-$(date +%s)" > ./certbot-webroot/.well-known/acme-challenge/test
curl -f "http://agronexis.com/.well-known/acme-challenge/test" && echo "✓ ACME challenge working" || echo "✗ ACME challenge failed"
rm -f ./certbot-webroot/.well-known/acme-challenge/test

# 6. Run a dry-run test
echo "Running certbot dry-run test..."
docker run --rm \
    -v /etc/letsencrypt:/etc/letsencrypt \
    -v /var/lib/letsencrypt:/var/lib/letsencrypt \
    -v $(pwd)/certbot-webroot:/var/www/certbot \
    certbot/certbot renew \
    --webroot \
    --webroot-path=/var/www/certbot \
    --dry-run

echo "Fix script completed!"
echo ""
echo "If issues persist, run: ./debug-acme.sh"
