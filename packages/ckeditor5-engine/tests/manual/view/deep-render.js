/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Underline, Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';
import { Link } from '@ssmckinney/ckeditor5-link';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [ Essentials, Paragraph, Underline, Bold, Italic, Link ],
		toolbar: [ 'undo', 'redo', '|', 'bold', 'underline', 'italic', 'link' ]
	} )
	.then( editor => {
		window.editor = editor;

		const preview = document.querySelector( '#preview' );

		preview.innerText = editor.getData();

		editor.editing.view.on( 'render', () => {
			preview.innerText = editor.getData();
		} );
	} )
	.catch( err => {
		console.error( err.stack );
	} );
