#!/bin/bash

# SSL Certificate Auto-Renewal Script for AgroNexis
# This script runs certbot renewal and reloads nginx if certificates are renewed

echo "$(date): Starting certificate renewal check..."

# Run certbot renewal
certbot renew --webroot --webroot-path=/var/www/certbot --quiet

# Check if renewal was successful and reload nginx
if [ $? -eq 0 ]; then
    echo "$(date): Certificate renewal check completed successfully"
    
    # Reload nginx to use new certificates (if any were renewed)
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
