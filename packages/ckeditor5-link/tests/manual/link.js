/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Enter } from '@ssmckinney/ckeditor5-enter';
import { Typing } from '@ssmckinney/ckeditor5-typing';
import { Link } from '../../src/link.js';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Undo } from '@ssmckinney/ckeditor5-undo';
import { Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [ Link, Bold, Italic, Typing, Paragraph, Undo, Enter ],
		toolbar: [ 'link', 'bold', 'italic', '|', 'undo', 'redo' ],
		link: {
			builtinDecorators: true
		}
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
