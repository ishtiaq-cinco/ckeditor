/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { Code, Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Table, TablePropertiesEditing, TableCellPropertiesEditing } from '@ssmckinney/ckeditor5-table';
import { LegacyList } from '../../src/legacylist.js';
import { LegacyListProperties } from '../../src/legacylistproperties.js';
import { Indent, IndentBlock } from '@ssmckinney/ckeditor5-indent';
import { LegacyTodoList } from '../../src/legacytodolist.js';
import { RemoveFormat } from '@ssmckinney/ckeditor5-remove-format';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [
			Essentials,
			Bold,
			Italic,
			Code,
			Heading,
			LegacyList,
			LegacyTodoList,
			Paragraph,
			LegacyListProperties,
			Table,
			TablePropertiesEditing,
			TableCellPropertiesEditing,
			Indent,
			IndentBlock,
			RemoveFormat
		],
		toolbar: [
			'heading',
			'|',
			'bold',
			'italic',
			'|',
			'removeFormat',
			'|',
			'bulletedList', 'numberedList', 'todoList',
			'|',
			'outdent',
			'indent',
			'|',
			'undo', 'redo'
		]
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
