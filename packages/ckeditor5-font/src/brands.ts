/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * @module font/brands
 */

import { _convertColorToHex, type ColorOption } from '@ssmckinney/ckeditor5-ui';
import { logWarning } from '@ssmckinney/ckeditor5-utils';

/**
 * The brand palettes that ship with the font feature, keyed by the name accepted by
 * {@link module:font/fontconfig~FontColorConfig#brand `config.fontColor.brand`}.
 *
 * These are additions to the default palette rather than a replacement for it: an editor that names no brand gets
 * the stock colours and nothing else, and one that names a brand gets the stock colours plus these.
 */
export const FONT_BRAND_PALETTES: Record<string, Array<ColorOption>> = {
	cinco: [
		{ color: '#E80E71', label: 'Pink' },
		{ color: '#5FAA46', label: 'Leaf green' },
		{ color: '#D61F74', label: 'Dark pink' },
		{ color: '#EC2C84', label: 'Light pink' }
	],

	mckinney: [
		{ color: '#212529', label: 'Dark blue' },
		{ color: '#55993F', label: 'Green' }
	],

	insurecstore: [
		{ color: '#000000', label: 'Black' },
		{ color: '#55993F', label: 'Green' }
	]
};

/**
 * Appends a brand's colours to a palette.
 *
 * Colours the palette already offers are skipped, so naming a brand cannot produce two swatches of the same colour.
 * The comparison is made on the hex value rather than on the written form, because the stock palette is expressed
 * in `hsl()` while a brand hands over hex — `#000000` and `hsl(0, 0%, 0%)` are the same colour written two ways.
 *
 * @internal
 * @param colors The palette to append to. It is not modified.
 * @param brand The brand named in the configuration, if any.
 * @param brands Brand palettes, including any the integrator defined.
 */
export function addBrandColors(
	colors: Array<string | ColorOption>,
	brand: string | undefined,
	brands: Record<string, Array<ColorOption>> = FONT_BRAND_PALETTES
): Array<string | ColorOption> {
	if ( !brand ) {
		return colors;
	}

	// `hasOwnProperty` rather than a plain lookup, so that `toString` and the rest of the prototype chain are
	// reported as unknown instead of being handed back as a palette.
	// Replace with Object.hasOwn() when we upgrade to es2022.
	const brandColors = Object.prototype.hasOwnProperty.call( brands, brand ) ? brands[ brand ] : undefined;

	if ( !brandColors ) {
		/**
		 * The {@link module:font/fontconfig~FontColorConfig#brand `config.fontColor.brand`} configuration names a
		 * brand that has no palette.
		 *
		 * Check the spelling against {@link module:font/brands~FONT_BRAND_PALETTES}, or define the brand yourself
		 * in {@link module:font/fontconfig~FontColorConfig#brands `config.fontColor.brands`}.
		 *
		 * @error font-unknown-brand
		 * @param {string} brand The name that could not be resolved.
		 */
		logWarning( 'font-unknown-brand', { brand } );

		return colors;
	}

	const seen = new Set( colors.map( getComparableColor ) );
	const result: Array<string | ColorOption> = [ ...colors ];

	for ( const option of brandColors ) {
		const comparable = getComparableColor( option );

		if ( seen.has( comparable ) ) {
			continue;
		}

		seen.add( comparable );
		result.push( option );
	}

	return result;
}

/**
 * The value a colour option should be compared by, lowercased hex where the colour can be parsed as one.
 *
 * Falls back to the written form for anything `convertToHex()` cannot make sense of — a CSS variable, say — which
 * at worst means an exact duplicate slips through rather than a wrong colour being dropped.
 */
function getComparableColor( option: string | ColorOption ): string {
	const color = typeof option === 'string' ? option : option.color;
	const hex = _convertColorToHex( color );

	return ( hex || color ).toLowerCase();
}
