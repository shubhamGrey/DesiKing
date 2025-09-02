#!/bin/bash

# SSL Certificate Auto-Renewal Script for AgroNexis
# This script runs certbot renewal and reloads nginx if certificates are renewed

echo "$(date): Starting certificate renewal check..."

# Ensure webroot directory exists with proper permissions
mkdir -p /var/www/certbot/.well-known/acme-challenge
chmod -R 755 /var/www/certbot

# Run certbot renewal with verbose logging
echo "$(date): Running certbot renewal..."
certbot renew \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email admin@agronexis.com \
    --agree-tos \
    --no-eff-email \
    --verbose

# Check if renewal was successful and reload nginx
if [ $? -eq 0 ]; then
    echo "$(date): Certificate renewal check completed successfully"
    
    # Reload nginx to use new certificates (if any were renewed)
    echo "$(date): Reloading nginx..."
    docker exec nginx nginx -s reload
    
    if [ $? -eq 0 ]; then
        echo "$(date): Nginx reloaded successfully"
    else
        echo "$(date): Error: Failed to reload nginx"
    fi
else
    echo "$(date): Error: Certificate renewal failed"
fi

echo "$(date): Certificate renewal process completed"
