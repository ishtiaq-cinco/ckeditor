/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * @module image/imageinsert/utils
 */

import { logWarning } from '@ssmckinney/ckeditor5-utils';

import type { ImageInsertConfig, ImageResponsiveBreakpoint } from '../imageconfig.js';

/**
 * The breakpoints offered when
 * {@link module:image/imageconfig~ImageInsertConfig#responsive `config.image.insert.responsive`} is set to `true`.
 *
 * They deliberately stop short of a desktop entry: the URL in the main field is already the `<img src>`, which is
 * both the fallback for browsers without `<picture>` support and what a viewport wider than the last breakpoint
 * resolves to. An explicit desktop `<source>` would only restate it.
 */
export const DEFAULT_IMAGE_RESPONSIVE_BREAKPOINTS: Array<ImageResponsiveBreakpoint> = [
	{ label: 'Mobile', media: '(max-width: 767px)' },
	{ label: 'Tablet', media: '(min-width: 768px) and (max-width: 1199px)' }
];

/**
 * The icon of the "insert image via URL" buttons while
 * {@link module:image/imageconfig~ImageInsertConfig#responsive `config.image.insert.responsive`} is on, so that
 * inserting a `<picture>` is distinguishable at a glance from inserting a plain `<img>`.
 *
 * It is a glyph rather than artwork: an emoji is a single character, so it needs no path data and no separate asset
 * in the icons package, and `IconView` copies whatever SVG children it is given straight through.
 *
 * The `font-size` is in the units of the `0 0 20 20` viewBox, not pixels, and the presentation attribute is what
 * keeps `.ck-icon`'s own CSS `font-size` from being inherited and shrinking the glyph.
 */
export const IconImageResponsive: string =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">' +
		'<text x="10" y="10" font-size="16" text-anchor="middle" dominant-baseline="central">🎨</text>' +
	'</svg>';

/**
 * Resolves {@link module:image/imageconfig~ImageInsertConfig#responsive `config.image.insert.responsive`} into the
 * breakpoints the insert-image-via-URL form should offer a field for. An empty array means the plain single-URL form.
 *
 * @internal
 */
export function getImageResponsiveBreakpoints(
	responsive: ImageInsertConfig[ 'responsive' ]
): Array<ImageResponsiveBreakpoint> {
	if ( !responsive ) {
		return [];
	}

	if ( responsive === true ) {
		return DEFAULT_IMAGE_RESPONSIVE_BREAKPOINTS;
	}

	return responsive.filter( breakpoint => {
		if ( breakpoint && breakpoint.media && breakpoint.label ) {
			return true;
		}

		/**
		 * A breakpoint in {@link module:image/imageconfig~ImageInsertConfig#responsive `config.image.insert.responsive`}
		 * is missing its `label` or its `media` query, and was skipped.
		 *
		 * Both are required: `media` becomes the `media` attribute of the generated `<source>`, and `label` names
		 * the field the author types the URL into.
		 *
		 * @error image-insert-invalid-responsive-breakpoint
		 * @param {module:image/imageconfig~ImageResponsiveBreakpoint} breakpoint The offending entry.
		 */
		logWarning( 'image-insert-invalid-responsive-breakpoint', { breakpoint } );

		return false;
	} );
}
