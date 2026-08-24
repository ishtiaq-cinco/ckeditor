/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Enter } from '@ssmckinney/ckeditor5-enter';
import { Typing } from '@ssmckinney/ckeditor5-typing';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [ Enter, Typing, Paragraph, Heading, Bold, Italic ],
		toolbar: [ 'heading', '|', 'bold', 'italic' ]
	} )
	.then( editor => {
		window.editor = editor;

		const sel = editor.model.document.selection;

		sel.on( 'change', ( evt, data ) => {
			const date = new Date();
			console.log( `${ date.getSeconds() }s${ String( date.getMilliseconds() ).slice( 0, 2 ) }ms`, evt.name, data );
		} );
	} )
	.catch( err => {
		console.error( err.stack );
	} );
