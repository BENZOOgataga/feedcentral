# Setup locale-based routing – Internationalization (i18n) for Next.js
Prefer to watch a video?

[Routing setup](https://learn.next-intl.dev/chapters/06-routing/01-setup)

In order to use unique pathnames for every language that your app supports, can be used to handle the following routing setups:

1.  Prefix-based routing (e.g. )
2.  Domain-based routing (e.g. )

In either case, integrates with the App Router by using a top-level [dynamic segment](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes) that can be used to provide content in different languages.

Initial setup[](#initial-setup)
-------------------------------

To get started with locale-based routing, we’ll set up the following files:

### [](#i18n-routing)

We’ll use as a central place to define our routing configuration:

Depending on your requirements, you may wish to customize your routing configuration later—but let’s finish with the setup first.

### [](#proxy)

Once we have our routing configuration in place, we can use it to set up a proxy:

**Note:** was called up until Next.js 16.

### [](#i18n-navigation)

Additionally, we can use our routing configuration to set up the navigation APIs:

### [](#i18n-request)

Now, we can read the matched locale in our request configuration:

### [](#layout)

To complete our setup, we’ll move all of our existing layouts and pages into the segment:

The that was matched is now available via the param:

That’s all it takes! From here, you can [configure your routing](https://next-intl.dev/docs/routing/configuration) to cater to your specific needs.

In case you ran into an issue, have a look at the [App Router example](about:/examples#app-router) to explore a working app.

Static rendering[](#static-rendering)
-------------------------------------

When using locale-based routing, will currently opt into dynamic rendering when APIs like are used in Server Components. This is a limitation that we aim to remove in the future, but as a stopgap solution, provides a temporary API that can be used to enable static rendering.

### Add[](#add-generatestaticparams)

Since we are using a dynamic route segment for the param, we need to use [](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)so that the routes can be rendered at build time.

Depending on your needs, you can add either to a layout or pages:

1.  **Layout**: Enables static rendering for all pages within this layout (e.g. )
2.  **Individual pages**: Enables static rendering for a specific page (e.g. )

**Example:**

### Add to all relevant layouts and pages[](#add-setrequestlocale-to-all-relevant-layouts-and-pages)

provides an API that can be used to distribute the locale that is received via in layouts and pages for usage in all Server Components that are rendered as part of the request.

**Keep in mind that:**

1.  The locale that you pass to should be validated (e.g. in your [root layout](#layout)).
2.  You need to call this function in every page and every layout that you intend to enable static rendering for since Next.js can render layouts and pages independently.
3.  needs to be called before you invoke any functions from like or .

### Use the param in metadata[](#use-the-locale-param-in-metadata)

In addition to the rendering of your pages, also page metadata needs to qualify for static rendering.

To achieve this, you can forward the that you receive from Next.js via to the [awaitable functions from](about:/docs/environments/server-client-components#async-components) .

[Routing](https://next-intl.dev/docs/routing "Routing")
[Configuration](https://next-intl.dev/docs/routing/configuration "Configuration")