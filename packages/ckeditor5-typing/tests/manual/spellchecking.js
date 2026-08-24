/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';
import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { _getModelData } from '@ssmckinney/ckeditor5-engine';

window.setInterval( function() {
	console.log( _getModelData( window.editor.model ) );
}, 3000 );

ClassicEditor.create( {
	plugins: [ Essentials, Paragraph, Bold, Italic, Heading ],
	toolbar: [ 'heading', '|', 'bold', 'italic', 'undo', 'redo' ],
	attachTo: document.querySelector( '#editor' )
} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
