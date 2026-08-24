/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { ArticlePluginSet } from '@ssmckinney/ckeditor5-core/tests/_utils/articlepluginset.js';
import { CloudServices } from '@ssmckinney/ckeditor5-cloud-services';
import { EasyImage } from '@ssmckinney/ckeditor5-easy-image';
import { ImageUpload } from '@ssmckinney/ckeditor5-image';
import { PasteFromOffice } from '@ssmckinney/ckeditor5-paste-from-office';
import { SourceEditing } from '@ssmckinney/ckeditor5-source-editing';
import { Table, TableToolbar } from '@ssmckinney/ckeditor5-table';
import { TodoList } from '@ssmckinney/ckeditor5-list';

import { CS_CONFIG } from '@ssmckinney/ckeditor5-cloud-services/tests/_utils/cloud-services-config.js';

import { HtmlComment } from '../../src/htmlcomment.js';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [
			ArticlePluginSet,
			CloudServices,
			EasyImage,
			ImageUpload,
			PasteFromOffice,
			SourceEditing,
			Table,
			TableToolbar,
			TodoList,
			HtmlComment
		],
		cloudServices: CS_CONFIG,
		toolbar: [
			'heading', '|', 'bold', 'italic', 'link', '|',
			'bulletedList', 'numberedList', 'todoList', '|',
			'blockQuote', 'uploadImage', 'insertTable', '|',
			'sourceEditing', '|',
			'undo', 'redo'
		],
		image: {
			toolbar: [
				'imageStyle:inline',
				'imageStyle:block',
				'imageStyle:wrapText',
				'|',
				'toggleImageCaption',
				'imageTextAlternative'
			]
		},
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
	} )
	.catch( err => {
		console.error( err.stack );
	} );
