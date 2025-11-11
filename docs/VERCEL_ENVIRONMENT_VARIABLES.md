# Vercel environment variables — manual setup

Purpose

This file lists the environment variable NAMES used by the project that should be present in your Vercel Production environment. It gives recommended non-secret defaults for config values and instructions to generate and paste secret values locally — do NOT commit secrets into the repository.

Where to add

- Recommended: Vercel Dashboard -> Project -> Settings -> Environment Variables -> Add
- Alternatively: use `npx vercel env add NAME production` from a terminal you control (this will prompt for the value).

Important: do not commit secrets. Generate secrets locally and paste into Vercel.

---

Environment variables to add for Production

1) Optional secrets (generate locally, then paste into Vercel)

- CRON_SECRET (optional)
  - Purpose: secret used by scheduled/cron endpoints to authenticate incoming cron requests. Only add this to Production if your deployment expects an external cron caller to present this secret (some setups rely on a `CRON_API_KEY` instead). If you do not use this secret in Production, you can skip adding it.
  - How to generate (locally), if needed:

```bash
# generates a 64-char hex secret
openssl rand -hex 32
```

- (If you need other secrets referenced elsewhere, e.g. JWT_SECRET or LICENSE_SIGNING_SECRET, manage them the same way locally and in Vercel.)


2) Image proxy and allowed hosts (non-secret values; paste comma-separated lists)

- IMAGE_PROXY_ALLOWED_HOSTS
  - Purpose: comma-separated hostnames allowed by the image proxy.
  - Example value (paste as-is or change to your allowed hosts):

images.unsplash.com,platform.theverge.com,cdn.vox-cdn.com

- NEXT_PUBLIC_ALLOWED_IMAGE_HOSTS
  - Purpose: hosts allowed on the client-side (public). Usually a subset of IMAGE_PROXY_ALLOWED_HOSTS.
  - Example value:

images.unsplash.com,platform.theverge.com

- IMAGE_PROXY_MAX_BYTES
  - Purpose: maximum image size bytes the proxy will accept.
  - Example value: 1048576

- IMAGE_PROXY_TIMEOUT_MS
  - Purpose: request timeout for the image proxy in milliseconds.
  - Example value: 5000

- IMAGE_PROXY_CACHE_MAX_AGE
  - Purpose: how long image proxy cache entries are considered fresh (seconds).
  - Example value: 60

- IMAGE_CACHE_TTL_SEC
  - Purpose: TTL (seconds) for cached transformed/optimized images.
  - Example value: 300

3) API cache & bypass

- API_CACHE_TTL_SEC
  - Purpose: default caching TTL in seconds for API responses.
  - Example value: 60

- API_ALLOW_CACHE_BYPASS
  - Purpose: whether a cache-bypass is allowed for the API (0/1). In production recommend 0.
  - Example value: 0

4) RSS & crawler allowlist

- RSS_ALLOWED_CIDRS
  - Purpose: comma-separated CIDR ranges allowed to access RSS endpoints or known/crawl sources.
  - Example value:

76.76.21.0/24,76.76.22.0/24,76.223.16.0/20


Checklist: add these exact NAMES to Vercel (Production target)

- IMAGE_PROXY_ALLOWED_HOSTS
- NEXT_PUBLIC_ALLOWED_IMAGE_HOSTS
- IMAGE_PROXY_MAX_BYTES
- IMAGE_PROXY_TIMEOUT_MS
- IMAGE_PROXY_CACHE_MAX_AGE
- IMAGE_CACHE_TTL_SEC
- API_CACHE_TTL_SEC
- API_ALLOW_CACHE_BYPASS
- RSS_ALLOWED_CIDRS

Optional / confirm in your project

- CRON_API_KEY (already present in many setups — check your Vercel envs before adding duplicates)
- PRISMA_DATABASE_URL / DATABASE_URL (these should already be configured in Production)
- JWT_SECRET, LICENSE_SIGNING_SECRET (if present in `lib/env.ts` or used by your project)

How to add values manually (Vercel Dashboard)

1. Open the Vercel Dashboard and select your project -> Settings -> Environment Variables.
2. Click "Add".
3. For each variable:
   - Name: paste the exact variable name (e.g. `CRON_SECRET`).
   - Value: paste the value (secret or example value above).
   - Environment: set to `Production` (you can also add to Preview/Development if needed).
   - Save.

How to add values via CLI (interactive; recommended only if you prefer the CLI)

```bash
# example: add IMAGE_PROXY_ALLOWED_HOSTS
npx vercel env add IMAGE_PROXY_ALLOWED_HOSTS production
# the CLI will prompt you to paste or type the value; paste the comma-separated list and confirm

# example: add CRON_SECRET (generate first locally)
openssl rand -hex 32 | npx vercel env add CRON_SECRET production
# Note: some CLI versions prompt for confirmation; if piping doesn't work, run
# npx vercel env add CRON_SECRET production
# and paste the secret when prompted.
```

Verify the variables are present

```bash
npx vercel env ls production
# or check in the Vercel Dashboard -> Project -> Settings -> Environment Variables
```

Security notes

- Never commit secret values to git or paste them into public places.
- If you accidentally commit a secret, rotate it immediately.
- Use Vercel's built-in encrypted env var storage (dashboard or CLI) for Production secrets.

If you'd like, I can also:

- Provide single-line commands you can run one-by-one in your terminal (I won't bundle them in a script). You can run them interactively and paste values when prompted.
- Re-check the project's current production env list and report which names are missing (I can run `npx vercel env ls production` for you if you prefer I do that).

---

File created by the assistant to make manual setup easy. Do not add secrets from this file to the repository.
