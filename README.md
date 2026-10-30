# Zudev Kit Private

Private reusable modules are published independently under the `@zulkifli-dev` GitHub Packages scope. This repository currently contains `@zulkifli-dev/landing-kit`.

`landing-kit` exports `CategoryNavigation`, `ProductGrid`, `ProductGallery`, `ArticleList`, `CareersGallery`, `ContactForm`, and `LocationMap`, plus their data types. Categories are nested through `children`, products carry an image array, Careers accepts images only, and map coordinates are supplied by the consuming app.

## Local development

At the workspace root, Bun links this package and `@zudev/ui` by their semver ranges:

```sh
bun install
bun run --filter=@zulkifli-dev/landing-kit typecheck
bun run --filter=@zulkifli-dev/landing-kit build
```

The package relies on `@zudev/ui` `^1.0.0`. A standalone install from this repository requires that public UI package to be published first. Then run `bun install` here to generate this repository's own lockfile.

Apps using the landing modules should import `@zulkifli-dev/landing-kit/styles.css` in their Tailwind CSS v4 entry stylesheet. That import includes the shared UI theme and registers the landing-kit component classes for Tailwind scanning.

## GitHub Packages

The `.npmrc` maps `@zulkifli-dev` to GitHub Packages and reads `GITHUB_PACKAGES_TOKEN` from the environment. Use a classic PAT with `read:packages` to install and `write:packages` to publish, or `GITHUB_TOKEN` in a GitHub Actions workflow with package access. Never store token values in this repository.

Each publishable package needs `publishConfig.registry: https://npm.pkg.github.com` and a `repository` field set to the actual GitHub URL once the remote exists. Git repository privacy and package visibility are separate settings; GitHub Packages makes a newly published package private by default. See [GitHub's npm registry guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).
