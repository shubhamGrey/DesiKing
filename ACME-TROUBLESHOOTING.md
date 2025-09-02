# SSL Certificate Renewal Troubleshooting Guide

## Issue: 404 Error on ACME Challenge

The error you're seeing indicates that Let's Encrypt cannot access the ACME challenge files through HTTP.

### Quick Fix Steps

1. **Run the fix script:**

   ```bash
   ./fix-acme.sh
   ```

2. **If that doesn't work, try manual debugging:**
   ```bash
   ./debug-acme.sh
   ```

### Root Causes and Solutions

#### 1. Directory Permissions

**Problem:** The webroot directory doesn't exist or has wrong permissions.
**Solution:**

```bash
mkdir -p ./certbot-webroot/.well-known/acme-challenge
chmod -R 755 ./certbot-webroot
```

#### 2. Nginx Configuration

**Problem:** Nginx location block isn't configured correctly.
**Solution:** The nginx.conf has been updated with:

```nginx
location ^~ /.well-known/acme-challenge/ {
    root /var/www/certbot;
    default_type "text/plain";
    try_files $uri =404;
}
```

#### 3. Volume Mount Issues

**Problem:** Docker volume mounts aren't working correctly.
**Solution:** Updated docker-compose.yml with proper volume mapping:

```yaml
volumes:
  - ./certbot-webroot:/var/www/certbot:rw # For certbot
  - ./certbot-webroot:/var/www/certbot:ro # For nginx
```

#### 4. Container Communication

**Problem:** Containers can't access shared volumes.
**Solution:** Restart containers in correct order:

```bash
docker-compose down
docker-compose up -d nginx
sleep 5
docker-compose up -d certbot
```

### Manual Testing Steps

1. **Test file creation:**

   ```bash
   echo "test" > ./certbot-webroot/.well-known/acme-challenge/test
   ```

2. **Test HTTP access:**

   ```bash
   curl -v http://agronexis.com/.well-known/acme-challenge/test
   ```

3. **Test from inside nginx container:**

   ```bash
   docker exec nginx cat /var/www/certbot/.well-known/acme-challenge/test
   ```

4. **Clean up test file:**
   ```bash
   rm ./certbot-webroot/.well-known/acme-challenge/test
   ```

### Certificate Renewal Commands

#### Dry Run Test (Recommended first)

```bash
docker run --rm \
    -v /etc/letsencrypt:/etc/letsencrypt \
    -v /var/lib/letsencrypt:/var/lib/letsencrypt \
    -v $(pwd)/certbot-webroot:/var/www/certbot \
    certbot/certbot renew \
    --webroot \
    --webroot-path=/var/www/certbot \
    --dry-run
```

#### Force Renewal (Use carefully)

```bash
docker run --rm \
    -v /etc/letsencrypt:/etc/letsencrypt \
    -v /var/lib/letsencrypt:/var/lib/letsencrypt \
    -v $(pwd)/certbot-webroot:/var/www/certbot \
    certbot/certbot renew \
    --webroot \
    --webroot-path=/var/www/certbot \
    --force-renewal
```

### Common Issues

#### Issue: "Connection refused"

- Check if nginx is running: `docker ps | grep nginx`
- Check port 80 is accessible: `curl -I http://agronexis.com`

#### Issue: "403 Forbidden"

- Check directory permissions: `ls -la ./certbot-webroot/`
- Ensure nginx can read the files: `docker exec nginx ls -la /var/www/certbot/`

#### Issue: "Domain validation failed"

- Verify DNS points to your server: `dig agronexis.com`
- Check firewall allows HTTP traffic on port 80

### Network Troubleshooting

1. **Check if domains resolve to your server:**

   ```bash
   dig agronexis.com +short
   dig www.agronexis.com +short
   ```

2. **Test HTTP connectivity:**

   ```bash
   curl -I http://agronexis.com
   curl -I http://www.agronexis.com
   ```

3. **Check from external source:**
   ```bash
   # From another server/location
   curl -I http://agronexis.com/.well-known/acme-challenge/
   ```

### Files Created/Modified

- `fix-acme.sh` - Quick fix script
- `debug-acme.sh` - Comprehensive debugging
- `certbot-renew.sh` - Updated with better logging
- `docker-compose.yml` - Fixed volume mounts
- `UI/nginx/nginx.conf` - Updated ACME location blocks
- `certbot-webroot/` - Created directory structure

### Success Indicators

✅ HTTP test returns 200: `curl -I http://agronexis.com/.well-known/acme-challenge/test`  
✅ Nginx config is valid: `docker exec nginx nginx -t`  
✅ Dry run succeeds: `certbot renew --dry-run`  
✅ Directory accessible: `docker exec nginx ls /var/www/certbot/.well-known/acme-challenge/`

### Next Steps After Fix

1. Run dry-run test to verify fix works
2. Run actual renewal if dry-run succeeds
3. Monitor logs for future renewals
4. Set up monitoring/alerting for certificate expiry
