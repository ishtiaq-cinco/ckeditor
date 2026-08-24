/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { VirtualTestEditor } from '@ssmckinney/ckeditor5-core/tests/_utils/virtualtesteditor.js';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';

import { FONT_BRAND_PALETTES, addBrandColors } from '../src/brands.js';
import { FontColorEditing } from '../src/fontcolor/fontcolorediting.js';

describe( 'font brands', () => {
	afterEach( () => {
		vi.restoreAllMocks();
	} );

	describe( 'FONT_BRAND_PALETTES', () => {
		it( 'should give every colour a hex value and a label', () => {
			for ( const [ brand, colors ] of Object.entries( FONT_BRAND_PALETTES ) ) {
				expect( colors.length, brand ).toBeGreaterThan( 0 );

				for ( const option of colors ) {
					expect( option.color, brand ).toMatch( /^#[0-9A-Fa-f]{6}$/ );
					expect( option.label, brand ).toBeTypeOf( 'string' );
				}
			}
		} );

		it( 'should carry the Cinco brand colours', () => {
			expect( FONT_BRAND_PALETTES.cinco.map( c => c.color ) ).toEqual( [
				'#E80E71', '#5FAA46', '#D61F74', '#EC2C84'
			] );
		} );
	} );

	describe( 'addBrandColors()', () => {
		const palette = [ { color: 'hsl(0, 0%, 0%)', label: 'Black' } ];

		it( 'should leave the palette alone when no brand is named', () => {
			expect( addBrandColors( palette, undefined ) ).toBe( palette );
			expect( addBrandColors( palette, '' ) ).toBe( palette );
		} );

		it( 'should append the brand colours', () => {
			const result = addBrandColors( palette, 'mckinney' );

			expect( result.map( c => c.color ) ).toEqual( [ 'hsl(0, 0%, 0%)', '#212529', '#55993F' ] );
		} );

		it( 'should not modify the palette it was given', () => {
			addBrandColors( palette, 'mckinney' );

			expect( palette ).toHaveLength( 1 );
		} );

		it( 'should skip a colour the palette already has, whatever notation it is written in', () => {
			// `#000000` and `hsl(0, 0%, 0%)` are the same colour; the brand's Black must not add a second swatch.
			const result = addBrandColors( palette, 'insurecstore' );

			expect( result.map( c => c.color ) ).toEqual( [ 'hsl(0, 0%, 0%)', '#55993F' ] );
		} );

		it( 'should cope with a palette written as bare strings', () => {
			const result = addBrandColors( [ '#000000' ], 'insurecstore' );

			expect( result ).toHaveLength( 2 );
			expect( result[ 1 ].color ).toBe( '#55993F' );
		} );

		it( 'should accept brands defined by the integrator', () => {
			const result = addBrandColors( palette, 'acme', {
				acme: [ { color: '#FF6600', label: 'Acme orange' } ]
			} );

			expect( result.map( c => c.color ) ).toEqual( [ 'hsl(0, 0%, 0%)', '#FF6600' ] );
		} );

		it( 'should warn about an unknown brand and change nothing', () => {
			const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			expect( addBrandColors( palette, 'nope' ) ).toBe( palette );
			expect( warnSpy ).toHaveBeenCalledOnce();
			expect( warnSpy.mock.calls[ 0 ].join( ' ' ) ).toContain( 'font-unknown-brand' );
		} );

		it( 'should not pick up inherited properties', () => {
			const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			expect( addBrandColors( palette, 'toString' ) ).toBe( palette );
			expect( warnSpy ).toHaveBeenCalledOnce();
		} );
	} );

	describe( 'integration with FontColorEditing', () => {
		async function createEditor( fontColor ) {
			return VirtualTestEditor.create( {
				plugins: [ FontColorEditing, Paragraph ],
				fontColor
			} );
		}

		it( 'should leave the stock palette untouched with no brand', async () => {
			const editor = await createEditor( {} );

			expect( editor.config.get( 'fontColor.colors' ) ).toHaveLength( 15 );
			expect( JSON.stringify( editor.config.get( 'fontColor.colors' ) ) ).not.toContain( '#E80E71' );

			await editor.destroy();
		} );

		it( 'should append the brand colours to the stock palette', async () => {
			const editor = await createEditor( { brand: 'cinco' } );
			const colors = editor.config.get( 'fontColor.colors' );

			expect( colors ).toHaveLength( 19 );
			expect( colors.slice( -4 ).map( c => c.color ) ).toEqual( [ '#E80E71', '#5FAA46', '#D61F74', '#EC2C84' ] );

			await editor.destroy();
		} );

		it( 'should extend a palette the integrator supplied, not the stock one', async () => {
			const editor = await createEditor( {
				brand: 'mckinney',
				colors: [ { color: '#111111', label: 'Ink' } ]
			} );

			expect( editor.config.get( 'fontColor.colors' ).map( c => c.color ) ).toEqual( [
				'#111111', '#212529', '#55993F'
			] );

			await editor.destroy();
		} );

		it( 'should accept a brand defined in the configuration', async () => {
			const editor = await createEditor( {
				brand: 'acme',
				brands: { acme: [ { color: '#FF6600', label: 'Acme orange' } ] }
			} );

			const colors = editor.config.get( 'fontColor.colors' );

			expect( colors ).toHaveLength( 16 );
			expect( colors[ 15 ].color ).toBe( '#FF6600' );

			await editor.destroy();
		} );
	} );
} );
