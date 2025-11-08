#!/bin/bash
#
# Quick Cron Setup for FeedCentral
# Copy-paste these commands on your VM
#

# 1. Generate a secure API key
echo "Generating secure API key..."
API_KEY=$(openssl rand -base64 32)
echo "Your CRON_API_KEY: $API_KEY"
echo ""
echo "⚠️  SAVE THIS KEY - Add it to Vercel environment variables:"
echo "   echo \"$API_KEY\" | vercel env add CRON_API_KEY production"
echo ""

# 2. Add to environment
echo "Adding to ~/.bashrc..."
echo "export CRON_API_KEY=\"$API_KEY\"" >> ~/.bashrc
source ~/.bashrc

# 3. Make script executable
chmod +x scripts/cron-runner.sh

# 4. Create log directory
sudo mkdir -p /var/log
sudo touch /var/log/feedcentral-cron.log
sudo chmod 666 /var/log/feedcentral-cron.log

# 5. Get current script path
SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/cron-runner.sh"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Add this line to your crontab (run: crontab -e):"
echo ""
echo "*/30 * * * * $SCRIPT_PATH >> /var/log/feedcentral-cron.log 2>&1"
echo ""
echo "📊 View logs with: tail -f /var/log/feedcentral-cron.log"
echo ""
