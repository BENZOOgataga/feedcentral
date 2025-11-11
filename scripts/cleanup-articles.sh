#!/bin/bash

# FeedCentral - Cleanup Articles Script
# This script triggers the article cleanup endpoint to prevent database saturation

DOMAIN="your-domain.com"
ENDPOINT="https://${DOMAIN}/api/cron/cleanup-articles"
USER_ENDPOINT="https://${DOMAIN}/api/cron/cleanup-user-articles"
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

# Now trigger user-articles cleanup on the same domain (reuses API key)
log "Starting user-article cleanup..."

RESPONSE_UA=$(curl -s -w "\n%{http_code}" -X POST "$USER_ENDPOINT" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    --max-time 300)

HTTP_CODE_UA=$(echo "$RESPONSE_UA" | tail -n 1)
BODY_UA=$(echo "$RESPONSE_UA" | sed '$d')

if [ "$HTTP_CODE_UA" -eq 200 ]; then
    log "✓ User-article cleanup successful (HTTP $HTTP_CODE_UA)"
    log "Response: $BODY_UA"
    SOFT_DELETED_UA=$(echo "$BODY_UA" | grep -oP '"softDeleted":\K\d+' || echo "N/A")
    ARCHIVED_UA=$(echo "$BODY_UA" | grep -oP '"archived":\K\d+' || echo "N/A")
    HARD_DELETED_UA=$(echo "$BODY_UA" | grep -oP '"hardDeleted":\K\d+' || echo "N/A")
    log "Stats (user articles): Soft-deleted: $SOFT_DELETED_UA | Archived-marked: $ARCHIVED_UA | Hard-deleted: $HARD_DELETED_UA"
elif [ "$HTTP_CODE_UA" -eq 405 ]; then
    # Method not allowed — try GET as a fallback (some deployments only accept GET)
    log "User-article cleanup POST returned 405, retrying with GET..."
    RESPONSE_UA_GET=$(curl -s -w "\n%{http_code}" -X GET "$USER_ENDPOINT" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        --max-time 300)
    HTTP_CODE_UA_GET=$(echo "$RESPONSE_UA_GET" | tail -n 1)
    BODY_UA_GET=$(echo "$RESPONSE_UA_GET" | sed '$d')

    if [ "$HTTP_CODE_UA_GET" -eq 200 ]; then
        log "✓ User-article cleanup successful via GET (HTTP $HTTP_CODE_UA_GET)"
        log "Response: $BODY_UA_GET"
        SOFT_DELETED_UA=$(echo "$BODY_UA_GET" | grep -oP '"softDeleted":\K\d+' || echo "N/A")
        ARCHIVED_UA=$(echo "$BODY_UA_GET" | grep -oP '"archived":\K\d+' || echo "N/A")
        HARD_DELETED_UA=$(echo "$BODY_UA_GET" | grep -oP '"hardDeleted":\K\d+' || echo "N/A")
        log "Stats (user articles): Soft-deleted: $SOFT_DELETED_UA | Archived-marked: $ARCHIVED_UA | Hard-deleted: $HARD_DELETED_UA"
    else
        log "! User-article cleanup failed via GET (HTTP $HTTP_CODE_UA_GET) — non-fatal, continuing"
        log "Error: $BODY_UA_GET"
    fi
else
    log "! User-article cleanup failed (HTTP $HTTP_CODE_UA) — non-fatal, continuing"
    log "Error: $BODY_UA"
fi

log "User-article cleanup completed"
