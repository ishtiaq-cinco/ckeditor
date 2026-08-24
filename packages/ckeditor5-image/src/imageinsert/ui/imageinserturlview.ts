/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * @module image/imageinsert/ui/imageinserturlview
 */

import {
	View,
	LabeledFieldView,
	createLabeledInputText,
	submitHandler,
	type InputTextView
} from '@ssmckinney/ckeditor5-ui';
import { KeystrokeHandler, type Locale } from '@ssmckinney/ckeditor5-utils';

import type { ImageResponsiveBreakpoint } from '../../imageconfig.js';

/**
 * The insert an image via URL view.
 *
 * See {@link module:image/imageinsert/imageinsertviaurlui~ImageInsertViaUrlUI}.
 *
 * @internal
 */
export class ImageInsertUrlView extends View {
	/**
	 * The URL input field view.
	 *
	 * With {@link #breakpoints} configured this is the `<img src>` of the generated `<picture>`: the fallback a
	 * viewport matching no breakpoint resolves to, which is why it stays the only field that must be filled in.
	 */
	public urlInputView: LabeledFieldView<InputTextView>;

	/**
	 * The breakpoints this form collects a URL for, in the order they are shown.
	 */
	public readonly breakpoints: Array<ImageResponsiveBreakpoint>;

	/**
	 * One input view per entry in {@link #breakpoints}, in the same order. Empty when the form is a plain
	 * single-URL one.
	 */
	public readonly breakpointInputViews: Array<LabeledFieldView<InputTextView>>;

	/**
	 * The value of the URL input.
	 *
	 * @observable
	 */
	declare public imageURLInputValue: string;

	/**
	 * Observable property used to alter labels while some image is selected and when it is not.
	 *
	 * @observable
	 */
	declare public isImageSelected: boolean;

	/**
	 * Observable property indicating whether the form interactive elements should be enabled.
	 *
	 * @observable
	 */
	declare public isEnabled: boolean;

	/**
	 * An instance of the {@link module:utils/keystrokehandler~KeystrokeHandler}.
	 */
	public readonly keystrokes: KeystrokeHandler;

	/**
	 * Creates a view for the dropdown panel of {@link module:image/imageinsert/imageinsertui~ImageInsertUI}.
	 *
	 * @param locale The localization services instance.
	 * @param breakpoints Breakpoints to collect an additional URL for. Omit for the plain single-URL form.
	 */
	constructor( locale: Locale, breakpoints: Array<ImageResponsiveBreakpoint> = [] ) {
		super( locale );

		this.set( 'imageURLInputValue', '' );
		this.set( 'isImageSelected', false );
		this.set( 'isEnabled', true );

		this.keystrokes = new KeystrokeHandler();

		this.breakpoints = breakpoints;
		this.urlInputView = this._createUrlInputView();
		this.breakpointInputViews = breakpoints.map( breakpoint => this._createBreakpointInputView( breakpoint ) );

		this.setTemplate( {
			tag: 'form',

			attributes: {
				class: [
					'ck',
					'ck-image-insert-url'
				],
				tabindex: '-1'
			},

			children: [
				this.urlInputView,
				...this.breakpointInputViews,
				{
					tag: 'div',
					attributes: {
						class: [
							'ck',
							'ck-image-insert-url__action-row'
						]
					}
				}
			]
		} );
	}

	/**
	 * The `sources` model attribute described by the breakpoint fields: one entry per filled-in field, in
	 * {@link #breakpoints} order.
	 *
	 * A blank field contributes nothing rather than an empty `<source>`, so that viewport falls through to the
	 * `<img src>` — which is the point of leaving it blank.
	 */
	public get sources(): Array<ImageSourceDefinition> {
		const sources: Array<ImageSourceDefinition> = [];

		for ( const [ index, breakpoint ] of this.breakpoints.entries() ) {
			const srcset = this.breakpointInputViews[ index ].fieldView.element?.value.trim();

			if ( srcset ) {
				// `srcset` first to match the order `upcastPicture()` collects them in, so that opening the form
				// and saving it again does not reshuffle the attributes of sources it did not change.
				sources.push( { srcset, media: breakpoint.media } );
			}
		}

		return sources;
	}

	/**
	 * Fills the breakpoint fields in from a `sources` model attribute, matching entries to fields by their media
	 * query. Sources whose media query matches no configured breakpoint are left alone by the form, but they are
	 * also not shown — see {@link module:image/imageinsert/imageinsertviaurlui~ImageInsertViaUrlUI}, which keeps
	 * them.
	 */
	public set sources( value: Array<ImageSourceDefinition> ) {
		for ( const [ index, breakpoint ] of this.breakpoints.entries() ) {
			const source = value.find( source => source.media === breakpoint.media );

			this.breakpointInputViews[ index ].fieldView.value = source ? source.srcset : '';
		}
	}

	/**
	 * @inheritDoc
	 */
	public override render(): void {
		super.render();

		submitHandler( {
			view: this
		} );

		// Start listening for the keystrokes coming from #element.
		this.keystrokes.listenTo( this.element! );
	}

	/**
	 * @inheritDoc
	 */
	public override destroy(): void {
		super.destroy();

		this.keystrokes.destroy();
	}

	/**
	 * Creates the {@link #urlInputView}.
	 */
	private _createUrlInputView() {
		const locale = this.locale!;
		const t = locale.t;
		const urlInputView = new LabeledFieldView( locale, createLabeledInputText );

		urlInputView.bind( 'label' ).to( this, 'isImageSelected',
			value => value ? t( 'Update image URL' ) : t( 'Insert image via URL' )
		);

		urlInputView.bind( 'isEnabled' ).to( this );

		urlInputView.fieldView.inputMode = 'url';
		urlInputView.fieldView.placeholder = 'https://example.com/image.png';

		urlInputView.fieldView.bind( 'value' ).to( this, 'imageURLInputValue', ( value: string ) => value || '' );
		urlInputView.fieldView.on( 'input', () => {
			this.imageURLInputValue = urlInputView.fieldView.element!.value.trim();
		} );

		return urlInputView;
	}

	/**
	 * Creates an input view for a single breakpoint.
	 */
	private _createBreakpointInputView( breakpoint: ImageResponsiveBreakpoint ): LabeledFieldView<InputTextView> {
		const locale = this.locale!;
		const inputView = new LabeledFieldView( locale, createLabeledInputText );

		inputView.label = breakpoint.label;

		// The media query is the only thing that says what the field actually governs, and it is not something
		// the label can carry for an arbitrary configured breakpoint.
		inputView.infoText = breakpoint.media;
		inputView.class = 'ck-image-insert-url__breakpoint';

		inputView.bind( 'isEnabled' ).to( this );

		inputView.fieldView.inputMode = 'url';
		inputView.fieldView.placeholder = 'https://example.com/image.png';

		return inputView;
	}

	/**
	 * Focuses the view.
	 */
	public focus(): void {
		this.urlInputView.focus();
	}
}

/**
 * A single entry of the `sources` model attribute brought by {@link module:image/pictureediting~PictureEditing},
 * downcast into one `<source>` element of a `<picture>`.
 */
export interface ImageSourceDefinition {

	/**
	 * The `srcset` attribute of the generated `<source>`.
	 */
	srcset: string;

	/**
	 * The `media` attribute of the generated `<source>`.
	 */
	media?: string;

	/**
	 * The `type` attribute of the generated `<source>`, for example `'image/webp'`.
	 */
	type?: string;

	/**
	 * The `sizes` attribute of the generated `<source>`.
	 */
	sizes?: string;
}
