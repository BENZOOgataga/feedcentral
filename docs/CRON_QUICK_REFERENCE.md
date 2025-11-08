# ⚡ FeedCentral Cron - Quick Reference

## 🚀 One-Command Setup on Your VM

```bash
cd /path/to/feedcentral
chmod +x scripts/setup-cron.sh
./scripts/setup-cron.sh
```

This will:
1. Generate a secure API key
2. Add it to your environment
3. Make scripts executable
4. Show you the crontab line to add

---

## 📝 Manual Crontab Entry

```bash
crontab -e
```

Add this line:
```cron
*/30 * * * * /full/path/to/feedcentral/scripts/cron-runner.sh >> /var/log/feedcentral-cron.log 2>&1
```

**Replace `/full/path/to/feedcentral` with your actual path!**

---

## 🔑 API Key Setup

1. **Generate key on VM:**
   ```bash
   openssl rand -base64 32
   ```

2. **Add to Vercel:**
   ```bash
   echo "YOUR_KEY" | vercel env add CRON_API_KEY production
   ```

3. **Add to VM environment:**
   ```bash
   echo 'export CRON_API_KEY="YOUR_KEY"' >> ~/.bashrc
   source ~/.bashrc
   ```

---

## 📊 View Logs

```bash
# Real-time
tail -f /var/log/feedcentral-cron.log

# Last 100 lines
tail -100 /var/log/feedcentral-cron.log

# Search for errors
grep -i error /var/log/feedcentral-cron.log
```

---

## 🧪 Test Manually

```bash
# Test the script
./scripts/cron-runner.sh

# Test global feeds API
curl -X POST https://feedcentral.lyradevstudio.com/api/cron/fetch-feeds \
  -H "Authorization: Bearer $CRON_API_KEY"

# Test user sources API
curl -X POST https://feedcentral.lyradevstudio.com/api/cron/fetch-user-sources \
  -H "Authorization: Bearer $CRON_API_KEY"

# Check stats
curl "https://feedcentral.lyradevstudio.com/api/cron/stats?limit=20" \
  -H "Authorization: Bearer $CRON_API_KEY" | jq '.'
```

---

## ⏰ Cron Schedule Options

| Cron Expression | Description |
|----------------|-------------|
| `*/30 * * * *` | Every 30 minutes ⭐ Recommended |
| `*/15 * * * *` | Every 15 minutes |
| `0 * * * *` | Every hour |
| `0 */2 * * *` | Every 2 hours |

---

## ✅ Verify Setup

```bash
# Check environment variable
echo $CRON_API_KEY

# Check crontab
crontab -l

# Check if script is executable
ls -la scripts/cron-runner.sh

# Test connection
curl -I https://feedcentral.lyradevstudio.com/api/cron/stats \
  -H "Authorization: Bearer $CRON_API_KEY"
```

---

## 🐛 Troubleshooting

**Cron not running?**
```bash
# Check syslog
grep CRON /var/log/syslog

# Check cron service
sudo service cron status
```

**Permission denied?**
```bash
chmod +x scripts/cron-runner.sh
chmod 700 scripts/cron-runner.sh
```

**Wrong API key?**
```bash
# Check Vercel env
vercel env ls

# Check VM env
echo $CRON_API_KEY
```

---

## 📈 Expected Performance

- **Duration**: ~40-60 seconds for 13 sources
- **Articles per run**: 5-15 new articles (depending on feed activity)
- **Success rate**: >95%
- **With optimizations**: Down from 4 minutes to <1 minute! 🚀
