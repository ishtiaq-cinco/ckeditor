/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * @module image/imageinsert/imageinsertviaurlui
 */

import { Plugin, type PluginDependenciesOf } from '@ssmckinney/ckeditor5-core';
import { ButtonView, Dialog, MenuBarMenuListItemButtonView } from '@ssmckinney/ckeditor5-ui';
import { IconImageUrl } from '@ssmckinney/ckeditor5-icons';
import { logWarning } from '@ssmckinney/ckeditor5-utils';

import { ImageInsertUI } from './imageinsertui.js';
import { ImageInsertUrlView, type ImageSourceDefinition } from './ui/imageinserturlview.js';
import { getImageResponsiveBreakpoints, IconImageResponsive } from './utils.js';
import type { ImageResponsiveBreakpoint } from '../imageconfig.js';

/**
 * The image insert via URL plugin (UI part).
 *
 * The plugin introduces two UI components to the {@link module:ui/componentfactory~ComponentFactory UI component factory}:
 *
 * * the `'insertImageViaUrl'` toolbar button,
 * * the `'menuBar:insertImageViaUrl'` menu bar component.
 *
 * It also integrates with the `insertImage` toolbar component and `menuBar:insertImage` menu component, which are default components
 * through which inserting image via URL is available.
 */
export class ImageInsertViaUrlUI extends Plugin {
	private _imageInsertUI!: ImageInsertUI;
	private _formView?: ImageInsertUrlView;
	private _breakpoints: Array<ImageResponsiveBreakpoint> = [];

	/**
	 * @inheritDoc
	 */
	public static get pluginName() {
		return 'ImageInsertViaUrlUI' as const;
	}

	/**
	 * @inheritDoc
	 */
	public static override get isOfficialPlugin(): true {
		return true;
	}

	/**
	 * @inheritDoc
	 */
	public static get requires(): PluginDependenciesOf<[ ImageInsertUI, Dialog ]> {
		return [ ImageInsertUI, Dialog ];
	}

	public init(): void {
		this.editor.ui.componentFactory.add( 'insertImageViaUrl', () => this._createToolbarButton() );
		this.editor.ui.componentFactory.add( 'menuBar:insertImageViaUrl', () => this._createMenuBarButton( 'standalone' ) );
	}

	/**
	 * @inheritDoc
	 */
	public afterInit(): void {
		const editor = this.editor;

		this._imageInsertUI = editor.plugins.get( 'ImageInsertUI' );
		this._breakpoints = getImageResponsiveBreakpoints( editor.config.get( 'image.insert.responsive' ) );

		if ( this._breakpoints.length && !editor.plugins.has( 'PictureEditing' ) ) {
			/**
			 * {@link module:image/imageconfig~ImageInsertConfig#responsive `config.image.insert.responsive`} is set,
			 * but the {@link module:image/pictureediting~PictureEditing} plugin is not loaded.
			 *
			 * `PictureEditing` owns the `sources` model attribute the breakpoint URLs are written to and converts it
			 * to and from `<picture>`. Without it the extra URLs are collected and then silently discarded, so load
			 * the plugin or drop the configuration.
			 *
			 * @error image-insert-responsive-requires-picture-editing
			 */
			logWarning( 'image-insert-responsive-requires-picture-editing' );
		}

		this._imageInsertUI.registerIntegration( {
			name: 'url',
			observable: () => this.editor.commands.get( 'insertImage' )!,
			buttonViewCreator: () => this._createToolbarButton(),
			formViewCreator: () => this._createDropdownButton(),
			menuBarButtonViewCreator: isOnly => this._createMenuBarButton( isOnly ? 'insertOnly' : 'insertNested' )
		} );
	}

	/**
	 * Creates the base for various kinds of the button component provided by this feature.
	 */
	private _createInsertUrlButton<T extends typeof ButtonView | typeof MenuBarMenuListItemButtonView>(
		ButtonClass: T
	): InstanceType<T> {
		const button = new ButtonClass( this.editor.locale ) as InstanceType<T>;

		// The dialog behind these buttons composes a `<picture>` once breakpoints are configured, which is a
		// different enough thing to insert that it is worth saying so on the button.
		button.icon = this._breakpoints.length ? IconImageResponsive : IconImageUrl;

		button.on( 'execute', () => {
			this._showModal();
		} );

		return button;
	}

	/**
	 * Creates a simple toolbar button, with an icon and a tooltip.
	 */
	private _createToolbarButton(): ButtonView {
		const t = this.editor.locale.t;
		const button = this._createInsertUrlButton( ButtonView );

		button.tooltip = true;
		button.bind( 'label' ).to(
			this._imageInsertUI,
			'isImageSelected',
			isImageSelected => isImageSelected ? t( 'Update image URL' ) : t( 'Insert image via URL' )
		);

		return button;
	}

	/**
	 * Creates a button for the dropdown view, with an icon, text and no tooltip.
	 */
	private _createDropdownButton(): ButtonView {
		const t = this.editor.locale.t;
		const button = this._createInsertUrlButton( ButtonView );

		button.withText = true;
		button.bind( 'label' ).to(
			this._imageInsertUI,
			'isImageSelected',
			isImageSelected => isImageSelected ? t( 'Update image URL' ) : t( 'Insert via URL' )
		);

		return button;
	}

	/**
	 * Creates a button for the menu bar.
	 */
	private _createMenuBarButton( type: 'standalone' | 'insertOnly' | 'insertNested' ): MenuBarMenuListItemButtonView {
		const t = this.editor.locale.t;
		const button = this._createInsertUrlButton( MenuBarMenuListItemButtonView );

		button.withText = true;

		switch ( type ) {
			case 'standalone':
				button.label = t( 'Image via URL' );
				break;
			case 'insertOnly':
				button.label = t( 'Image' );
				break;
			case 'insertNested':
				button.label = t( 'Via URL' );
				break;
		}

		return button;
	}

	/**
	 * Creates the form view used to submit the image URL.
	 */
	private _createInsertUrlView(): ImageInsertUrlView {
		const editor = this.editor;
		const locale = editor.locale;

		const replaceImageSourceCommand = editor.commands.get( 'replaceImageSource' )!;
		const insertImageCommand = editor.commands.get( 'insertImage' )!;

		const imageInsertUrlView = new ImageInsertUrlView( locale, this._breakpoints );

		imageInsertUrlView.bind( 'isImageSelected' ).to( this._imageInsertUI );
		imageInsertUrlView.bind( 'isEnabled' ).toMany( [ insertImageCommand, replaceImageSourceCommand ], 'isEnabled', ( ...isEnabled ) => (
			isEnabled.some( isCommandEnabled => isCommandEnabled )
		) );

		return imageInsertUrlView;
	}

	/**
	 * Shows the insert image via URL form view in a modal.
	 */
	private _showModal() {
		const editor = this.editor;
		const locale = editor.locale;
		const t = locale.t;
		const dialog = editor.plugins.get( 'Dialog' );

		if ( !this._formView ) {
			this._formView = this._createInsertUrlView();
			this._formView.on( 'submit', () => this._handleSave() );
		}

		const replaceImageSourceCommand = editor.commands.get( 'replaceImageSource' )!;
		this._formView.imageURLInputValue = replaceImageSourceCommand.value || '';
		this._formView.sources = this._getSelectedImageSources();

		dialog.show( {
			id: 'insertImageViaUrl',
			title: t( 'Image via URL' ),
			isModal: true,
			content: this._formView,
			actionButtons: [
				{
					label: t( 'Cancel' ),
					withText: true,
					onExecute: () => dialog.hide()
				},
				{
					label: this._imageInsertUI.isImageSelected ? t( 'Save' ) : t( 'Insert' ),
					class: 'ck-button-action',
					withText: true,
					onExecute: () => this._handleSave()
				}
			]
		} );
	}

	/**
	 * Executes appropriate command depending on selection and form value.
	 */
	private _handleSave() {
		const editor = this.editor;
		const formView = this._formView!;
		const replaceImageSourceCommand = editor.commands.get( 'replaceImageSource' )!;
		const src = formView.imageURLInputValue;

		// Without breakpoint fields this is the stock single-URL form, and `replaceImageSource` dropping the previous
		// `sources` is the documented behaviour — they describe the old `src`, not the one being set now.
		const sources = formView.breakpoints.length ?
			[ ...formView.sources, ...this._getUnmanagedSources() ] :
			[];

		// If an image element is currently selected, we want to replace its source attribute (instead of inserting a new image).
		// We detect if an image is selected by checking `replaceImageSource` command state.
		//
		// With no sources to apply both commands are called exactly as they were before breakpoints existed, so that
		// clearing every breakpoint field flattens the image back to a plain `<img>` rather than half-updating it.
		if ( replaceImageSourceCommand.isEnabled ) {
			editor.execute( 'replaceImageSource', sources.length ? { source: src, sources } : { source: src } );
		} else {
			editor.execute( 'insertImage', { source: sources.length ? { src, sources } : src } );
		}

		editor.plugins.get( 'Dialog' ).hide();
	}

	/**
	 * The `sources` of the selected image that no configured breakpoint claims — a format-switching entry from an
	 * upload adapter, say. The form neither shows nor manages them, so saving must not be what deletes them.
	 *
	 * They are applied after the ones typed into the form, so an explicit breakpoint still wins the `<picture>`
	 * first-match-wins race and these keep acting as the broader fallback they were.
	 */
	private _getUnmanagedSources(): Array<ImageSourceDefinition> {
		const managedMedia = new Set( this._formView!.breakpoints.map( breakpoint => breakpoint.media ) );

		return this._getSelectedImageSources().filter( source => !source.media || !managedMedia.has( source.media ) );
	}

	/**
	 * The `sources` model attribute of the currently selected image, if there is one.
	 */
	private _getSelectedImageSources(): Array<ImageSourceDefinition> {
		const element = this.editor.model.document.selection.getSelectedElement();

		if ( !element || !element.hasAttribute( 'sources' ) ) {
			return [];
		}

		return element.getAttribute( 'sources' ) as Array<ImageSourceDefinition>;
	}
}
