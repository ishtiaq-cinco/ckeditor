/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';

import {
	LIST_MARKERS,
	LIST_COLUMN_COUNTS,
	createListMarkerStyles,
	createListColumnsStyles,
	getListColumnsClass,
	getListColumnsFromClasses,
	getListMarkerClass,
	getListMarkerFromClasses,
	isListMarkerStyle
} from '../../../src/listproperties/utils/markers.js';

describe( 'ListProperties - utils - markers', () => {
	describe( 'LIST_MARKERS', () => {
		it( 'should carry an SVG for every marker', () => {
			for ( const marker of LIST_MARKERS ) {
				expect( marker.name, marker.name ).toBeTypeOf( 'string' );
				expect( marker.svg, marker.name ).toContain( '<svg' );
			}
		} );

		it( 'should give each marker an intrinsic size', () => {
			// `list-style-image` renders an SVG without width/height at a size that has nothing to do with the
			// text beside it, so the marker artwork must declare one.
			for ( const marker of LIST_MARKERS ) {
				expect( marker.svg, marker.name ).toMatch( /width="\d+"/ );
				expect( marker.svg, marker.name ).toMatch( /height="\d+"/ );
			}
		} );

		it( 'should not reuse element ids between markers', () => {
			// Both markers end up inlined in the same document. Sharing an id makes every `<use>` resolve to
			// whichever was parsed first, so both would render as the same glyph.
			const ids = LIST_MARKERS.flatMap( marker => [ ...marker.svg.matchAll( /id="([^"]+)"/g ) ].map( m => m[ 1 ] ) );

			expect( new Set( ids ).size ).toBe( ids.length );
		} );
	} );

	describe( 'isListMarkerStyle()', () => {
		it( 'should recognise the marker styles', () => {
			expect( isListMarkerStyle( 'circle-tick' ) ).toBe( true );
			expect( isListMarkerStyle( 'circle-cross' ) ).toBe( true );
		} );

		it( 'should not recognise the CSS keyword styles', () => {
			for ( const style of [ 'disc', 'circle', 'square', 'decimal', 'default' ] ) {
				expect( isListMarkerStyle( style ), style ).toBe( false );
			}
		} );
	} );

	describe( 'getListMarkerClass() / getListMarkerFromClasses()', () => {
		it( 'should round trip a marker through its class', () => {
			for ( const marker of LIST_MARKERS ) {
				expect( getListMarkerFromClasses( [ getListMarkerClass( marker.name ) ] ) ).toBe( marker.name );
			}
		} );

		it( 'should ignore unrelated classes', () => {
			expect( getListMarkerFromClasses( [ 'foo', 'ck-list-marker-nope', 'bar' ] ) ).toBeNull();
			expect( getListMarkerFromClasses( [] ) ).toBeNull();
		} );

		it( 'should find the marker among other classes', () => {
			expect( getListMarkerFromClasses( [ 'foo', 'ck-list-marker-circle-cross' ] ) ).toBe( 'circle-cross' );
		} );
	} );

	describe( 'getListColumnsClass() / getListColumnsFromClasses()', () => {
		it( 'should round trip a column count through its class', () => {
			for ( const count of LIST_COLUMN_COUNTS ) {
				expect( getListColumnsFromClasses( [ getListColumnsClass( count ) ] ) ).toBe( count );
			}
		} );

		it( 'should report a stacked list as one column', () => {
			expect( getListColumnsFromClasses( [] ) ).toBe( 1 );
			expect( getListColumnsFromClasses( [ 'foo' ] ) ).toBe( 1 );
		} );

		it( 'should ignore a count it has no CSS for', () => {
			expect( getListColumnsFromClasses( [ 'ck-list-columns-9' ] ) ).toBe( 1 );
			expect( getListColumnsFromClasses( [ 'ck-list-columns-abc' ] ) ).toBe( 1 );
		} );
	} );

	describe( 'createListMarkerStyles()', () => {
		it( 'should emit a rule per marker', () => {
			const css = createListMarkerStyles();

			for ( const marker of LIST_MARKERS ) {
				expect( css, marker.name ).toContain( `ul.${ getListMarkerClass( marker.name ) }` );
			}
		} );

		it( 'should inline each marker as a data URI', () => {
			const css = createListMarkerStyles();

			expect( css.match( /list-style-image: url\("data:image\/svg\+xml,/g ) ).toHaveLength( LIST_MARKERS.length );
		} );

		it( 'should escape the characters that would break out of the CSS url()', () => {
			const css = createListMarkerStyles();
			const uris = [ ...css.matchAll( /url\("([^"]*)"\)/g ) ].map( m => m[ 1 ] );

			expect( uris ).toHaveLength( LIST_MARKERS.length );

			for ( const uri of uris ) {
				// A raw `#` would start a fragment and truncate the SVG; a raw `"` would end the url().
				expect( uri ).not.toContain( '#' );
				expect( uri ).not.toContain( '"' );
				expect( uri ).not.toContain( '<' );
			}
		} );

		it( 'should let the marker colour fall back to the surrounding text colour', () => {
			expect( createListMarkerStyles() ).toContain( 'color: var( --ck-list-marker-color, currentColor )' );
		} );
	} );

	describe( 'createListColumnsStyles()', () => {
		it( 'should emit a rule per column count above one', () => {
			const css = createListColumnsStyles();

			expect( css ).not.toContain( getListColumnsClass( 1 ) );

			for ( const count of LIST_COLUMN_COUNTS.filter( c => c > 1 ) ) {
				expect( css, String( count ) ).toContain( `grid-template-columns: repeat(${ count }, minmax(0, 1fr))` );
			}
		} );

		it( 'should collapse wide layouts on narrower viewports', () => {
			const css = createListColumnsStyles();

			expect( css ).toContain( '@media (max-width: 1199px)' );
			expect( css ).toContain( '@media (max-width: 767px)' );
			expect( css ).toContain( 'grid-template-columns: 1fr' );
		} );
	} );
} );
