/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Typing } from '@ssmckinney/ckeditor5-typing';
import { Paragraph } from '../../src/paragraph.js';
import { Undo } from '@ssmckinney/ckeditor5-undo';
import { Enter } from '@ssmckinney/ckeditor5-enter';
import { Clipboard } from '@ssmckinney/ckeditor5-clipboard';
import { Link } from '@ssmckinney/ckeditor5-link';
import { Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [
			Typing,
			Paragraph,
			Undo,
			Enter,
			Clipboard,
			Link,
			Bold,
			Italic
		],
		toolbar: [ 'bold', 'italic', 'link', 'undo', 'redo' ]
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
