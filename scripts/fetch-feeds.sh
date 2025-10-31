#!/bin/bash

# FeedCentral - Fetch Feeds Script
# This script triggers the feed refresh endpoint

DOMAIN="your-domain.com"
ENDPOINT="https://${DOMAIN}/api/cron/fetch-feeds"
API_KEY="your-api-key-here"
LOG_FILE="/var/log/feedcentral-fetch.log"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Execute the request
log "Starting feed refresh..."

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    --max-time 300)

# Extract HTTP status code (last line)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
# Extract response body (everything except last line)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    log "✓ Feed refresh successful (HTTP $HTTP_CODE)"
    log "Response: $BODY"
else
    log "✗ Feed refresh failed (HTTP $HTTP_CODE)"
    log "Error: $BODY"
    exit 1
fi

log "Feed refresh completed"
