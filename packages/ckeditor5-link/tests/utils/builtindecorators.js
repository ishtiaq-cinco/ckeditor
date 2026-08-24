/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, vi, afterEach } from 'vitest';

import { BUILTIN_LINK_DECORATORS, getBuiltinDecorators } from '../../src/utils/builtindecorators.js';

describe( 'builtin decorators', () => {
	afterEach( () => {
		vi.restoreAllMocks();
	} );

	describe( 'BUILTIN_LINK_DECORATORS', () => {
		it( 'should define manual decorators only', () => {
			for ( const definition of Object.values( BUILTIN_LINK_DECORATORS ) ) {
				expect( definition.mode ).toBe( 'manual' );
				expect( definition.label ).toBeTypeOf( 'string' );
			}
		} );

		it( 'should write the expected attributes', () => {
			expect( BUILTIN_LINK_DECORATORS.openInNewTab.attributes ).toEqual( {
				target: '_blank',
				rel: 'noopener noreferrer'
			} );

			expect( BUILTIN_LINK_DECORATORS.noFollow.attributes ).toEqual( { rel: 'nofollow' } );
			expect( BUILTIN_LINK_DECORATORS.noIndex.attributes ).toEqual( { rel: 'noindex' } );
			expect( BUILTIN_LINK_DECORATORS.sponsored.attributes ).toEqual( { rel: 'sponsored' } );
			expect( BUILTIN_LINK_DECORATORS.ugc.attributes ).toEqual( { rel: 'ugc' } );
			expect( BUILTIN_LINK_DECORATORS.downloadable.attributes ).toEqual( { download: '' } );
		} );

		it( 'should use labels that the link feature can localize', () => {
			// `getLocalizedDecorators()` matches on the label text, so these two must stay spelled
			// exactly as they are listed there or they silently stop being translated.
			expect( BUILTIN_LINK_DECORATORS.openInNewTab.label ).toBe( 'Open in a new tab' );
			expect( BUILTIN_LINK_DECORATORS.downloadable.label ).toBe( 'Downloadable' );
		} );
	} );

	describe( 'getBuiltinDecorators()', () => {
		it( 'should return nothing when the feature is off', () => {
			expect( getBuiltinDecorators( undefined ) ).toEqual( {} );
			expect( getBuiltinDecorators( false ) ).toEqual( {} );
		} );

		it( 'should return all of them for `true`', () => {
			expect( Object.keys( getBuiltinDecorators( true ) ) ).toEqual( Object.keys( BUILTIN_LINK_DECORATORS ) );
		} );

		it( 'should return only the named ones for an array', () => {
			const decorators = getBuiltinDecorators( [ 'noFollow', 'noIndex' ] );

			expect( Object.keys( decorators ) ).toEqual( [ 'noFollow', 'noIndex' ] );
			expect( decorators.noFollow ).toEqual( BUILTIN_LINK_DECORATORS.noFollow );
		} );

		it( 'should return nothing for an empty array', () => {
			expect( getBuiltinDecorators( [] ) ).toEqual( {} );
		} );

		it( 'should warn about an unknown name and skip it', () => {
			const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			const decorators = getBuiltinDecorators( [ 'noFollow', 'noSuchThing' ] );

			expect( Object.keys( decorators ) ).toEqual( [ 'noFollow' ] );
			expect( warnSpy ).toHaveBeenCalledOnce();
			expect( warnSpy.mock.calls[ 0 ].join( ' ' ) ).toContain( 'link-unknown-builtin-decorator' );
		} );

		it( 'should not pick up inherited properties', () => {
			// `name in BUILTIN_LINK_DECORATORS` must not let `toString`, `constructor` and friends through.
			const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			expect( getBuiltinDecorators( [ 'toString' ] ) ).toEqual( {} );
			expect( warnSpy ).toHaveBeenCalledOnce();
		} );
	} );
} );
