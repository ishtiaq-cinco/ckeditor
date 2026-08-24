/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Enter } from '@ssmckinney/ckeditor5-enter';
import { Typing } from '@ssmckinney/ckeditor5-typing';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Undo } from '@ssmckinney/ckeditor5-undo';
import { Clipboard } from '@ssmckinney/ckeditor5-clipboard';
import { Link } from '@ssmckinney/ckeditor5-link';
import { LegacyList } from '../../src/legacylist.js';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [ Enter, Typing, Heading, Paragraph, Undo, LegacyList, Clipboard, Link ],
		toolbar: [ 'heading', '|', 'bulletedList', 'numberedList', 'undo', 'redo' ]
	} )
	.then( editor => {
		window.editor = editor;
		window.modelRoot = editor.model.document.getRoot();
		window.viewRoot = editor.editing.view.document.getRoot();
	} )
	.catch( err => {
		console.error( err.stack );
	} );
