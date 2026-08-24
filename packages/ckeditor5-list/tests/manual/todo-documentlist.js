/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';

import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { Autoformat } from '@ssmckinney/ckeditor5-autoformat';
import { BlockQuote } from '@ssmckinney/ckeditor5-block-quote';
import { Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Link, LinkImage } from '@ssmckinney/ckeditor5-link';
import { MediaEmbed } from '@ssmckinney/ckeditor5-media-embed';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Table, TableToolbar } from '@ssmckinney/ckeditor5-table';
import { FontSize } from '@ssmckinney/ckeditor5-font';
import { Indent } from '@ssmckinney/ckeditor5-indent';
import { SourceEditing } from '@ssmckinney/ckeditor5-source-editing';
import { GeneralHtmlSupport } from '@ssmckinney/ckeditor5-html-support';
import { Alignment } from '@ssmckinney/ckeditor5-alignment';
import { CloudServices } from '@ssmckinney/ckeditor5-cloud-services';
import { EasyImage } from '@ssmckinney/ckeditor5-easy-image';
import { Image, ImageResize, ImageInsert } from '@ssmckinney/ckeditor5-image';

import { CS_CONFIG } from '@ssmckinney/ckeditor5-cloud-services/tests/_utils/cloud-services-config.js';

import { List } from '../../src/list.js';
import { TodoList } from '../../src/todolist.js';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [
			Essentials,
			Autoformat,
			BlockQuote,
			Bold,
			Heading,
			Italic,
			Link,
			MediaEmbed,
			Paragraph,
			Table,
			TableToolbar,
			FontSize,
			Indent,
			List,
			TodoList,
			SourceEditing,
			GeneralHtmlSupport,
			Alignment,
			Image,
			CloudServices,
			EasyImage,
			ImageResize,
			ImageInsert,
			LinkImage
		],
		toolbar: [
			'heading',
			'|',
			'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent',
			'|',
			'bold', 'link', 'fontSize', 'alignment',
			'|',
			'insertTable', 'insertImage',
			'|',
			'undo', 'redo', '|', 'sourceEditing'
		],
		cloudServices: CS_CONFIG,
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells'
			]
		},
		htmlSupport: {
			allow: [ { name: /.*/, attributes: true, classes: true, styles: true } ]
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
