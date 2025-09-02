#!/bin/bash

# ACME Challenge Test Script
# This script helps debug SSL certificate renewal issues

echo "ACME Challenge Debug Script"
echo "=========================="

# Create test files in webroot
echo "Creating test files..."
mkdir -p ./certbot-webroot/.well-known/acme-challenge/
echo "test-content-$(date)" > ./certbot-webroot/.well-known/acme-challenge/test-file

# Set proper permissions
echo "Setting permissions..."
chmod -R 755 ./certbot-webroot/
chmod 644 ./certbot-webroot/.well-known/acme-challenge/test-file

# Test nginx configuration
echo "Testing nginx configuration..."
docker exec nginx nginx -t
if [ $? -eq 0 ]; then
    echo "✓ Nginx configuration is valid"
else
    echo "✗ Nginx configuration has errors"
    exit 1
fi

# Test file accessibility from inside containers
echo "Testing file access from nginx container..."
docker exec nginx ls -la /var/www/certbot/.well-known/acme-challenge/
docker exec nginx cat /var/www/certbot/.well-known/acme-challenge/test-file

# Test HTTP access
echo "Testing HTTP access..."
echo "Testing agronexis.com:"
curl -I "http://agronexis.com/.well-known/acme-challenge/test-file"
echo ""

echo "Testing www.agronexis.com:"
curl -I "http://www.agronexis.com/.well-known/acme-challenge/test-file"
echo ""

# Test with wget (more verbose)
echo "Testing with wget (verbose)..."
wget --spider --server-response "http://agronexis.com/.well-known/acme-challenge/test-file" 2>&1 | head -20

# Check if webroot directory exists and has content
echo "Checking webroot directory structure..."
echo "Host directory:"
ls -la ./certbot-webroot/
ls -la ./certbot-webroot/.well-known/ 2>/dev/null || echo "No .well-known directory"
ls -la ./certbot-webroot/.well-known/acme-challenge/ 2>/dev/null || echo "No acme-challenge directory"

echo "Container directory:"
docker exec nginx ls -la /var/www/certbot/ 2>/dev/null || echo "No /var/www/certbot directory in nginx"

# Clean up test file
echo "Cleaning up test file..."
rm -f ./certbot-webroot/.well-known/acme-challenge/test-file

echo "Debug script completed!"
echo ""
echo "If the HTTP tests fail, check:"
echo "1. Docker containers are running: docker ps"
echo "2. Port 80 is accessible from outside"
echo "3. Domain DNS points to your server"
echo "4. Firewall allows HTTP traffic"
