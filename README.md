# Zudev Kit Private

Reusable modules are published independently under the `@zulkifli-dev` GitHub Packages scope. This repository contains `@zulkifli-dev/auth`, `@zulkifli-dev/dashboard`, `@zulkifli-dev/landing-kit`, `@zulkifli-dev/storage`, and `@zulkifli-dev/media-editor`.

`@zulkifli-dev/auth` provides runtime-neutral Web Crypto password hashing, cryptographically random opaque session tokens, SHA-256 token fingerprints, and hardened cookie helpers. Store only password hashes and token fingerprints in the application's auth database. Lafacus uses Prisma/PostgreSQL for its seeded admin account and revocable sessions; it does not need `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, or `AUTH_SECRET` environment variables.

The shared package supplies cryptographic primitives, not a user database, account recovery, MFA, or distributed login throttling. Each app must validate its opaque session token against its own session store on the server before serving private data or mutations; hiding a dashboard route in the browser is not access control.

`landing-kit` exports `CategoryNavigation`, `ProductGrid`, `ProductGallery`, `ArticleList`, `CareersGallery`, `ContactForm`, and `LocationMap`, plus their data types. Categories are nested through `children`, products carry an image array, Careers accepts images only, and map coordinates are supplied by the consuming app.

`dashboard` exports reusable admin dashboard modules including the responsive shell, page header, and metric card. It uses the public `@zulkifli-dev/ui` primitives and leaves route content and CMS data to the app.

## Local development

At the workspace root, Bun links this package and `@zulkifli-dev/ui` by their semver ranges:

```sh
bun install
bun run --filter=@zulkifli-dev/landing-kit typecheck
bun run --filter=@zulkifli-dev/landing-kit build
```

The package relies on `@zulkifli-dev/ui` `^1.0.0`. A standalone install from this repository requires that public UI package to be published first. Then run `bun install` here to generate this repository's own lockfile.

Apps using the landing modules should import `@zulkifli-dev/landing-kit/styles.css` in their Tailwind CSS v4 entry stylesheet. That import includes the shared UI theme and registers the landing-kit component classes for Tailwind scanning.

## GitHub Packages

The `.npmrc` maps `@zulkifli-dev` to GitHub Packages and reads `GITHUB_PACKAGES_TOKEN` from the environment. Use a classic PAT with `read:packages` to install and `write:packages` to publish, or `GITHUB_TOKEN` in a GitHub Actions workflow with package access. Never store token values in this repository.

Each package is configured with `publishConfig.registry: https://npm.pkg.github.com` and its GitHub repository URL. Run the **Publish GitHub Packages** workflow from the Actions tab after the public kit's `@zulkifli-dev/ui` has been published and made public. The workflow uses this repository's `GITHUB_TOKEN` with `packages: write`. Git repository privacy and package visibility are separate settings; GitHub Packages makes a newly published package private by default. See [GitHub's npm registry guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).


After the first publish, GitHub marks each npm package private by default. Open each package page and choose **Package settings → Change visibility → Public**. This visibility change is irreversible. Publishing needs a classic PAT with `write:packages`; installing needs `read:packages`, including for public npm packages. Keep the token in `GITHUB_PACKAGES_TOKEN` in the shell and never commit it.
