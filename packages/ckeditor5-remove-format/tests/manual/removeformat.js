/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { global } from '@ssmckinney/ckeditor5-utils';

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Bold, Italic, Underline } from '@ssmckinney/ckeditor5-basic-styles';
import { Enter, ShiftEnter } from '@ssmckinney/ckeditor5-enter';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Typing } from '@ssmckinney/ckeditor5-typing';
import { Undo } from '@ssmckinney/ckeditor5-undo';
import { Clipboard } from '@ssmckinney/ckeditor5-clipboard';
import { Image, ImageCaption, ImageToolbar, ImageResize } from '@ssmckinney/ckeditor5-image';
import { RemoveFormat } from '../../src/removeformat.js';
import { Link } from '@ssmckinney/ckeditor5-link';

ClassicEditor
	.create( {
		attachTo: global.document.querySelector( '#editor' ),
		image: { toolbar: [ 'toggleImageCaption', 'imageTextAlternative' ] },
		plugins: [
			Bold, Clipboard, Enter, Italic, Link, Paragraph, RemoveFormat, ShiftEnter, Typing,
			Underline, Undo, Image, ImageCaption, ImageToolbar, ImageResize
		],
		toolbar: [ 'removeFormat', '|', 'italic', 'bold', 'link', 'underline', '|', 'undo', 'redo' ]
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
