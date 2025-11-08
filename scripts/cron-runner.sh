#!/bin/bash
#
# FeedCentral RSS Cron Jobs
# Run this script via crontab on your VM
#
# Setup:
# 1. chmod +x scripts/cron-runner.sh
# 2. Add to crontab: crontab -e
#    */30 * * * * /path/to/scripts/cron-runner.sh >> /var/log/feedcentral-cron.log 2>&1
#

# Configuration
DOMAIN="https://feedcentral.lyradevstudio.com"
CRON_API_KEY="${CRON_API_KEY}"  # Set this in your environment or pass it below

# Timestamp for logging
echo "==================================================================="
echo "FeedCentral Cron Run - $(date '+%Y-%m-%d %H:%M:%S')"
echo "==================================================================="

# Function to call API endpoint
call_endpoint() {
    local endpoint=$1
    local name=$2
    
    echo ""
    echo "📡 Fetching $name..."
    
    response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
        -H "Authorization: Bearer ${CRON_API_KEY}" \
        -H "Content-Type: application/json" \
        "${DOMAIN}${endpoint}")
    
    http_code=$(echo "$response" | grep HTTP_STATUS | cut -d':' -f2)
    body=$(echo "$response" | sed '/HTTP_STATUS/d')
    
    if [ "$http_code" -eq 200 ]; then
        echo "✅ Success - $name completed"
        echo "$body" | jq -r '.duration // "N/A"' | xargs -I {} echo "   Duration: {}"
        echo "$body" | jq -r '.articles.added // .sources.successful // "N/A"' | xargs -I {} echo "   Items processed: {}"
    else
        echo "❌ Failed - HTTP $http_code"
        echo "$body" | jq -r '.error // "Unknown error"' | xargs -I {} echo "   Error: {}"
    fi
}

# Fetch global RSS feeds
call_endpoint "/api/cron/fetch-feeds" "Global RSS Feeds"

# Fetch user-specific sources
call_endpoint "/api/cron/fetch-user-sources" "User Sources"

echo ""
echo "==================================================================="
echo "Cron run completed - $(date '+%Y-%m-%d %H:%M:%S')"
echo "==================================================================="
echo ""
