# Proxy / middleware – Internationalization (i18n) for Next.js
The middleware can be created via .

It receives a [](about:/docs/routing/configuration#define-routing)configuration and takes care of:

1.  Locale negotiation
2.  Applying relevant redirects & rewrites
3.  Providing [alternate links](about:/docs/routing/configuration#alternate-links) for search engines

**Example:**

**Note:** was called up until Next.js 16.

Locale detection[](#locale-detection)
-------------------------------------

The locale is negotiated based on your routing configuration, taking into account your settings for [](about:/docs/routing/configuration#locale-prefix), [](about:/docs/routing/configuration#domains), [](about:/docs/routing/configuration#locale-detection), and [](about:/docs/routing/configuration#locale-cookie).

### Prefix-based routing (default)
[](#location-detection-prefix)

Prefer to watch a video?

[Prefix-based routing](https://learn.next-intl.dev/chapters/06-routing/05-prefix-based)

By default, [prefix-based routing](about:/docs/routing/configuration#locale-prefix) is used to determine the locale of a request.

In this case, the locale is detected based on these priorities:

1.  A locale prefix is present in the pathname (e.g. )
2.  A cookie is present that contains a previously detected locale
3.  A locale can be matched based on the [header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)
4.  As a last resort, the is used

To change the locale, users can visit a prefixed route. This will take precedence over a previously matched locale that is saved in a cookie or the header and will update a previous cookie value.

**Example workflow:**

1.  A user requests and based on the header, the locale is matched.
2.  The user is redirected to .
3.  The app renders to allow the user to change the locale to .
4.  When the user clicks on the link, a request to is initiated.
5.  The middleware will add a cookie to remember the preference for the locale.
6.  The user later requests again and the middleware will redirect to based on the cookie.

### Domain-based routing[](#location-detection-domain)

Prefer to watch a video?

[Domain-based routing](https://learn.next-intl.dev/chapters/06-routing/04-domain-based)

If you’re using the [](about:/docs/routing/configuration#domains)setting, the middleware will match the request against the available domains to determine the best-matching locale. To retrieve the domain, the host is read from the header, with a fallback to (hosting platforms typically provide these headers out of the box).

The locale is detected based on these priorities:

1.  A locale prefix is present in the pathname (e.g. )
2.  A locale is stored in a cookie and is supported on the domain
3.  A locale that the domain supports is matched based on the [header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)
4.  As a fallback, the of the domain is used

Since the middleware is aware of all your domains, if a domain receives a request for a locale that is not supported (e.g. ), it will redirect to an alternative domain that does support the locale.

**Example workflow:**

1.  The user requests and based on the of this domain, the locale is matched.
2.  The app renders to allow the user to change the locale to .
3.  When the link is clicked, a request to is initiated.
4.  The middleware recognizes that the user wants to switch to another domain and responds with a redirect to .

Matcher config[](#matcher-config)
---------------------------------

The middleware is intended to only run on pages, not on arbitrary files that you serve independently of the user locale (e.g. ).

A popular strategy is to match all routes that don’t start with certain segments (e.g. ) and also none that include a dot () since these typically indicate static files. However, if you have some routes where a dot is expected (e.g. ), you should explicitly provide a matcher for these.

Note that some third-party providers like [Vercel Analytics](https://vercel.com/analytics) typically use internal endpoints that are then rewritten to an external URL (e.g. ). Make sure to exclude such requests from your middleware matcher so they aren’t rewritten by accident.

Composing other middlewares[](#composing-other-middlewares)
-----------------------------------------------------------

By calling , you’ll receive a function of the following type:

If you need to incorporate additional behavior, you can either modify the request before the middleware receives it, modify the response or even create the middleware based on dynamic configuration.

### Example: Additional rewrites[](#example-additional-rewrites)

If you need to handle rewrites apart from the ones provided by , you can call [](https://nextjs.org/docs/app/api-reference/functions/next-response#rewrite)conditionally after the middleware has run.

This example rewrites requests for to if a special cookie is set.

You may wish to customize this based on your routing configuration and use case.

### Example: Integrating with Clerk[](#example-integrating-with-clerk)

[](https://clerk.com/docs/references/nextjs/overview)provides a middleware that can be [combined](https://clerk.com/docs/references/nextjs/clerk-middleware#combine-middleware) with other middlewares like the one provided by . By combining them, the middleware from will first ensure protected routes are handled appropriately. Subsequently, the middleware from will run, potentially redirecting or rewriting incoming requests.

(based on )

### Example: Integrating with Supabase Authentication[](#example-integrating-with-supabase-authentication)

In order to use Supabase Authentication with , you need to combine the Supabase middleware with the one from .

You can do so by following the [setup guide from Supabase](https://supabase.com/docs/guides/auth/server-side/nextjs?router=app) and adapting the middleware utils to accept a response object that’s been created by the middleware instead of creating a new one:

Now, we can integrate the Supabase middleware with the one from :

(based on )

### Example: Integrating with Auth.js (aka NextAuth.js)
[](#example-auth-js)

The [Auth.js](https://authjs.dev/) middleware requires an integration with their control flow to be compatible with other middlewares. The [success callback](https://next-auth.js.org/configuration/nextjs#wrap-middleware) can be used to run the middleware on authorized pages. However, public pages need to be treated separately.

For pathnames specified in the [object](https://next-auth.js.org/configuration/nextjs#pages) (e.g. ), Auth.js will skip the entire middleware and not run the success callback. Therefore, we have to detect these pages before running the Auth.js middleware and only run the middleware in this case.

(based on )

Usage without proxy / middleware (static export)
[](#usage-without-proxy--middleware-static-export)
--------------------------------------------------------------------------------------------------

If you’re using the [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) feature from Next.js (), a proxy / middleware will not run. You can use [prefix-based routing](about:/docs/routing/configuration#locale-prefix) nontheless to internationalize your app, but a few tradeoffs apply.

**Static export limitations:**

1.  Using a locale prefix is required (same as [](about:/docs/routing/configuration#locale-prefix-always))
2.  The locale can’t be negotiated on the server (same as [](about:/docs/routing/configuration#locale-detection))
3.  You can’t use [](about:/docs/routing/configuration#pathnames), as these require server-side rewrites
4.  [Static rendering](about:/docs/routing/setup#static-rendering) is required

Additionally, other [limitations as documented by Next.js](https://nextjs.org/docs/app/building-your-application/deploying/static-exports#unsupported-features) will apply too.

If you choose this approach, you might want to enable a redirect at the root of your app:

If you add such a root page at , you need to add a root layout at as well, even if it’s just passing through:

Troubleshooting[](#troubleshooting)
-----------------------------------

### ”The proxy / middleware doesn’t run for a particular page.”[](#middleware-not-running)

To resolve this, make sure that:

1.  The [proxy / middleware](about:/docs/routing/setup#proxy) is set up in the correct file (e.g. ).
2.  Your [](#matcher-config)correctly matches all routes of your application, including dynamic segments with potentially unexpected characters like dots (e.g. ).
3.  In case you’re [composing other middlewares](#composing-other-middlewares), ensure that the middleware is called correctly.
4.  In case you require static rendering, make sure to follow the [static rendering guide](about:/docs/routing/setup#static-rendering) instead of relying on hacks like [](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic).

### ”My page content isn’t localized despite the pathname containing a locale prefix.”[](#content-not-localized)

This is very likely the result of your [proxy / middleware not running](#middleware-not-running) on the request. As a result, a potential fallback from [](about:/docs/usage/configuration#i18n-request)might be applied.

### ”Unable to find locale because the proxy / middleware didn’t run on this request and no was returned in .”[](#unable-to-find-locale)

If the middleware _is not_ expected to run on this request (e.g. because you’re using a setup without locale-based routing, you should explicitly return a from [](about:/docs/usage/configuration#i18n-request)to recover from this error.

If the middleware _is_ expected to run, verify that your [middleware is set up correctly](#middleware-not-running).

Note that will invoke the function to abort the render if no locale is available after has run. You should consider adding a [page](about:/docs/environments/error-files#not-foundjs) due to this.

[Configuration](https://next-intl.dev/docs/routing/configuration "Configuration")
[Navigation](https://next-intl.dev/docs/routing/navigation "Navigation")