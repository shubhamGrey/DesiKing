#!/bin/bash
# =============================================================================
# setup-cron.sh — Install the SSL auto-renewal cron job (run once on server)
#
#   chmod +x scripts/setup-cron.sh
#   sudo ./scripts/setup-cron.sh
# =============================================================================

set -e

SCRIPT_PATH="$(cd "$(dirname "$0")" && pwd)/renew-ssl.sh"
CRON_LOG="/var/log/ssl-renew.log"
CRON_ENTRY="0 3 * * * $SCRIPT_PATH >> $CRON_LOG 2>&1"

# Ensure the renewal script is executable
chmod +x "$SCRIPT_PATH"

# Create log file if it doesn't exist
touch "$CRON_LOG"

# Add cron job only if it isn't already present
if crontab -l 2>/dev/null | grep -qF "$SCRIPT_PATH"; then
  echo "Cron job already installed:"
  crontab -l | grep "$SCRIPT_PATH"
else
  # Append to existing crontab (preserves other entries)
  (crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -
  echo "Cron job installed:"
  echo "  $CRON_ENTRY"
fi

echo ""
echo "Renewal will run daily at 03:00. Logs: $CRON_LOG"
echo ""
echo "To verify:  sudo crontab -l"
echo "To monitor: sudo tail -f $CRON_LOG"
