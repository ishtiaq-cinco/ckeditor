/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ClassicTestEditor } from '@ssmckinney/ckeditor5-core/tests/_utils/classictesteditor.js';
import { UIModel, SplitButtonView, ButtonView, MenuBarMenuListItemButtonView } from '@ssmckinney/ckeditor5-ui';

import { IconImageUrl } from '@ssmckinney/ckeditor5-icons';

import { IconImageResponsive } from '../../src/imageinsert/utils.js';

import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';

import { Image } from '../../src/image.js';
import { PictureEditing } from '../../src/pictureediting.js';
import { ImageInsertViaUrlUI } from '../../src/imageinsert/imageinsertviaurlui.js';
import { ImageInsertViaUrl } from '../../src/index.js';

describe( 'ImageInsertViaUrlUI', () => {
	let editor, editorElement, insertImageUI, button;

	afterEach( () => {
		vi.restoreAllMocks();
	} );

	afterEach( async () => {
		if ( editorElement ) {
			editorElement.remove();
		}

		if ( editor ) {
			await editor.destroy();
		}
	} );

	it( 'should have pluginName', () => {
		expect( ImageInsertViaUrlUI.pluginName ).toBe( 'ImageInsertViaUrlUI' );
	} );

	it( 'should have `isOfficialPlugin` static flag set to `true`', () => {
		expect( ImageInsertViaUrlUI.isOfficialPlugin ).toBe( true );
	} );

	it( 'should have `isPremiumPlugin` static flag set to `false`', () => {
		expect( ImageInsertViaUrlUI.isPremiumPlugin ).toBe( false );
	} );

	// https://github.com/ssmckinney/ckeditor5/issues/15869
	it( 'should work if ImageInsertViaUrl plugin is specified before Image', async () => {
		await createEditor( {
			plugins: [ ImageInsertViaUrl, Image ]
		} );

		editor.ui.componentFactory.create( 'insertImage' );
	} );

	describe( 'UI components', () => {
		beforeEach( async () => {
			await createEditor( {
				plugins: [ Image, ImageInsertViaUrl ]
			} );
		} );

		describe( 'toolbar button', () => {
			beforeEach( () => {
				button = editor.ui.componentFactory.create( 'insertImageViaUrl' );
			} );

			testButton( ButtonView, 'Insert image via URL' );

			it( 'should bind button label to ImageInsertUI#isImageSelected', () => {
				expect( button.label ).toBe( 'Insert image via URL' );

				insertImageUI.isImageSelected = true;
				expect( button.label ).toBe( 'Update image URL' );

				insertImageUI.isImageSelected = false;
				expect( button.label ).toBe( 'Insert image via URL' );
			} );

			it( 'should have a tooltip', () => {
				expect( button.tooltip ).toBe( true );
			} );
		} );

		describe( 'menu bar button', () => {
			beforeEach( () => {
				button = editor.ui.componentFactory.create( 'menuBar:insertImageViaUrl' );
			} );

			testButton( MenuBarMenuListItemButtonView, 'Image via URL' );
		} );
	} );

	describe( 'dialog', () => {
		let dialog, urlView, acceptButton, cancelButton;

		function openDialog() {
			button.fire( 'execute' );
			urlView = dialog.view.contentView.children.get( 0 );
			cancelButton = dialog.view.actionsView.children.get( 0 );
			acceptButton = dialog.view.actionsView.children.get( 1 );
		}

		beforeEach( async () => {
			await createEditor( {
				plugins: [ Image, ImageInsertViaUrl ]
			} );

			button = editor.ui.componentFactory.create( 'insertImageViaUrl' );
			dialog = editor.plugins.get( 'Dialog' );
			const replaceImageSourceCommand = editor.commands.get( 'replaceImageSource' );
			replaceImageSourceCommand.value = 'foobar';

			openDialog();
		} );

		it( 'has two action buttons', () => {
			expect( dialog.view.actionsView.children ).toHaveLength( 2 );
			expect( dialog.view.actionsView.children.get( 0 ).label ).toBe( 'Cancel' );
			expect( dialog.view.actionsView.children.get( 1 ).label ).toBe( 'Insert' );
		} );

		it( 'has submittable form', () => {
			expect( dialog.view.element.querySelector( 'form.ck-image-insert-url' ) ).toBeTruthy();
		} );

		it( 'should bind #isImageSelected', () => {
			expect( urlView.isImageSelected ).toBe( false );

			insertImageUI.isImageSelected = true;
			expect( urlView.isImageSelected ).toBe( true );

			insertImageUI.isImageSelected = false;
			expect( urlView.isImageSelected ).toBe( false );
		} );

		it( 'should have a title', () => {
			const showSpy = vi.spyOn( dialog, 'show' );

			dialog.hide();
			openDialog();

			expect( showSpy ).toHaveBeenCalledWith( expect.objectContaining( { title: 'Image via URL' } ) );
		} );

		it( 'should show save button if image is selected', () => {
			dialog.hide();
			insertImageUI.isImageSelected = true;
			openDialog();

			expect( dialog.view.actionsView.children.get( 1 ).label ).toBe( 'Save' );
		} );

		it( 'should show insert button if image is not selected', () => {
			dialog.hide();
			insertImageUI.isImageSelected = false;
			openDialog();

			expect( dialog.view.actionsView.children.get( 1 ).label ).toBe( 'Insert' );
		} );

		it( 'should bind #isEnabled', () => {
			const replaceImageSourceCommand = editor.commands.get( 'replaceImageSource' );
			const insertImageCommand = editor.commands.get( 'insertImage' );

			replaceImageSourceCommand.isEnabled = false;
			insertImageCommand.isEnabled = false;
			expect( urlView.isEnabled ).toBe( false );

			replaceImageSourceCommand.isEnabled = true;
			insertImageCommand.isEnabled = false;
			expect( urlView.isEnabled ).toBe( true );

			replaceImageSourceCommand.isEnabled = false;
			insertImageCommand.isEnabled = true;
			expect( urlView.isEnabled ).toBe( true );

			replaceImageSourceCommand.isEnabled = true;
			insertImageCommand.isEnabled = true;
			expect( urlView.isEnabled ).toBe( true );
		} );

		it( 'should set #imageURLInputValue at open', () => {
			expect( urlView.imageURLInputValue ).toBe( 'foobar' );
		} );

		it( 'should reset #imageURLInputValue on dialog reopen', () => {
			const replaceImageSourceCommand = editor.commands.get( 'replaceImageSource' );

			replaceImageSourceCommand.value = 'abc';
			dialog.hide();
			openDialog();
			expect( urlView.imageURLInputValue ).toBe( 'abc' );

			replaceImageSourceCommand.value = '123';
			dialog.hide();
			openDialog();
			expect( urlView.imageURLInputValue ).toBe( '123' );

			replaceImageSourceCommand.value = undefined;
			dialog.hide();
			openDialog();
			expect( urlView.imageURLInputValue ).toBe( '' );
		} );

		testSubmit( 'accept button', () => acceptButton.fire( 'execute' ) );

		// Browsers handle pressing Enter on forms natively by submitting it. We fire a form submit event to simulate that behavior.
		testSubmit( 'form submit (enter key)', () => {
			const form = dialog.view.contentView.children.get( 0 );

			form.fire( 'submit' );
		} );

		function testSubmit( suiteName, action ) {
			describe( suiteName, () => {
				it( 'should execute replaceImageSource command and close dialog', () => {
					const replaceImageSourceCommand = editor.commands.get( 'replaceImageSource' );
					const stubExecute = vi.spyOn( editor, 'execute' ).mockImplementation( () => {} );
					const stubFocus = vi.spyOn( editor.editing.view, 'focus' ).mockImplementation( () => {} );

					replaceImageSourceCommand.isEnabled = true;
					urlView.imageURLInputValue = 'foo';

					action();

					expect( stubExecute ).toHaveBeenCalledOnce();
					expect( stubExecute.mock.calls[ 0 ][ 0 ] ).toBe( 'replaceImageSource' );
					expect( stubExecute.mock.calls[ 0 ][ 1 ] ).toEqual( { source: 'foo' } );
					expect( stubFocus ).toHaveBeenCalledOnce();
					expect( dialog.id ).toBeNull();
				} );

				it( 'should execute insertImage command', () => {
					const replaceImageSourceCommand = editor.commands.get( 'insertImage' );
					const stubExecute = vi.spyOn( editor, 'execute' ).mockImplementation( () => {} );
					const stubFocus = vi.spyOn( editor.editing.view, 'focus' ).mockImplementation( () => {} );

					replaceImageSourceCommand.isEnabled = true;
					urlView.imageURLInputValue = 'foo';

					action();

					expect( stubExecute ).toHaveBeenCalledOnce();
					expect( stubExecute.mock.calls[ 0 ][ 0 ] ).toBe( 'insertImage' );
					expect( stubExecute.mock.calls[ 0 ][ 1 ] ).toEqual( { source: 'foo' } );
					expect( stubFocus ).toHaveBeenCalledOnce();
					expect( dialog.id ).toBeNull();
				} );
			} );
		}

		it( 'should close dropdown', () => {
			const stubExecute = vi.spyOn( editor, 'execute' ).mockImplementation( () => {} );
			const stubFocus = vi.spyOn( editor.editing.view, 'focus' ).mockImplementation( () => {} );

			cancelButton.fire( 'execute' );

			expect( stubExecute ).not.toHaveBeenCalled();
			expect( stubFocus ).toHaveBeenCalledOnce();
			expect( dialog.id ).toBeNull();
		} );
	} );

	describe( 'ImageInsertUI integration', () => {
		describe( 'single integration', () => {
			beforeEach( async () => {
				await createEditor( {
					plugins: [ Image, ImageInsertViaUrl ]
				} );
			} );

			describe( 'toolbar button', () => {
				beforeEach( () => {
					button = editor.ui.componentFactory.create( 'insertImage' );
				} );

				testButton( ButtonView, 'Insert image via URL' );

				it( 'should bind button label to ImageInsertUI#isImageSelected', () => {
					expect( button.label ).toBe( 'Insert image via URL' );

					insertImageUI.isImageSelected = true;
					expect( button.label ).toBe( 'Update image URL' );

					insertImageUI.isImageSelected = false;
					expect( button.label ).toBe( 'Insert image via URL' );
				} );

				it( 'should have a tooltip', () => {
					expect( button.tooltip ).toBe( true );
				} );
			} );

			describe( 'menu bar button', () => {
				beforeEach( () => {
					const menu = editor.ui.componentFactory.create( 'menuBar:insertImage' );
					const submenuList = menu.panelView.children.get( 0 );

					button = submenuList.items.get( 0 ).children.get( 0 );
				} );

				testButton( MenuBarMenuListItemButtonView, 'Image' );
			} );
		} );

		describe( 'multiple integrations', () => {
			beforeEach( async () => {
				await createEditor( {
					plugins: [ Image, ImageInsertViaUrl ]
				} );

				const observable = new UIModel( { isEnabled: true } );

				insertImageUI.registerIntegration( {
					name: 'foo',
					observable,
					buttonViewCreator() {
						const button = new ButtonView( editor.locale );

						button.label = 'foo';

						return button;
					},
					formViewCreator() {
						const button = new ButtonView( editor.locale );

						button.label = 'bar';

						return button;
					},
					menuBarButtonViewCreator() {
						const button = new ButtonView( editor.locale );

						button.label = 'baz';

						return button;
					}
				} );

				editor.config.set( 'image.insert.integrations', [ 'url', 'foo' ] );
			} );

			describe( 'toolbar button', () => {
				it( 'should create toolbar split button view', () => {
					const dropdown = editor.ui.componentFactory.create( 'insertImage' );

					expect( dropdown.buttonView ).toBeInstanceOf( SplitButtonView );
					expect( dropdown.buttonView.tooltip ).toBe( true );
					expect( dropdown.buttonView.label ).toBe( 'Insert image' );
					expect( dropdown.buttonView.actionView.icon ).toBe( IconImageUrl );
					expect( dropdown.buttonView.actionView.tooltip ).toBe( true );
					expect( dropdown.buttonView.actionView.label ).toBe( 'Insert image via URL' );
				} );

				it( 'should bind button label to ImageInsertUI#isImageSelected', () => {
					const dropdown = editor.ui.componentFactory.create( 'insertImage' );

					expect( dropdown.buttonView.label ).toBe( 'Insert image' );
					expect( dropdown.buttonView.actionView.label ).toBe( 'Insert image via URL' );

					insertImageUI.isImageSelected = true;
					expect( dropdown.buttonView.label ).toBe( 'Replace image' );
					expect( dropdown.buttonView.actionView.label ).toBe( 'Update image URL' );

					insertImageUI.isImageSelected = false;
					expect( dropdown.buttonView.label ).toBe( 'Insert image' );
					expect( dropdown.buttonView.actionView.label ).toBe( 'Insert image via URL' );
				} );
			} );

			describe( 'dropdown button', () => {
				beforeEach( () => {
					const dropdown = editor.ui.componentFactory.create( 'insertImage' );

					dropdown.isOpen = true;

					const formView = dropdown.panelView.children.get( 0 );
					button = formView.children.get( 0 );
				} );

				testButton( ButtonView, 'Insert via URL' );

				it( 'should bind button label to ImageInsertUI#isImageSelected', () => {
					expect( button.label ).toBe( 'Insert via URL' );

					insertImageUI.isImageSelected = true;
					expect( button.label ).toBe( 'Update image URL' );

					insertImageUI.isImageSelected = false;
					expect( button.label ).toBe( 'Insert via URL' );
				} );
			} );

			describe( 'menu button', () => {
				beforeEach( () => {
					const submenu = editor.ui.componentFactory.create( 'menuBar:insertImage' );
					button = submenu.panelView.children.first.items.first.children.first;
				} );

				testButton( MenuBarMenuListItemButtonView, 'Via URL' );
			} );
		} );
	} );

	describe( 'responsive breakpoints', () => {
		let dialog, urlView, acceptButton;

		const BREAKPOINTS = [
			{ label: 'Mobile', media: '(max-width: 767px)' },
			{ label: 'Tablet', media: '(min-width: 768px) and (max-width: 1199px)' }
		];

		function openDialog() {
			button.fire( 'execute' );
			urlView = dialog.view.contentView.children.get( 0 );
			acceptButton = dialog.view.actionsView.children.get( 1 );
		}

		async function createResponsiveEditor( responsive = BREAKPOINTS ) {
			await createEditor( {
				plugins: [ Image, ImageInsertViaUrl, PictureEditing, Paragraph ],
				image: {
					insert: { responsive }
				}
			} );

			button = editor.ui.componentFactory.create( 'insertImageViaUrl' );
			dialog = editor.plugins.get( 'Dialog' );
		}

		function fillBreakpoint( index, value ) {
			urlView.breakpointInputViews[ index ].fieldView.element.value = value;
		}

		it( 'should not add any fields when the feature is off', async () => {
			await createEditor( { plugins: [ Image, ImageInsertViaUrl, PictureEditing, Paragraph ] } );

			button = editor.ui.componentFactory.create( 'insertImageViaUrl' );
			dialog = editor.plugins.get( 'Dialog' );

			openDialog();

			expect( urlView.breakpoints ).toEqual( [] );
			expect( urlView.breakpointInputViews ).toEqual( [] );
		} );

		it( 'should add one field per configured breakpoint', async () => {
			await createResponsiveEditor();
			openDialog();

			expect( urlView.breakpointInputViews ).toHaveLength( 2 );
			expect( urlView.breakpointInputViews[ 0 ].label ).toBe( 'Mobile' );
			expect( urlView.breakpointInputViews[ 1 ].label ).toBe( 'Tablet' );
			expect( urlView.breakpointInputViews[ 0 ].infoText ).toBe( '(max-width: 767px)' );
		} );

		it( 'should insert a picture from the filled fields', async () => {
			await createResponsiveEditor();
			openDialog();

			urlView.imageURLInputValue = 'large.png';
			fillBreakpoint( 0, 'small.png' );
			fillBreakpoint( 1, 'medium.png' );

			const stubExecute = vi.spyOn( editor, 'execute' ).mockImplementation( () => {} );

			acceptButton.fire( 'execute' );

			expect( stubExecute.mock.calls[ 0 ][ 0 ] ).toBe( 'insertImage' );
			expect( stubExecute.mock.calls[ 0 ][ 1 ] ).toEqual( {
				source: {
					src: 'large.png',
					sources: [
						{ srcset: 'small.png', media: '(max-width: 767px)' },
						{ srcset: 'medium.png', media: '(min-width: 768px) and (max-width: 1199px)' }
					]
				}
			} );
		} );

		it( 'should skip a breakpoint left blank rather than emit an empty source', async () => {
			await createResponsiveEditor();
			openDialog();

			urlView.imageURLInputValue = 'large.png';
			fillBreakpoint( 0, 'small.png' );

			const stubExecute = vi.spyOn( editor, 'execute' ).mockImplementation( () => {} );

			acceptButton.fire( 'execute' );

			expect( stubExecute.mock.calls[ 0 ][ 1 ].source.sources ).toEqual( [
				{ srcset: 'small.png', media: '(max-width: 767px)' }
			] );
		} );

		it( 'should fall back to the plain call shape when no breakpoint is filled', async () => {
			await createResponsiveEditor();
			openDialog();

			urlView.imageURLInputValue = 'large.png';

			const stubExecute = vi.spyOn( editor, 'execute' ).mockImplementation( () => {} );

			acceptButton.fire( 'execute' );

			expect( stubExecute.mock.calls[ 0 ][ 1 ] ).toEqual( { source: 'large.png' } );
		} );

		it( 'should round trip a picture through the document', async () => {
			await createResponsiveEditor();

			editor.setData(
				'<figure class="image"><picture>' +
					'<source media="(max-width: 767px)" srcset="small.png">' +
					'<img src="large.png">' +
				'</picture></figure>'
			);

			expect( editor.getData() ).toBe(
				'<figure class="image"><picture>' +
					'<source srcset="small.png" media="(max-width: 767px)">' +
					'<img src="large.png">' +
				'</picture></figure>'
			);
		} );

		describe( 'editing an existing image', () => {
			beforeEach( async () => {
				await createResponsiveEditor();

				editor.setData(
					'<figure class="image"><picture>' +
						'<source media="(max-width: 767px)" srcset="small.png">' +
						'<source media="(min-width: 768px) and (max-width: 1199px)" srcset="medium.png">' +
						'<img src="large.png">' +
					'</picture></figure>'
				);

				editor.model.change( writer => {
					writer.setSelection( editor.model.document.getRoot().getChild( 0 ), 'on' );
				} );
			} );

			it( 'should prefill every field from the selected image', () => {
				openDialog();

				expect( urlView.imageURLInputValue ).toBe( 'large.png' );
				expect( urlView.breakpointInputViews[ 0 ].fieldView.value ).toBe( 'small.png' );
				expect( urlView.breakpointInputViews[ 1 ].fieldView.value ).toBe( 'medium.png' );
			} );

			it( 'should keep the sources when only the main URL changes', () => {
				openDialog();

				urlView.imageURLInputValue = 'huge.png';

				acceptButton.fire( 'execute' );

				expect( editor.getData() ).toBe(
					'<figure class="image"><picture>' +
						'<source srcset="small.png" media="(max-width: 767px)">' +
						'<source srcset="medium.png" media="(min-width: 768px) and (max-width: 1199px)">' +
						'<img src="huge.png">' +
					'</picture></figure>'
				);
			} );

			it( 'should flatten back to a plain image when every breakpoint is cleared', () => {
				openDialog();

				fillBreakpoint( 0, '' );
				fillBreakpoint( 1, '' );

				acceptButton.fire( 'execute' );

				expect( editor.getData() ).toBe( '<figure class="image"><img src="large.png"></figure>' );
			} );

			it( 'should keep sources it has no field for', () => {
				// A format-switching source of the kind an upload adapter adds. The form neither shows nor
				// manages it, so saving must not be what deletes it.
				editor.model.change( writer => {
					writer.setAttribute( 'sources', [
						{ srcset: 'small.png', media: '(max-width: 767px)' },
						{ srcset: 'large.webp', type: 'image/webp' }
					], editor.model.document.getRoot().getChild( 0 ) );
				} );

				openDialog();

				expect( urlView.breakpointInputViews[ 0 ].fieldView.value ).toBe( 'small.png' );

				fillBreakpoint( 0, 'tiny.png' );
				acceptButton.fire( 'execute' );

				expect( editor.getData() ).toBe(
					'<figure class="image"><picture>' +
						'<source srcset="tiny.png" media="(max-width: 767px)">' +
						'<source srcset="large.webp" type="image/webp">' +
						'<img src="large.png">' +
					'</picture></figure>'
				);
			} );

			it( 'should reset the fields when the dialog is reopened with no image selected', () => {
				editor.setData(
					'<figure class="image"><picture>' +
						'<source media="(max-width: 767px)" srcset="small.png">' +
						'<img src="large.png">' +
					'</picture></figure>' +
					'<p>after</p>'
				);

				const root = editor.model.document.getRoot();

				editor.model.change( writer => writer.setSelection( root.getChild( 0 ), 'on' ) );

				openDialog();
				expect( urlView.breakpointInputViews[ 0 ].fieldView.value ).toBe( 'small.png' );

				dialog.hide();

				editor.model.change( writer => writer.setSelection( root.getChild( 1 ), 0 ) );

				openDialog();
				expect( urlView.breakpointInputViews[ 0 ].fieldView.value ).toBe( '' );
				expect( urlView.breakpointInputViews[ 0 ].fieldView.element.value ).toBe( '' );
			} );
		} );

		it( 'should mark the buttons with the responsive icon', async () => {
			await createResponsiveEditor();

			for ( const name of [ 'insertImageViaUrl', 'menuBar:insertImageViaUrl' ] ) {
				expect( editor.ui.componentFactory.create( name ).icon, name ).toBe( IconImageResponsive );
			}
		} );

		it( 'should keep the stock icon when the feature is off', async () => {
			await createEditor( { plugins: [ Image, ImageInsertViaUrl, PictureEditing, Paragraph ] } );

			for ( const name of [ 'insertImageViaUrl', 'menuBar:insertImageViaUrl' ] ) {
				expect( editor.ui.componentFactory.create( name ).icon, name ).toBe( IconImageUrl );
			}
		} );

		it( 'should be a renderable SVG', () => {
			// `IconView` throws `ui-iconview-invalid-svg` on anything it cannot parse, so this is what stands
			// between a typo in the markup and every insert-image button disappearing.
			const parsed = new DOMParser().parseFromString( IconImageResponsive, 'image/svg+xml' );

			expect( parsed.querySelector( 'parsererror' ) ).toBeNull();
			expect( parsed.querySelector( 'svg' ) ).not.toBeNull();
			expect( parsed.querySelector( 'svg' ).getAttribute( 'viewBox' ) ).toBe( '0 0 20 20' );
			expect( parsed.querySelector( 'text' ).textContent ).toBe( '\u{1F3A8}' );
		} );

		it( 'should warn when configured without PictureEditing', async () => {
			const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			await createEditor( {
				plugins: [ Image, ImageInsertViaUrl, Paragraph ],
				image: { insert: { responsive: true } }
			} );

			expect( warnSpy.mock.calls.join( ' ' ) ).toContain( 'image-insert-responsive-requires-picture-editing' );
		} );

		it( 'should not warn when the feature is off', async () => {
			const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			await createEditor( { plugins: [ Image, ImageInsertViaUrl, Paragraph ] } );

			expect( warnSpy.mock.calls.join( ' ' ) ).not.toContain( 'image-insert-responsive-requires-picture-editing' );
		} );
	} );

	async function createEditor( config ) {
		editorElement = document.createElement( 'div' );
		document.body.appendChild( editorElement );

		editor = await ClassicTestEditor.create( editorElement, config );

		insertImageUI = editor.plugins.get( 'ImageInsertUI' );
	}

	function testButton( expectedType, expectedInsertLabel ) {
		it( 'should add the component to the factory', () => {
			expect( button ).toBeInstanceOf( expectedType );
		} );

		it( 'should set a #label of the #buttonView', () => {
			expect( button.label ).toBe( expectedInsertLabel );
		} );

		it( 'should set an #icon of the #buttonView', () => {
			expect( button.icon ).toBe( IconImageUrl );
		} );

		it( 'should open insert image via url dialog', () => {
			const dialogPlugin = editor.plugins.get( 'Dialog' );
			expect( dialogPlugin.id ).toBeNull();

			button.fire( 'execute' );

			expect( dialogPlugin.id ).toBe( 'insertImageViaUrl' );
		} );

		it( 'should create the dialog form view only once', () => {
			const dialogPlugin = editor.plugins.get( 'Dialog' );
			const showSpy = vi.spyOn( dialogPlugin, 'show' );

			button.fire( 'execute' );
			dialogPlugin.hide();
			button.fire( 'execute' );

			expect( showSpy ).toHaveBeenCalledTimes( 2 );

			const view1 = showSpy.mock.calls[ 0 ][ 0 ].content;
			const view2 = showSpy.mock.calls[ 1 ][ 0 ].content;

			expect( view1 ).toBe( view2 );
		} );
	}
} );
