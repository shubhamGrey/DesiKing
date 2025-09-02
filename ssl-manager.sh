#!/bin/bash

# SSL Certificate Setup and Management Script for AgroNexis
# This script helps with initial certificate setup and management

set -e

echo "AgroNexis SSL Certificate Management"
echo "====================================="

# Function to check if certificates exist
check_certificates() {
    echo "Checking existing certificates..."
    
    if [ -f "/etc/letsencrypt/live/agronexis.com/fullchain.pem" ]; then
        echo "✓ Certificate for agronexis.com exists"
        certbot certificates | grep "agronexis.com" -A 5
    else
        echo "✗ Certificate for agronexis.com not found"
    fi
    
    if [ -f "/etc/letsencrypt/live/cloud.agronexis.com/fullchain.pem" ]; then
        echo "✓ Certificate for cloud.agronexis.com exists"
        certbot certificates | grep "cloud.agronexis.com" -A 5
    else
        echo "✗ Certificate for cloud.agronexis.com not found"
    fi
}

# Function to obtain initial certificates
obtain_certificates() {
    echo "Obtaining initial certificates..."
    
    # Create webroot directory
    mkdir -p ./certbot-webroot
    
    # Start nginx temporarily for certificate validation
    docker-compose up -d nginx
    
    # Wait a moment for nginx to start
    sleep 10
    
    # Obtain certificate for main domain
    echo "Obtaining certificate for agronexis.com..."
    docker run --rm \
        -v /etc/letsencrypt:/etc/letsencrypt \
        -v /var/lib/letsencrypt:/var/lib/letsencrypt \
        -v $(pwd)/certbot-webroot:/var/www/certbot \
        certbot/certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email admin@agronexis.com \
        --agree-tos \
        --no-eff-email \
        -d agronexis.com \
        -d www.agronexis.com
    
    # Obtain certificate for cloud subdomain
    echo "Obtaining certificate for cloud.agronexis.com..."
    docker run --rm \
        -v /etc/letsencrypt:/etc/letsencrypt \
        -v /var/lib/letsencrypt:/var/lib/letsencrypt \
        -v $(pwd)/certbot-webroot:/var/www/certbot \
        certbot/certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email admin@agronexis.com \
        --agree-tos \
        --no-eff-email \
        -d cloud.agronexis.com \
        -d www.cloud.agronexis.com
    
    echo "Certificates obtained successfully!"
}

# Function to manually renew certificates
manual_renew() {
    echo "Manually renewing certificates..."
    docker run --rm \
        -v /etc/letsencrypt:/etc/letsencrypt \
        -v /var/lib/letsencrypt:/var/lib/letsencrypt \
        -v $(pwd)/certbot-webroot:/var/www/certbot \
        certbot/certbot renew \
        --webroot \
        --webroot-path=/var/www/certbot
    
    # Reload nginx
    docker exec nginx nginx -s reload
    echo "Manual renewal completed!"
}

# Function to test renewal
test_renewal() {
    echo "Testing certificate renewal..."
    docker run --rm \
        -v /etc/letsencrypt:/etc/letsencrypt \
        -v /var/lib/letsencrypt:/var/lib/letsencrypt \
        -v $(pwd)/certbot-webroot:/var/www/certbot \
        certbot/certbot renew \
        --webroot \
        --webroot-path=/var/www/certbot \
        --dry-run
    echo "Renewal test completed!"
}

# Main menu
case "${1:-menu}" in
    "check")
        check_certificates
        ;;
    "obtain")
        obtain_certificates
        ;;
    "renew")
        manual_renew
        ;;
    "test")
        test_renewal
        ;;
    "menu"|*)
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  check   - Check existing certificates"
        echo "  obtain  - Obtain initial certificates"
        echo "  renew   - Manually renew certificates"
        echo "  test    - Test certificate renewal (dry run)"
        echo ""
        echo "Auto-renewal is configured to run daily at 3 AM via the certbot container."
        echo ""
        ;;
esac
