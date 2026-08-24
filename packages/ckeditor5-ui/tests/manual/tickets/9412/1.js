/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { IconBold } from '@ssmckinney/ckeditor5-icons';
import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { ButtonView } from '../../../../src/button/buttonview.js';

function customButtonView( editor ) {
	editor.ui.componentFactory.add( 'customButtonView', locale => {
		const view = new ButtonView( locale );
		view.set( {
			label: 'Custom Button',
			icon: IconBold,
			tooltip: true,
			withKeystroke: true
		} );

		return view;
	} );
}

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [
			Essentials,
			Paragraph,
			Heading,
			customButtonView
		],
		toolbar: [ 'customButtonView' ]
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
