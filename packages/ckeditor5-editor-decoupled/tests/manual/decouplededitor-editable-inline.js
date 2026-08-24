/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { DecoupledEditor } from '../../src/decouplededitor.js';
import { Enter } from '@ssmckinney/ckeditor5-enter';
import { Typing } from '@ssmckinney/ckeditor5-typing';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Undo } from '@ssmckinney/ckeditor5-undo';
import { Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';

DecoupledEditor
	.create( {
		plugins: [ Enter, Typing, Paragraph, Undo, Heading, Bold, Italic ],
		toolbar: [ 'heading', '|', 'bold', 'italic', 'undo', 'redo' ],
		roots: {
			main: {
				element: document.querySelector( '.editor__editable' ),
				modelElement: '$inlineRoot'
			}
		}
	} )
	.then( newEditor => {
		console.log( 'Editor was initialized', newEditor );
		console.log( 'You can now play with it using global `editor` and `editable` variables.' );

		document.querySelector( '.toolbar-container' ).appendChild( newEditor.ui.view.toolbar.element );

		window.editor = newEditor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
