#!/bin/bash

# FeedCentral - Cleanup Articles Script
# This script triggers the article cleanup endpoint to prevent database saturation

DOMAIN="your-domain.com"
ENDPOINT="https://${DOMAIN}/api/cron/cleanup-articles"
API_KEY="your-api-key-here"
LOG_FILE="/var/log/feedcentral-cleanup.log"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Execute the request
log "Starting article cleanup..."

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    --max-time 300)

# Extract HTTP status code (last line)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
# Extract response body (everything except last line)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    log "✓ Article cleanup successful (HTTP $HTTP_CODE)"
    log "Response: $BODY"
    
    # Parse and log cleanup stats if possible
    SOFT_DELETED=$(echo "$BODY" | grep -oP '"softDeleted":\K\d+' || echo "N/A")
    ARCHIVED=$(echo "$BODY" | grep -oP '"archived":\K\d+' || echo "N/A")
    HARD_DELETED=$(echo "$BODY" | grep -oP '"hardDeleted":\K\d+' || echo "N/A")
    
    log "Stats: Soft-deleted: $SOFT_DELETED | Archived: $ARCHIVED | Hard-deleted: $HARD_DELETED"
else
    log "✗ Article cleanup failed (HTTP $HTTP_CODE)"
    log "Error: $BODY"
    exit 1
fi

log "Article cleanup completed"
