/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * @module list/listproperties/utils/markers
 */

import { IconListMarkerCircleCross, IconListMarkerCircleTick } from '@ssmckinney/ckeditor5-icons';

/**
 * A bulleted list style whose marker is a piece of artwork rather than a shape the browser can draw.
 */
export interface ListMarkerDefinition {

	/**
	 * The `listStyle` value, e.g. `'circle-tick'`. Also the suffix of the class written to the `<ul>`.
	 */
	name: string;

	/**
	 * The SVG rendered as the list marker.
	 */
	svg: string;
}

/**
 * Prefix of the class written to a `<ul>` whose marker is one of {@link ~LIST_MARKERS}.
 */
export const LIST_MARKER_CLASS_PREFIX = 'ck-list-marker-';

/**
 * The bulleted list styles drawn from an SVG.
 *
 * Unlike `disc`, `circle` and `square`, these have no `list-style-type` keyword behind them, so they travel as a
 * class on the `<ul>` and are painted by the stylesheet {@link ~createListMarkerStyles} generates. Adding an entry
 * here is all that is needed: the style grid, the conversion and the CSS all follow from it.
 */
export const LIST_MARKERS: Array<ListMarkerDefinition> = [
	{ name: 'circle-tick', svg: IconListMarkerCircleTick },
	{ name: 'circle-cross', svg: IconListMarkerCircleCross }
];

/**
 * Whether the given `listStyle` value is one of {@link ~LIST_MARKERS} rather than a CSS `list-style-type` keyword.
 *
 * @internal
 */
export function isListMarkerStyle( listStyle: string ): boolean {
	return LIST_MARKERS.some( marker => marker.name === listStyle );
}

/**
 * The class carrying the given marker on a `<ul>`.
 *
 * @internal
 */
export function getListMarkerClass( listStyle: string ): string {
	return LIST_MARKER_CLASS_PREFIX + listStyle;
}

/**
 * The marker name a `<ul>`'s classes say it uses, or `null`.
 *
 * @internal
 */
export function getListMarkerFromClasses( classes: Iterable<string> ): string | null {
	for ( const className of classes ) {
		if ( !className.startsWith( LIST_MARKER_CLASS_PREFIX ) ) {
			continue;
		}

		const name = className.slice( LIST_MARKER_CLASS_PREFIX.length );

		if ( isListMarkerStyle( name ) ) {
			return name;
		}
	}

	return null;
}

/**
 * Prefix of the class written to a list laid out in columns.
 */
export const LIST_COLUMNS_CLASS_PREFIX = 'ck-list-columns-';

/**
 * Column counts a list can be laid out in. One column is the stacked default and carries no class.
 */
export const LIST_COLUMN_COUNTS: Array<number> = [ 1, 2, 3, 4 ];

/**
 * The class carrying the given column count on a list.
 *
 * @internal
 */
export function getListColumnsClass( columns: number ): string {
	return LIST_COLUMNS_CLASS_PREFIX + columns;
}

/**
 * The column count a list's classes say it uses, or `1` when it is a plain stacked list.
 *
 * @internal
 */
export function getListColumnsFromClasses( classes: Iterable<string> ): number {
	for ( const className of classes ) {
		if ( !className.startsWith( LIST_COLUMNS_CLASS_PREFIX ) ) {
			continue;
		}

		const columns = Number( className.slice( LIST_COLUMNS_CLASS_PREFIX.length ) );

		if ( LIST_COLUMN_COUNTS.includes( columns ) ) {
			return columns;
		}
	}

	return 1;
}

/**
 * Builds the stylesheet that paints the {@link ~LIST_MARKERS} and honours the marker colour.
 *
 * These are **content** styles, not editor chrome: a page rendering the saved HTML needs them as much as the editor
 * does, or a decorated list falls back to a plain bullet. Call this to obtain the same string for a published page
 * or a preview iframe. It is generated rather than written by hand so it cannot drift from `LIST_MARKERS`.
 *
 * The markers are `list-style-image`, which means they render with the colours they were drawn in. That is
 * deliberate — a green tick and a red cross say something the reader understands, and flattening them to one
 * tint would throw that away. The marker colour therefore applies to the plain `disc`/`circle`/`square` bullets,
 * which is what `::marker` can actually recolour.
 */
export function createListMarkerStyles(): string {
	const markerRules = LIST_MARKERS
		.map( marker =>
			`.ck-content ul.${ getListMarkerClass( marker.name ) } {\n` +
			`\tlist-style-image: url("${ toDataUri( marker.svg ) }");\n` +
			'}'
		)
		.join( '\n\n' );

	// Applied to `li` rather than to `ul`, because a nested list inherits the custom property from its parent
	// and would otherwise be unable to differ from it.
	const colorRule =
		'.ck-content ul > li::marker,\n' +
		'.ck-content ol > li::marker {\n' +
		'\tcolor: var( --ck-list-marker-color, currentColor );\n' +
		'}';

	return colorRule + '\n\n' + markerRules + '\n\n' + createListColumnsStyles();
}

/**
 * Builds the rules laying a list out in columns.
 *
 * The counts collapse as the viewport narrows — four columns become two on a tablet and one on a phone — so that
 * a wide layout chosen on a desktop does not turn into a column of single characters on a narrow screen. Like the
 * marker rules, these are content styles that a page rendering the saved HTML needs too.
 */
export function createListColumnsStyles(): string {
	const rules = LIST_COLUMN_COUNTS
		.filter( columns => columns > 1 )
		.map( columns =>
			`.ck-content ul.${ getListColumnsClass( columns ) },\n` +
			`.ck-content ol.${ getListColumnsClass( columns ) } {\n` +
			'\tdisplay: grid;\n' +
			`\tgrid-template-columns: repeat(${ columns }, minmax(0, 1fr));\n` +
			'\tcolumn-gap: 2rem;\n' +
			'}'
		)
		.join( '\n\n' );

	const wideCollapse = LIST_COLUMN_COUNTS
		.filter( columns => columns > 2 )
		.map( columns =>
			`\t.ck-content ul.${ getListColumnsClass( columns ) },\n` +
			`\t.ck-content ol.${ getListColumnsClass( columns ) } {\n` +
			'\t\tgrid-template-columns: repeat(2, minmax(0, 1fr));\n' +
			'\t}'
		)
		.join( '\n\n' );

	const narrowCollapse = LIST_COLUMN_COUNTS
		.filter( columns => columns > 1 )
		.map( columns =>
			`\t.ck-content ul.${ getListColumnsClass( columns ) },\n` +
			`\t.ck-content ol.${ getListColumnsClass( columns ) } {\n` +
			'\t\tgrid-template-columns: 1fr;\n' +
			'\t}'
		)
		.join( '\n\n' );

	return rules + '\n\n' +
		'@media (max-width: 1199px) {\n' + wideCollapse + '\n}\n\n' +
		'@media (max-width: 767px) {\n' + narrowCollapse + '\n}\n';
}

/**
 * Encodes an SVG as a `data:` URI.
 *
 * Percent-encoding rather than base64: it survives a CSS `url("...")` unescaped, keeps the SVG readable in
 * devtools, and does not pay base64's 33% size penalty. Only the characters that would actually break out of the
 * quoted string or the URI are escaped.
 */
function toDataUri( svg: string ): string {
	const encoded = svg
		.trim()
		.replace( /\s+/g, ' ' )
		.replace( /[%#<>?[\]^`{|}"]/g, character => '%' + character.charCodeAt( 0 ).toString( 16 ).toUpperCase() );

	return `data:image/svg+xml,${ encoded }`;
}
