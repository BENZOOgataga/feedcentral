# Routing configuration – Internationalization (i18n) for Next.js
[](#definerouting)
------------------

The routing configuration that is shared between the [middleware](https://next-intl.dev/docs/routing/middleware) and the [navigation APIs](https://next-intl.dev/docs/routing/navigation) can be defined with the function.

Depending on your routing needs, you may wish to consider further settings—see below.

### [](#localeprefix)

By default, the pathnames of your app will be available under a prefix that matches your directory structure (e.g. → ). You can however adapt the routing to optionally remove the prefix or customize it per locale by configuring the setting.

**Learn more:**

[Prefix-based routing](https://learn.next-intl.dev/chapters/06-routing/05-prefix-based)

#### (default)
[](#locale-prefix-always)

By default, pathnames always start with the locale (e.g. ).

#### [](#locale-prefix-as-needed)

If you want to use no prefix for the default locale (e.g. ) while keeping it for other locales (e.g. ), you can configure your routing accordingly:

**Note that:**

1.  If you use this routing strategy, make sure that your [](about:/docs/routing/middleware#matcher-config)detects unprefixed pathnames.
2.  The middleware will by default set a [cookie](#locale-cookie) to remember the user’s locale preference. If no explicit locale prefix is present in the pathname, then [locale detection](about:/docs/routing/middleware#locale-detection-prefix) will potentially redirect users to the latest locale that was matched based on the cookie value (e.g. → ).
3.  If a superfluous locale prefix like is requested, the middleware will automatically redirect to the unprefixed version . This can be helpful in case you’re redirecting from another locale and you want to update a potential cookie value first (e.g. [](about:/docs/routing/navigation#link)relies on this mechanism).

#### [](#locale-prefix-never)

If you’d like to provide a locale to , e.g. based on user settings, you can consider not using locale-based routing in the first place.

However, you can also configure the middleware to never show a locale prefix in the URL, which can be helpful in the following cases:

1.  You want to use [domain-based routing](#domains) and there’s only one locale per domain
2.  You want to use a cookie to determine the locale while enabling static rendering

In this case, requests for all locales will be rewritten to have the locale only prefixed internally. You still need to place all your pages inside a folder for the routes to be able to receive the param.

**Note that:**

1.  If you use this routing strategy, make sure that your [](about:/docs/routing/middleware#matcher-config)detects unprefixed pathnames.
2.  [Alternate links](#alternate-links) are disabled in this mode since URLs might not be unique per locale. Due to this, consider including these yourself, or set up a [sitemap](about:/docs/environments/actions-metadata-route-handlers#sitemap) that links localized pages via .
3.  You can consider increasing the [](#locale-cookie)attribute of the locale cookie to a longer duration to remember the user’s preference across sessions.

#### [](#locale-prefix-prefixes)

If you’d like to customize the user-facing prefix, you can provide a locale-based mapping:

**Note that:**

1.  You should adapt your [](about:/docs/routing/middleware#matcher-config)to match the custom prefixes.
2.  Custom prefixes are only visible to the user and rewritten internally to the corresponding locale. Therefore, the segment corresponds to the locale, not the prefix.

### [](#pathnames)

Prefer to watch a video?

[Localized pathnames](https://learn.next-intl.dev/chapters/06-routing/06-localized-pathnames)

Many apps choose to localize pathnames, especially when search engine optimization is relevant.

**Example:**

Since you typically want to define these routes only once internally, you can use the middleware to [rewrite](https://nextjs.org/docs/api-reference/next.config.js/rewrites) such incoming requests to shared pathnames.

Localized pathnames map to a single internal pathname that is created via the file-system based routing in Next.js. In the example above, will be handled by the page at .

### [](#domains)

Prefer to watch a video?

[Domain-based routing](https://learn.next-intl.dev/chapters/06-routing/04-domain-based)

If you want to serve your localized content based on different domains, you can provide a list of mappings between domains and locales via the setting.

**Examples:**

*   :
*   :
*   :
*   :

In many cases, are combined with a [](#locale-prefix)setting to achieve results as shown above. Also [custom prefixes](#locale-prefix-prefixes) can be used to customize the user-facing prefix per locale.

Locales are required to be unique across domains, therefore regional variants are typically used to avoid conflicts. Note however that you don’t necessarily need to [provide messages](about:/docs/usage/configuration#messages) for each locale if the overall language is sufficient for your use case.

If no domain matches, the middleware will fall back to default locale matching based on [prefixes](about:/docs/routing/middleware#location-detection-prefix) (e.g. on , for local development).

See also: [Domain-based routing](about:/docs/routing/middleware#location-detection-domain)

### [](#locale-detection)

The middleware will [detect a matching locale](about:/docs/routing/middleware#locale-detection) based on your routing configuration & the incoming request and will either pass the request through for a matching locale or redirect to one that matches.

If you want to rely entirely on the URL to resolve the locale, you can set the property to . This will disable locale detection based on the header and a potentially existing cookie value from a previous visit.

In this case, only the locale prefix and a potentially [matching domain](#domains) are used to determine the locale.

### [](#locale-cookie)

If a user changes the locale to a value that doesn’t match the header, will set a session cookie called that contains the most recently detected locale. This is used to [remember the user’s locale](about:/docs/routing/middleware#locale-detection) preference for subsequent requests.

By default, the cookie will be configured with the following attributes:

2.  [](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value): This value is set to so that the cookie can be set when coming from an external site.
3.  [](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#pathpath-value): This value is not set by default, but will use the value of your [](#basepath)if configured.

If you have more specific requirements, you can adjust these settings accordingly:

… or turn the cookie off entirely:

### ()
[](#alternate-links)

The middleware automatically sets the [](https://developers.google.com/search/docs/specialty/international/localized-versions#http)header to inform search engines that your content is available in different languages. Note that this automatically integrates with your routing strategy and will generate the correct links based on your configuration.

However, there are cases where you may want to provide these links yourself:

1.  You have pages that are only available for certain locales
2.  You’re using an external system like a CMS to manage pathnames of your pages

In this case, you can opt-out of this behavior by setting to :

**Learn more:**

[hreflang & canonicals](https://learn.next-intl.dev/chapters/08-seo/03-alternate-links)

[Sitemaps](https://learn.next-intl.dev/chapters/08-seo/04-sitemap)

[](#next-config)
----------------

Apart from your routing configuration, will also incorporate settings from [](https://nextjs.org/docs/pages/api-reference/config/next-config-js).

### [](#basepath)

The middleware as well as the navigation APIs will automatically consider a [](https://nextjs.org/docs/app/api-reference/next-config-js/basePath)that you might have configured in your Next.js config.

The only exception is the [](about:/docs/routing/navigation#getpathname)function, which will return the bare pathname without a base path. Due to this, you can prefix the returned pathname manually if you need to.

When using a base path, you should make sure that your [](#matcher-config)handles an explicit root:

### [](#trailingslash)

If you have [](https://nextjs.org/docs/app/api-reference/next-config-js/trailingSlash)set to in your Next.js config, this setting will be taken into account by the middleware and the navigation APIs.

Note that if you’re using [](#pathnames), your internal and external pathnames can be defined either with or without a trailing slash as they will be normalized internally.

[Setup](https://next-intl.dev/docs/routing/setup "Setup")
[Proxy / middleware](https://next-intl.dev/docs/routing/middleware "Proxy / middleware")