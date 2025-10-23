#!/bin/bash
#
# FeedCentral RSS Refresh Script
# Run this script via cron on your self-hosted server (Terraton/Citadel)
#
# Example crontab entry (runs every 15 minutes):
# */15 * * * * /path/to/feedcentral/scripts/refresh-feeds.sh >> /var/log/feedcentral-refresh.log 2>&1
#
# Make executable: chmod +x refresh-feeds.sh

set -euo pipefail

# Configuration
API_URL="${FEEDCENTRAL_API_URL:-https://feedcentral.yourdomain.com}"
CRON_API_KEY="${CRON_API_KEY:-}"
LOG_FILE="${FEEDCENTRAL_LOG:-/var/log/feedcentral-refresh.log}"

# Validate configuration
if [ -z "$CRON_API_KEY" ]; then
  echo "[$(date -Iseconds)] ERROR: CRON_API_KEY environment variable not set" >&2
  exit 1
fi

# Log start
echo "[$(date -Iseconds)] Starting RSS feed refresh"

# Make API request
HTTP_CODE=$(curl -s -o /tmp/feedcentral-response.json -w "%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "X-Cron-Key: ${CRON_API_KEY}" \
  --connect-timeout 10 \
  --max-time 300 \
  "${API_URL}/api/refresh-feeds")

# Check response
if [ "$HTTP_CODE" -eq 200 ]; then
  SUMMARY=$(cat /tmp/feedcentral-response.json | jq -r '.total_new_articles // 0')
  echo "[$(date -Iseconds)] SUCCESS: Refresh completed (HTTP $HTTP_CODE, $SUMMARY new articles)"
  rm -f /tmp/feedcentral-response.json
  exit 0
else
  echo "[$(date -Iseconds)] ERROR: Refresh failed (HTTP $HTTP_CODE)"
  cat /tmp/feedcentral-response.json >&2
  rm -f /tmp/feedcentral-response.json
  exit 1
fi
