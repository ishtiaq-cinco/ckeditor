/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, vi, afterEach } from 'vitest';

import {
	DEFAULT_IMAGE_RESPONSIVE_BREAKPOINTS,
	getImageResponsiveBreakpoints
} from '../../src/imageinsert/utils.js';

describe( 'image insert utils', () => {
	afterEach( () => {
		vi.restoreAllMocks();
	} );

	describe( 'DEFAULT_IMAGE_RESPONSIVE_BREAKPOINTS', () => {
		it( 'should describe every breakpoint with a label and a media query', () => {
			for ( const breakpoint of DEFAULT_IMAGE_RESPONSIVE_BREAKPOINTS ) {
				expect( breakpoint.label ).toBeTypeOf( 'string' );
				expect( breakpoint.media ).toBeTypeOf( 'string' );
			}
		} );

		it( 'should not define a desktop breakpoint', () => {
			// The widest viewport is served by the `<img src>` itself, so an explicit `<source>` for it
			// would only restate the fallback.
			expect( DEFAULT_IMAGE_RESPONSIVE_BREAKPOINTS.map( b => b.label ) ).toEqual( [ 'Mobile', 'Tablet' ] );
		} );

		it( 'should not leave a gap between the breakpoints and the fallback', () => {
			expect( DEFAULT_IMAGE_RESPONSIVE_BREAKPOINTS[ 0 ].media ).toBe( '(max-width: 767px)' );
			expect( DEFAULT_IMAGE_RESPONSIVE_BREAKPOINTS[ 1 ].media ).toBe( '(min-width: 768px) and (max-width: 1199px)' );
		} );
	} );

	describe( 'getImageResponsiveBreakpoints()', () => {
		it( 'should return nothing when the feature is off', () => {
			expect( getImageResponsiveBreakpoints( undefined ) ).toEqual( [] );
			expect( getImageResponsiveBreakpoints( false ) ).toEqual( [] );
		} );

		it( 'should return the defaults for `true`', () => {
			expect( getImageResponsiveBreakpoints( true ) ).toEqual( DEFAULT_IMAGE_RESPONSIVE_BREAKPOINTS );
		} );

		it( 'should pass a configured list through', () => {
			const breakpoints = [ { label: 'Watch', media: '(max-width: 320px)' } ];

			expect( getImageResponsiveBreakpoints( breakpoints ) ).toEqual( breakpoints );
		} );

		it( 'should return nothing for an empty list', () => {
			expect( getImageResponsiveBreakpoints( [] ) ).toEqual( [] );
		} );

		it( 'should warn about and skip a breakpoint with no media query', () => {
			const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			const breakpoints = getImageResponsiveBreakpoints( [
				{ label: 'Mobile', media: '(max-width: 767px)' },
				{ label: 'Broken' }
			] );

			expect( breakpoints ).toEqual( [ { label: 'Mobile', media: '(max-width: 767px)' } ] );
			expect( warnSpy ).toHaveBeenCalledOnce();
			expect( warnSpy.mock.calls[ 0 ].join( ' ' ) ).toContain( 'image-insert-invalid-responsive-breakpoint' );
		} );

		it( 'should warn about and skip a breakpoint with no label', () => {
			const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			expect( getImageResponsiveBreakpoints( [ { media: '(max-width: 767px)' } ] ) ).toEqual( [] );
			expect( warnSpy ).toHaveBeenCalledOnce();
		} );
	} );
} );
