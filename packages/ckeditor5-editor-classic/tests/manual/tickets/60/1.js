/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '../../../../src/classiceditor.js';
import { Enter } from '@ssmckinney/ckeditor5-enter';
import { Typing } from '@ssmckinney/ckeditor5-typing';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Undo } from '@ssmckinney/ckeditor5-undo';
import { Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [ Enter, Typing, Paragraph, Undo, Heading, Bold, Italic ],
		toolbar: {
			items: [ 'heading', '|', 'bold', 'italic', 'undo', 'redo' ],
			viewportTopOffset: 100
		}
	} )
	.then( newEditor => {
		console.log( 'Editor was initialized', newEditor );
		console.log( 'You can now play with it using global `editor` and `editable` variables.' );

		window.editor = newEditor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
