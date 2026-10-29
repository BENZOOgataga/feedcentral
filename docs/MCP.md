# Embedded MCP server

This instance can expose an authenticated MCP Streamable HTTP endpoint at `/mcp`. It is **disabled by default** on all new installations and forks.

## Setup

1. Deploy the updated application and apply Prisma migrations with `npx prisma migrate deploy` using the production database connection. Do not enable MCP before the migration has run.
2. Set `MCP_PUBLIC_ORIGIN` to the public origin of this deployment (for example, `https://feed.benzoogataga.com`). Do not include a trailing slash.
3. Log in as an existing admin, then open Admin > Settings > MCP Integration.
4. Enable MCP for read-only access. Enable write operations separately only if you want the AI client to add/deactivate sources or manually fetch articles.
5. Connect an MCP client to `https://feed.benzoogataga.com/mcp` (replace with your own instance hostname). The client should discover OAuth metadata, register, complete the admin PKCE consent flow and obtain a scoped bearer token.

## Available tools

Read-only: `list_categories`, `list_sources`, `list_feed_jobs`, `source_health`, `validate_feed`.

Optional writes: `add_source`, `set_source_active`, `fetch_source`, `fetch_all_sources`.

The jobs and health tools return fetch statuses (PENDING, RUNNING, COMPLETED, FAILED), timestamps, articles found, articles added, and error strings. A completed job with zero additions does not necessarily mean the feed failed; it may have no new articles.

## Authentication and access

The integration uses OAuth 2 authorization code with PKCE S256 and explicit admin consent. Only current FeedCentral admins can authorize clients. Bearer access tokens last one hour; refresh tokens rotate and expire after 30 days. MCP tool calls re-check the global enable flag and the account's current admin role. Disabling MCP stops new tool calls and token issuance. Existing client registrations and refresh tokens are retained so re-enabling is possible; rotating `JWT_SECRET` invalidates existing access tokens, and deleting the MCP refresh-token rows invalidates refresh authorization.

This endpoint does not accept regular FeedCentral login cookies as MCP credentials. Do not include `JWT_SECRET` in any client configuration. Leave write permissions disabled unless they are needed.

## Operational limits

Manual single-source fetching checks whether the source is active, whether it was fetched within the previous 60 seconds, and whether it has a recent PENDING or RUNNING job. Full fetches have a 10-minute audit-log-based cooldown and concurrency limited to 2. These checks are best-effort and are not a distributed lock. Source fetch ingestion still uses the existing RSS parser and its validation mechanisms.

## Open-source deployment

Every fork has its own configuration, database, OAuth clients, and authorization state. MCP remains off until an admin explicitly enables it. Set `MCP_PUBLIC_ORIGIN` to your fork's URL, not the upstream demo domain.

## Test plan

- A fresh deployment must return 404 at /mcp until an admin enables the integration.
- Enable read-only mode and authorize an admin account through an OAuth client with PKCE.
- Confirm source, category, job list, and health tools work; write tool calls must be denied.
- Enable write mode, add a valid RSS source, deactivate/reactivate it, and manually fetch it.
- Confirm rapid repeated fetch requests are rejected, job history contains ingestion results, and invalid sources are rejected.
- Disable MCP and confirm that already issued access tokens can no longer call tools.
- Demote the authorized user and confirm authorization is denied.
- Test with a second instance using a different MCP_PUBLIC_ORIGIN and its own database.
