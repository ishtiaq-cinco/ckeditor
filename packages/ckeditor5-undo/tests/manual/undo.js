/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Enter } from '@ssmckinney/ckeditor5-enter';
import { Typing } from '@ssmckinney/ckeditor5-typing';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Undo } from '../../src/undo.js';
import { Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [ Enter, Typing, Paragraph, Heading, Undo, Bold, Italic ],
		toolbar: [ 'heading', '|', 'bold', 'italic', 'undo', 'redo' ]
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
