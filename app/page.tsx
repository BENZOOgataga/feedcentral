export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">FeedCentral</h1>
        <p className="text-gray-600 mb-8">Production-grade RSS aggregator</p>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Setup Required</h2>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Configure DATABASE_URL in Vercel environment variables</li>
              <li>Apply database migration from migrations/001_init.sql</li>
              <li>Set JWT_SECRET, ADMIN_PASSWORD_HASH, CRON_API_KEY</li>
              <li>Trigger initial feed refresh: POST /api/refresh-feeds</li>
            </ol>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="/api/sources"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  View RSS Sources (API)
                </a>
              </li>
              <li>
                <a
                  href="/api/articles"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  View Articles (API)
                </a>
              </li>
              <li>
                <a
                  href="/admin/login"
                  className="text-blue-600 hover:underline"
                >
                  Admin Login (coming soon)
                </a>
              </li>
            </ul>
          </div>

          <div className="text-sm text-gray-500">
            <p>
              Backend is ready. Frontend UI coming soon.{" "}
              <a
                href="https://github.com/BENZOOgataga/feedcentral"
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                View on GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
