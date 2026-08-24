# Publishing this fork

How to get the customisations in this repo into your other projects, as `npm install @ssmckinney/ckeditor5`.

Everything below assumes the package rename to `@ssmckinney/*` has already been applied.

## Why a private registry, and which one

The packages here are now named `@ssmckinney/ckeditor5` and `@ssmckinney/ckeditor5-*`, so GitHub Packages can host them
under the `ssmckinney` scope.

| Registry | Works? |
|---|---|
| npmjs.com | Possible, but public packages under this scope would expose the fork unless you pay for private npm packages. |
| **GitHub Packages** | Recommended for this fork: scoped package names match the GitHub org and can remain private with the repo/package permissions. |
| Verdaccio / Nexus / Artifactory | Also works if you need an internal registry/proxy later. |

## If the GitHub repo stays public

You can keep `ssmckinney/ckeditor5` public and still publish private GitHub npm packages. The tradeoff is simple:
the source code is public, but installing the package can still require GitHub Package access.

Before the first publish, prevent the packages from inheriting read access from the public repository:

1. Go to the `ssmckinney` organization.
2. Open `Settings` -> `Packages`.
3. Under `Default Package Settings`, turn off `Inherit access from source repository`.

If that org setting is not available, publish first, then for each package go to:

`ssmckinney` -> `Packages` -> package name -> `Package settings` -> disable `Inherit access from repository`

Then confirm each package's visibility remains `Private`. Do not change package visibility to `Public`; GitHub warns
that public packages cannot be made private again.

## Publish the whole workspace

The main package is `@ssmckinney/ckeditor5`, but its package manifest depends on the sibling
`@ssmckinney/ckeditor5-*` packages:

```json
"dependencies": {
  "@ssmckinney/ckeditor5-ui": "workspace:*",
  "@ssmckinney/ckeditor5-adapter-ckfinder": "workspace:*"
}
```

So publishing `@ssmckinney/ckeditor5` alone achieves nothing — it resolves its `@ssmckinney/*` dependencies from wherever
your registry points, which without the rest of the fork means **missing packages**. You would install a package
labelled with your version that contains none of your changes. All 61 packages have to go up together, in one
run, at one version.

(The browser build is the opposite: `dist/browser/ckeditor5.umd.js` is 1.9 MB and fully self-contained, with
no external imports at all. That is the one to put on a static host if you ever want `<script src>` usage.)

## Registry setup

Use a GitHub token with `write:packages` to publish and `read:packages` to install.

```bash
npm login --scope=@ssmckinney --registry=https://npm.pkg.github.com
```

For CI, write this to `.npmrc` instead of logging in interactively:

```ini
@ssmckinney:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Publishing

```bash
node scripts/release/publish-fork.mjs \
  --registry https://npm.pkg.github.com \
  --version 48.3.0-cinco.1
```

The script stamps the version across all 61 packages, builds each one's `dist`, publishes them, and restores
the versions afterwards so the working tree is left as it was. `--dry-run` rehearses it; `--restore` recovers
if it is interrupted.

**Use a version that differs from the upstream release this fork is based on.** A suffix like
`48.3.0-cinco.1` makes it clear this is not the upstream CKEditor release.

### Do not publish packages one at a time

`pnpm` resolves each `workspace:*` dependency to the sibling's version **at pack time**. Publish `@ssmckinney/ckeditor5` in
a separate run from its dependencies and it will pin them to whatever version they hold at that moment — which
is how you end up with `@ssmckinney/ckeditor5@48.3.0-cinco.1` depending on `@ssmckinney/ckeditor5-link@48.3.0` and silently
installing upstream. The script exists to keep the whole set stamped for the duration of one publish.

## Consuming it

```
# .npmrc in the consuming project
@ssmckinney:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm install @ssmckinney/ckeditor5@48.3.0-cinco.1
```

Scoping `@ssmckinney` is enough because all forked packages now live under that scope.

Nothing else changes — projects import from `'@ssmckinney/ckeditor5'` exactly as they do today:

```js
import { ClassicEditor, Link, ListProperties, FontColor } from '@ssmckinney/ckeditor5';

ClassicEditor.create( element, {
	link: { builtinDecorators: true },
	image: { insert: { responsive: true } },
	fontColor: { brand: 'cinco' },
	list: { properties: { styles: true, markerColor: true, columns: true } }
} );
```

## Upgrading from upstream

The fork's changes live in five packages — `link`, `image`, `font`, `list`, `icons` — and are additive: new
config options that default to off, plus two new SVG assets. Merging a new upstream release should be routine.
Re-run the package test suites afterwards; between them they cover the customisations closely, and the
default-config assertions are the ones that notice when upstream changes a default underneath you.

## Licensing

CKEditor 5 is GPL 2+ (or a commercial licence). This fork is a modified work: distributing it outside your
organisation carries the GPL's source-availability obligation. Internal use does not count as distribution.
Worth a word with whoever owns that question before the first external release.
