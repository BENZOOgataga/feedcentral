# FeedCentral Cron Jobs Setup

## Option 1: Using External Cron Service (Recommended)

Use a free cron service like **cron-job.org**, **EasyCron**, or **Cronitor**:

### cron-job.org Setup:
1. Go to https://console.cron-job.org/
2. Create two jobs:

**Job 1: Fetch Feeds (Every 30 minutes)**
- URL: `https://your-domain.vercel.app/api/cron/fetch-feeds`
- Method: POST
- Schedule: `*/30 * * * *`
- Headers: `Authorization: Bearer YOUR_CRON_API_KEY`

**Job 2: Cleanup Articles (Daily at 2 AM)**
- URL: `https://your-domain.vercel.app/api/cron/cleanup-articles`
- Method: POST
- Schedule: `0 2 * * *`
- Headers: `Authorization: Bearer YOUR_CRON_API_KEY`

### Environment Variables:
Add to your Vercel project:
```
CRON_API_KEY=your-secret-key-here
```

---

## Option 2: Using Your Own Server

If you have a Linux server, add to crontab:

```bash
# Edit crontab
crontab -e

# Add these lines (replace paths and values):
# Fetch feeds every 30 minutes
*/30 * * * * /path/to/scripts/run-cron.sh fetch

# Cleanup articles daily at 2 AM
0 2 * * * /path/to/scripts/run-cron.sh cleanup
```

### Setup Script:
1. Copy `scripts/run-cron.sh` to your server
2. Make it executable: `chmod +x run-cron.sh`
3. Edit the script and set:
   - `API_URL` to your Vercel domain
   - `CRON_API_KEY` to match your env variable

---

## Option 3: GitHub Actions (Free & Simple)

Create `.github/workflows/cron-jobs.yml`:

```yaml
name: Cron Jobs

on:
  schedule:
    # Fetch feeds every 30 minutes
    - cron: '*/30 * * * *'
    # Cleanup articles daily at 2 AM
    - cron: '0 2 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  fetch-feeds:
    runs-on: ubuntu-latest
    if: github.event.schedule == '*/30 * * * *' || github.event_name == 'workflow_dispatch'
    steps:
      - name: Fetch Feeds
        run: |
          curl -X POST https://your-domain.vercel.app/api/cron/fetch-feeds \
            -H "Authorization: Bearer ${{ secrets.CRON_API_KEY }}" \
            -H "Content-Type: application/json"
  
  cleanup-articles:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 2 * * *' || github.event_name == 'workflow_dispatch'
    steps:
      - name: Cleanup Articles
        run: |
          curl -X POST https://your-domain.vercel.app/api/cron/cleanup-articles \
            -H "Authorization: Bearer ${{ secrets.CRON_API_KEY }}" \
            -H "Content-Type: application/json"
```

Add `CRON_API_KEY` to GitHub Secrets:
1. Go to repo Settings → Secrets → Actions
2. Add secret: `CRON_API_KEY` with your key

---

## Testing

Test endpoints manually:

```bash
# Test fetch feeds
curl -X POST https://your-domain.vercel.app/api/cron/fetch-feeds \
  -H "Authorization: Bearer YOUR_CRON_API_KEY"

# Test cleanup
curl -X POST https://your-domain.vercel.app/api/cron/cleanup-articles \
  -H "Authorization: Bearer YOUR_CRON_API_KEY"
```

---

## Recommended: Option 3 (GitHub Actions)

**Pros:**
- ✅ Free for public repos
- ✅ Built into your repo
- ✅ Easy to manage
- ✅ Logs available in GitHub

**Cons:**
- ⚠️ Requires public repo or GitHub Pro for private repos
- ⚠️ May have slight delays (up to 5 minutes)

---

## Quick Setup Commands

```bash
# Set environment variable in Vercel
vercel env add CRON_API_KEY production

# Or use Vercel dashboard:
# Project Settings → Environment Variables → Add
# Name: CRON_API_KEY
# Value: your-secret-key-here
```
