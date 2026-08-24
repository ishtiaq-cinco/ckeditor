/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VirtualTestEditor } from '@ssmckinney/ckeditor5-core/tests/_utils/virtualtesteditor.js';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { UndoEditing } from '@ssmckinney/ckeditor5-undo';
import { _getModelData, _setModelData } from '@ssmckinney/ckeditor5-engine';

import { ListEditing } from '../../src/list/listediting.js';
import { ListPropertiesEditing } from '../../src/listproperties/listpropertiesediting.js';

describe( 'ListProperties - markers, colour and columns', () => {
	let editor, model;

	beforeEach( async () => {
		editor = await VirtualTestEditor.create( {
			plugins: [ Paragraph, UndoEditing, ListEditing, ListPropertiesEditing ],
			list: {
				properties: {
					styles: true,
					startIndex: false,
					reversed: false,
					markerColor: true,
					columns: true
				}
			}
		} );

		model = editor.model;
	} );

	afterEach( async () => {
		await editor.destroy();
	} );

	describe( 'marker styles', () => {
		it( 'should downcast a marker style to a class rather than a list-style-type', () => {
			editor.setData( '<ul><li>a</li></ul>' );

			model.change( writer => writer.setSelection( model.document.getRoot().getChild( 0 ), 0 ) );
			editor.execute( 'listStyle', { type: 'circle-tick' } );

			// `list-style-type: circle-tick` is not valid CSS, so writing it would silently render a plain dot.
			expect( editor.getData() ).toContain( 'class="ck-list-marker-circle-tick"' );
			expect( editor.getData() ).not.toContain( 'list-style-type' );
		} );

		it( 'should upcast the class back into the style', () => {
			editor.setData( '<ul class="ck-list-marker-circle-cross"><li>a</li></ul>' );

			expect( model.document.getRoot().getChild( 0 ).getAttribute( 'listStyle' ) ).toBe( 'circle-cross' );
		} );

		it( 'should prefer the marker class over a fallback list-style-type', () => {
			// What a sanitizer or another editor may leave behind: both a class and a keyword.
			editor.setData( '<ul class="ck-list-marker-circle-tick" style="list-style-type:disc"><li>a</li></ul>' );

			expect( model.document.getRoot().getChild( 0 ).getAttribute( 'listStyle' ) ).toBe( 'circle-tick' );
		} );

		it( 'should drop the class when switching to a keyword style', () => {
			editor.setData( '<ul class="ck-list-marker-circle-tick"><li>a</li></ul>' );

			model.change( writer => writer.setSelection( model.document.getRoot().getChild( 0 ), 0 ) );
			editor.execute( 'listStyle', { type: 'square' } );

			expect( editor.getData() ).not.toContain( 'ck-list-marker' );
			expect( editor.getData() ).toContain( 'list-style-type:square' );
		} );

		it( 'should swap one marker for another rather than accumulating classes', () => {
			editor.setData( '<ul class="ck-list-marker-circle-tick"><li>a</li></ul>' );

			model.change( writer => writer.setSelection( model.document.getRoot().getChild( 0 ), 0 ) );
			editor.execute( 'listStyle', { type: 'circle-cross' } );

			expect( editor.getData() ).toContain( 'class="ck-list-marker-circle-cross"' );
			expect( editor.getData() ).not.toContain( 'circle-tick' );
		} );

		it( 'should round trip', () => {
			editor.setData( '<ul class="ck-list-marker-circle-tick"><li>a</li><li>b</li></ul>' );

			const once = editor.getData();

			editor.setData( once );

			// Compared against its own first output rather than against the input, because the list feature
			// stamps a `data-list-item-id` on every item that the input does not carry.
			expect( editor.getData() ).toBe( once );
			expect( once ).toContain( 'class="ck-list-marker-circle-tick"' );
		} );
	} );

	describe( 'marker colour', () => {
		it( 'should store the colour as a custom property on the list', () => {
			editor.setData( '<ul><li>a</li></ul>' );

			model.change( writer => writer.setSelection( model.document.getRoot().getChild( 0 ), 0 ) );
			editor.execute( 'listMarkerColor', { color: '#E80E71' } );

			expect( editor.getData() ).toContain( '--ck-list-marker-color:#E80E71' );
		} );

		it( 'should upcast the custom property', () => {
			editor.setData( '<ul style="--ck-list-marker-color:#5FAA46"><li>a</li></ul>' );

			expect( model.document.getRoot().getChild( 0 ).getAttribute( 'listMarkerColor' ) ).toBe( '#5FAA46' );
		} );

		it( 'should clear the colour when none is given', () => {
			editor.setData( '<ul style="--ck-list-marker-color:#5FAA46"><li>a</li></ul>' );

			model.change( writer => writer.setSelection( model.document.getRoot().getChild( 0 ), 0 ) );
			editor.execute( 'listMarkerColor', {} );

			expect( editor.getData() ).not.toContain( '--ck-list-marker-color' );
		} );

		it( 'should default to the empty string rather than removing the attribute', () => {
			// `writer.setAttribute( key, null )` *removes* the attribute, which would leave the post-fixer
			// setting a default it can never observe — an infinite loop that freezes the editor.
			editor.setData( '<ul><li>a</li></ul>' );

			expect( model.document.getRoot().getChild( 0 ).hasAttribute( 'listMarkerColor' ) ).toBe( true );
			expect( model.document.getRoot().getChild( 0 ).getAttribute( 'listMarkerColor' ) ).toBe( '' );
		} );

		it( 'should apply to the whole list, not only the selected item', () => {
			editor.setData( '<ul><li>a</li><li>b</li><li>c</li></ul>' );

			model.change( writer => writer.setSelection( model.document.getRoot().getChild( 1 ), 0 ) );
			editor.execute( 'listMarkerColor', { color: 'red' } );

			for ( const item of model.document.getRoot().getChildren() ) {
				expect( item.getAttribute( 'listMarkerColor' ) ).toBe( 'red' );
			}
		} );

		it( 'should be undoable in one step', () => {
			editor.setData( '<ul><li>a</li><li>b</li></ul>' );

			model.change( writer => writer.setSelection( model.document.getRoot().getChild( 0 ), 0 ) );
			editor.execute( 'listMarkerColor', { color: 'red' } );
			editor.execute( 'undo' );

			expect( editor.getData() ).not.toContain( '--ck-list-marker-color' );
		} );

		it( 'should be disabled outside a list', () => {
			_setModelData( model, '<paragraph>[]foo</paragraph>' );

			expect( editor.commands.get( 'listMarkerColor' ).isEnabled ).toBe( false );
		} );

		it( 'should work on a numbered list too', () => {
			editor.setData( '<ol><li>a</li></ol>' );

			model.change( writer => writer.setSelection( model.document.getRoot().getChild( 0 ), 0 ) );
			editor.execute( 'listMarkerColor', { color: 'red' } );

			expect( editor.getData() ).toContain( '--ck-list-marker-color:red' );
		} );
	} );

	describe( 'columns', () => {
		it( 'should store the count as a class', () => {
			editor.setData( '<ul><li>a</li></ul>' );

			model.change( writer => writer.setSelection( model.document.getRoot().getChild( 0 ), 0 ) );
			editor.execute( 'listColumns', { columns: 3 } );

			expect( editor.getData() ).toContain( 'class="ck-list-columns-3"' );
		} );

		it( 'should upcast the class', () => {
			editor.setData( '<ul class="ck-list-columns-2"><li>a</li></ul>' );

			expect( model.document.getRoot().getChild( 0 ).getAttribute( 'listColumns' ) ).toBe( 2 );
		} );

		it( 'should leave no class behind for a stacked list', () => {
			editor.setData( '<ul class="ck-list-columns-3"><li>a</li></ul>' );

			model.change( writer => writer.setSelection( model.document.getRoot().getChild( 0 ), 0 ) );
			editor.execute( 'listColumns', { columns: 1 } );

			expect( editor.getData() ).not.toContain( 'class' );
		} );

		it( 'should swap one count for another rather than accumulating classes', () => {
			editor.setData( '<ul class="ck-list-columns-2"><li>a</li></ul>' );

			model.change( writer => writer.setSelection( model.document.getRoot().getChild( 0 ), 0 ) );
			editor.execute( 'listColumns', { columns: 4 } );

			expect( editor.getData() ).toContain( 'ck-list-columns-4' );
			expect( editor.getData() ).not.toContain( 'ck-list-columns-2' );
		} );

		it( 'should coexist with a marker class and a colour', () => {
			editor.setData( '<ul><li>a</li></ul>' );

			model.change( writer => writer.setSelection( model.document.getRoot().getChild( 0 ), 0 ) );
			editor.execute( 'listStyle', { type: 'circle-tick' } );
			editor.execute( 'listColumns', { columns: 2 } );
			editor.execute( 'listMarkerColor', { color: 'red' } );

			const data = editor.getData();

			expect( data ).toContain( 'ck-list-marker-circle-tick' );
			expect( data ).toContain( 'ck-list-columns-2' );
			expect( data ).toContain( '--ck-list-marker-color:red' );
		} );

		it( 'should be disabled outside a list', () => {
			_setModelData( model, '<paragraph>[]foo</paragraph>' );

			expect( editor.commands.get( 'listColumns' ).isEnabled ).toBe( false );
		} );
	} );

	describe( 'when the properties are off', () => {
		it( 'should register neither command', async () => {
			const plain = await VirtualTestEditor.create( {
				plugins: [ Paragraph, ListEditing, ListPropertiesEditing ],
				list: { properties: { styles: true } }
			} );

			expect( plain.commands.get( 'listMarkerColor' ) ).toBeUndefined();
			expect( plain.commands.get( 'listColumns' ) ).toBeUndefined();

			await plain.destroy();
		} );

		it( 'should leave the attributes off the model', async () => {
			const plain = await VirtualTestEditor.create( {
				plugins: [ Paragraph, ListEditing, ListPropertiesEditing ],
				list: { properties: { styles: true } }
			} );

			plain.setData( '<ul class="ck-list-columns-3" style="--ck-list-marker-color:red"><li>a</li></ul>' );

			expect( _getModelData( plain.model, { withoutSelection: true } ) ).not.toContain( 'listColumns' );
			expect( _getModelData( plain.model, { withoutSelection: true } ) ).not.toContain( 'listMarkerColor' );

			await plain.destroy();
		} );
	} );
} );
