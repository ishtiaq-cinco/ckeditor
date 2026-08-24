/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Enter, ShiftEnter } from '@ssmckinney/ckeditor5-enter';
import { Typing } from '@ssmckinney/ckeditor5-typing';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Bold } from '@ssmckinney/ckeditor5-basic-styles';
import { Highlight } from '@ssmckinney/ckeditor5-highlight';
import { Link } from '@ssmckinney/ckeditor5-link';
import { Table } from '@ssmckinney/ckeditor5-table';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Undo } from '@ssmckinney/ckeditor5-undo';
import { Clipboard } from '@ssmckinney/ckeditor5-clipboard';
import { FontSize } from '@ssmckinney/ckeditor5-font';

import { LegacyList } from '../../src/legacylist.js';
import { LegacyTodoList } from '../../src/legacytodolist.js';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [
			Enter, Typing, Heading, Highlight, Table, Bold, Paragraph, Undo,
			LegacyList, LegacyTodoList, Clipboard, Link, FontSize, ShiftEnter
		],
		toolbar: [
			'heading',
			'|',
			'bulletedList', 'numberedList', 'todoList',
			'|',
			'bold', 'link', 'highlight', 'insertTable', 'fontSize',
			'|',
			'undo', 'redo'
		],
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells'
			]
		}
	} )
	.then( editor => {
		window.editor = editor;

		const contentPreviewBox = document.getElementById( 'preview' );

		contentPreviewBox.innerHTML = editor.getData();

		editor.model.document.on( 'change:data', () => {
			contentPreviewBox.innerHTML = editor.getData();
		} );
	} )
	.catch( err => {
		console.error( err.stack );
	} );
