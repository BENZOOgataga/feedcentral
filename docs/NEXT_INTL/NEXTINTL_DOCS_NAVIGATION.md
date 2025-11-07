# Navigation APIs – Internationalization (i18n) for Next.js
Prefer to watch a video?

[Navigation APIs](https://learn.next-intl.dev/chapters/06-routing/02-navigation-apis)

provides lightweight wrappers around Next.js’ navigation APIs like [](https://nextjs.org/docs/app/api-reference/components/link)and [](https://nextjs.org/docs/app/api-reference/functions/use-router)that automatically handle the user locale and pathnames behind the scenes.

To create these APIs, you can call the function with your configuration:

This function is typically called in a central module like [](about:/docs/routing/setup#i18n-navigation)in order to provide easy access to navigation APIs in your components.

APIs[](#apis)
-------------

The created navigation APIs are thin wrappers around the equivalents from Next.js and mostly adhere to the same function signatures. Your routing configuration and the user’s locale are automatically incorporated.

If you’re using the [](about:/docs/routing/configuration#pathnames)setting in your routing configuration, the internal pathnames that are accepted for arguments will be strictly typed and localized to the given locale.

### [](#link)

This component wraps [](https://nextjs.org/docs/app/api-reference/components/link)and localizes the pathname as necessary.

Depending on if you’re using the [](about:/docs/routing/configuration#pathnames)setting, dynamic params can either be passed as:

### [](#userouter)

If you need to navigate programmatically, e.g. in an event handler, provides a convience API that wraps [from Next.js](https://nextjs.org/docs/app/api-reference/functions/use-router) and localizes the pathname accordingly.

Depending on if you’re using the [](about:/docs/routing/configuration#pathnames)setting, dynamic params can either be passed as:

### [](#usepathname)

To retrieve the current pathname without a potential locale prefix, you can call .

Note that if you’re using the [](about:/docs/routing/configuration#pathnames)setting, the returned pathname will correspond to an internal pathname template (dynamic params will not be replaced by their values).

### [](#redirect)

If you want to interrupt the render and redirect to another page, you can invoke the function. This wraps [from Next.js](https://nextjs.org/docs/app/api-reference/functions/redirect) and localizes the pathname as necessary.

Note that a prop is always required, even if you’re just passing the [current locale](about:/docs/usage/configuration#use-locale).

Depending on if you’re using the [](about:/docs/routing/configuration#pathnames)setting, dynamic params can either be passed as:

When using a [](about:/docs/routing/configuration#localeprefix)setting other than , you can enforce a locale prefix by setting the option to . This is useful when changing the user’s locale and you need to update the [locale cookie](about:/docs/routing/configuration#locale-cookie) first:

### [](#getpathname)

If you need to construct a particular pathname based on a locale, you can call the function.

Depending on if you’re using the [](about:/docs/routing/configuration#pathnames)setting, dynamic params can either be passed as:

**Use cases:**

[Sitemaps](https://learn.next-intl.dev/chapters/08-seo/04-sitemap)

[hreflang & canonicals](https://learn.next-intl.dev/chapters/08-seo/03-alternate-links)

[Proxy / middleware](https://next-intl.dev/docs/routing/middleware "Proxy / middleware")
[Environments](https://next-intl.dev/docs/environments "Environments")