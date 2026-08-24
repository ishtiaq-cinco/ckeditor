/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';

import { TwoStepCaretMovement } from '../../../src/twostepcaretmovement.js';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [ Essentials, Paragraph, Bold, Italic, TwoStepCaretMovement ],
		toolbar: [ 'undo', 'redo', '|', 'bold', 'italic' ]
	} )
	.then( editor => {
		const twoStepCaretMovement = editor.plugins.get( TwoStepCaretMovement );

		twoStepCaretMovement.registerAttribute( 'bold' );
	} )
	.catch( err => {
		console.error( err.stack );
	} );
