/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

declare global {
	interface Window { CKEditorInspector: any }
}

import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { Autoformat } from '@ssmckinney/ckeditor5-autoformat';
import { BlockQuote } from '@ssmckinney/ckeditor5-block-quote';
import { Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Image, ImageCaption, ImageStyle, ImageToolbar } from '@ssmckinney/ckeditor5-image';
import { Indent } from '@ssmckinney/ckeditor5-indent';
import { Link } from '@ssmckinney/ckeditor5-link';
import { List } from '@ssmckinney/ckeditor5-list';
import { MediaEmbed } from '@ssmckinney/ckeditor5-media-embed';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Table, TableToolbar } from '@ssmckinney/ckeditor5-table';
import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { FindAndReplace } from '@ssmckinney/ckeditor5-find-and-replace';
import { SpecialCharacters, SpecialCharactersEssentials } from '@ssmckinney/ckeditor5-special-characters';
import { SourceEditing } from '@ssmckinney/ckeditor5-source-editing';
import { ButtonView, Dialog, View } from '../../../src/index.js';
import { Plugin } from '@ssmckinney/ckeditor5-core';

class ViewWithEscSupport extends View {
	declare public count: number;

	constructor() {
		super();

		const bind = this.bindTemplate;

		this.set( 'count', 0 );

		this.setTemplate( {
			tag: 'div',
			attributes: {
				tabindex: -1,
				style: {
					padding: '20px'
				}
			},
			children: [
				{
					tag: 'p',
					children: [
						'Focus me and press Esc key 10 times. Count: ',
						{ text: bind.to( 'count' ) }
					]
				}
			],
			on: {
				keydown: bind.to( ( evt: Event ) => {
					if ( ( evt as KeyboardEvent ).key == 'Escape' ) {
						if ( this.count++ < 9 ) {
							evt.preventDefault();
						}
					}
				} )
			}
		} );
	}

	public focus() {
		this.element!.focus();
	}
}

class DialogWithEscapeableChildren extends Plugin {
	public static get requires() {
		return [ Dialog ] as const;
	}

	public init(): void {
		const t = this.editor.locale.t;

		this.editor.ui.componentFactory.add( 'dialogWithEscHandling', locale => {
			const buttonView = new ButtonView( locale );

			buttonView.set( {
				label: t( 'Open dialog' ),
				tooltip: true,
				withText: true
			} );

			buttonView.on( 'execute', () => {
				const dialog = this.editor.plugins.get( 'Dialog' );

				dialog.show( {
					id: 'dialogWithEscHandling',
					isModal: true,
					title: t( 'Dialog with esc handling' ),
					content: new ViewWithEscSupport(),
					actionButtons: [

						{
							label: t( 'Cancel' ),
							withText: true,
							onExecute: () => dialog.hide()
						}
					]
				} );
			} );

			return buttonView;
		} );
	}
}

ClassicEditor.create( {
	attachTo: document.querySelector( '#editor' ) as HTMLElement,
	plugins: [
		Essentials,
		Autoformat,
		BlockQuote,
		Bold,
		Heading,
		Image,
		ImageCaption,
		ImageStyle,
		ImageToolbar,
		Indent,
		Italic,
		Link,
		List,
		MediaEmbed,
		Paragraph,
		Table,
		TableToolbar,

		FindAndReplace,
		SpecialCharacters,
		SpecialCharactersEssentials,
		SourceEditing,

		DialogWithEscapeableChildren
	],
	toolbar: {
		items: [
			'dialogWithEscHandling',
			'|',
			'accessibilityHelp', 'heading', 'bold', 'italic', 'link', 'sourceediting', 'findAndReplace'
		],
		shouldNotGroupWhenFull: true
	},
	image: {
		toolbar: [ 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side', '|', 'imageTextAlternative' ]
	},
	ui: {
		viewportOffset: {
			top: 50
		}
	}
} )
	.then( editor => {
		Object.assign( window, { editor } );
	} )
	.catch( err => {
		console.error( err.stack );
	} );
