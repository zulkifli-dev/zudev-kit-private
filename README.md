# Zudev Kit Private

Reusable modules are published as public npm packages under the `@zudev` scope. This repository contains `@zudev/auth`, `@zudev/dashboard`, `@zudev/landing-kit`, `@zudev/storage`, and `@zudev/media-editor`.

`@zudev/auth` provides runtime-neutral Web Crypto password hashing, cryptographically random opaque session tokens, SHA-256 token fingerprints, and hardened cookie helpers. Store only password hashes and token fingerprints in the application's auth database. Lafacus uses Prisma/PostgreSQL for its seeded admin account and revocable sessions; it does not need `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, or `AUTH_SECRET` environment variables.

The shared package supplies cryptographic primitives, not a user database, account recovery, MFA, or distributed login throttling. Each app must validate its opaque session token against its own session store on the server before serving private data or mutations; hiding a dashboard route in the browser is not access control.

`landing-kit` exports `CategoryNavigation`, `ProductGrid`, `ProductGallery`, `ArticleList`, `CareersGallery`, `ContactForm`, and `LocationMap`, plus their data types. Categories are nested through `children`, products carry an image array, Careers accepts images only, and map coordinates are supplied by the consuming app.

`dashboard` exports reusable admin dashboard modules including the responsive shell, page header, and metric card. It uses the public `@zudev/ui` primitives and leaves route content and CMS data to the app.

## Local development

At the workspace root, Bun links this package and `@zudev/ui` by their semver ranges:

```sh
bun install
bun run --filter=@zudev/landing-kit typecheck
bun run --filter=@zudev/landing-kit build
```

The package relies on `@zudev/ui` `^1.0.0`. A standalone install from this repository requires that public UI package to be published first. Then run `bun install` here to generate this repository's own lockfile.

Apps using the landing modules should import `@zudev/landing-kit/styles.css` in their Tailwind CSS v4 entry stylesheet. That import includes the shared UI theme and registers the landing-kit component classes for Tailwind scanning.

## npm registry

The `.npmrc` maps `@zudev` to the public npm registry. Public installs need no registry token. Publishing from GitHub Actions uses the `NPM_TOKEN` repository secret; never commit token values.

Each package is configured to publish to npm. After publishing the public kit, add an npm granular access token as the `NPM_TOKEN` Actions secret, then run the **Publish npm Packages** workflow in this repository. The published package contents are public even though this source repository is private.


Run `bun publish --recursive --access public` from this repository root after `bun install` and `bun run build`. `@zudev/ui` from the public kit must already exist on npm. Use an npm account that owns `@zudev`.
