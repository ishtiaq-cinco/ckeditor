/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VirtualTestEditor } from '@ssmckinney/ckeditor5-core/tests/_utils/virtualtesteditor.js';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { _setModelData } from '@ssmckinney/ckeditor5-engine';

import { ReplaceImageSourceCommand } from '../../src/image/replaceimagesourcecommand.js';
import { ImageBlockEditing } from '../../src/image/imageblockediting.js';
import { ImageInlineEditing } from '../../src/image/imageinlineediting.js';

describe( 'ReplaceImageSourceCommand', () => {
	let editor, command, model;

	beforeEach( () => {
		return VirtualTestEditor
			.create( {
				plugins: [ ImageBlockEditing, ImageInlineEditing, Paragraph ]
			} )
			.then( newEditor => {
				editor = newEditor;
				model = editor.model;

				command = new ReplaceImageSourceCommand( editor );

				const schema = model.schema;
				schema.extend( 'imageBlock', { allowAttributes: 'uploadId' } );
			} );
	} );

	afterEach( () => {
		return editor.destroy();
	} );

	describe( 'execute()', () => {
		it( 'should change image source', () => {
			_setModelData( model, '[<imageBlock src="sample.png"></imageBlock>]' );

			const element = model.document.selection.getSelectedElement();

			command.execute( { source: '/sample.png' } );

			expect( element.getAttribute( 'src' ) ).toBe( '/sample.png' );
		} );

		it( 'should clean up some attributes in responsive image', () => {
			_setModelData( model, `[<imageBlock
				src="sample.png"
				width="100"
				height="200"
				myCustomId="id"
				alt="Example image"
				sources="[{srcset:'url', sizes:'100vw, 1920px', type: 'image/webp'}]"
			></imageBlock>]` );

			const element = model.document.selection.getSelectedElement();

			expect( element.getAttribute( 'src' ) ).toBe( 'sample.png' );
			expect( element.getAttribute( 'sources' ) ).toBe( '[{srcset:\'url\', sizes:\'100vw, 1920px\', type: \'image/webp\'}]' );
			expect( element.getAttribute( 'width' ) ).toBe( 100 );
			expect( element.getAttribute( 'height' ) ).toBe( 200 );
			expect( element.getAttribute( 'alt' ) ).toBe( 'Example image' );
			expect( element.getAttribute( 'myCustomId' ) ).toBe( 'id' );

			command.on( 'cleanupImage', ( eventInfo, [ writer, image ] ) => {
				writer.removeAttribute( 'myCustomId', image );
			} );
			command.execute( { source: '/sample.png' } );

			expect( element.getAttribute( 'src' ) ).toBe( '/sample.png' );
			expect( element.getAttribute( 'sources' ) ).toBeUndefined();
			expect( element.getAttribute( 'width' ) ).toBeUndefined();
			expect( element.getAttribute( 'height' ) ).toBeUndefined();
			expect( element.getAttribute( 'alt' ) ).toBeUndefined();
			expect( element.getAttribute( 'myCustomId' ) ).toBeUndefined();
		} );

		it( 'should set width and height on replaced image', () => {
			return new Promise( resolve => {
				_setModelData( model, `[<imageBlock
					src="sample.png"
					width="100"
					height="200"
					myCustomId="id"
					alt="Example image"
					sources="[{srcset:'url', sizes:'100vw, 1920px', type: 'image/webp'}]"
				></imageBlock>]` );

				const element = model.document.selection.getSelectedElement();

				command.execute( { source: '/sample.png' } );

				setTimeout( () => {
					expect( element.getAttribute( 'width' ) ).toBe( 96 );
					expect( element.getAttribute( 'height' ) ).toBe( 96 );
					resolve();
				}, 100 );
			} );
		} );
	} );

	describe( 'responsive sources', () => {
		const SOURCES = [
			{ srcset: 'small.png', media: '(max-width: 767px)' }
		];

		beforeEach( () => {
			model.schema.extend( 'imageBlock', { allowAttributes: 'sources' } );
		} );

		it( 'should set the given sources on the image', () => {
			_setModelData( model, '[<imageBlock src="sample.png"></imageBlock>]' );

			const element = model.document.selection.getSelectedElement();

			command.execute( { source: '/large.png', sources: SOURCES } );

			expect( element.getAttribute( 'src' ) ).toBe( '/large.png' );
			expect( element.getAttribute( 'sources' ) ).toEqual( SOURCES );
		} );

		it( 'should replace the previous sources rather than merge with them', () => {
			_setModelData( model, '[<imageBlock src="sample.png"></imageBlock>]' );

			const element = model.document.selection.getSelectedElement();

			command.execute( { source: '/a.png', sources: [ { srcset: 'old.png', media: '(max-width: 500px)' } ] } );
			command.execute( { source: '/b.png', sources: SOURCES } );

			expect( element.getAttribute( 'sources' ) ).toEqual( SOURCES );
		} );

		it( 'should drop the previous sources when none are given', () => {
			// They describe the previous `src`, so carrying them over to a new one would be wrong.
			// See https://github.com/ssmckinney/ckeditor5/issues/15093.
			_setModelData( model, '[<imageBlock src="sample.png"></imageBlock>]' );

			const element = model.document.selection.getSelectedElement();

			command.execute( { source: '/large.png', sources: SOURCES } );
			command.execute( { source: '/other.png' } );

			expect( element.hasAttribute( 'sources' ) ).toBe( false );
		} );

		it( 'should treat an empty array as no sources', () => {
			_setModelData( model, '[<imageBlock src="sample.png"></imageBlock>]' );

			const element = model.document.selection.getSelectedElement();

			command.execute( { source: '/large.png', sources: SOURCES } );
			command.execute( { source: '/other.png', sources: [] } );

			expect( element.hasAttribute( 'sources' ) ).toBe( false );
		} );

		it( 'should survive a custom cleanupImage() that also clears sources', () => {
			// `cleanupImage` is decorated and runs before the new sources are applied, so an integrator
			// hooking into it cannot accidentally wipe what the caller just asked for.
			_setModelData( model, '[<imageBlock src="sample.png"></imageBlock>]' );

			const element = model.document.selection.getSelectedElement();

			command.on( 'cleanupImage', ( evt, [ writer, image ] ) => {
				writer.removeAttribute( 'sources', image );
			} );

			command.execute( { source: '/large.png', sources: SOURCES } );

			expect( element.getAttribute( 'sources' ) ).toEqual( SOURCES );
		} );
	} );

	describe( 'refresh()', () => {
		it( 'should be enabled when selected element is an image', () => {
			_setModelData( model, '[<imageBlock src="sample.png"></imageBlock>]' );

			expect( command.isEnabled ).toBe( true );
		} );

		it( 'should not enabled when selected element is not an image', () => {
			_setModelData( model, '[<paragraph>Foo</paragraph>]' );

			expect( command.isEnabled ).toBe( false );
		} );

		it( 'should store element src value', () => {
			_setModelData( model, '[<imageBlock src="sample.png"></imageBlock>]' );

			const element = model.document.selection.getSelectedElement();

			expect( element.getAttribute( 'src' ) ).toBe( command.value );
		} );
	} );
} );
