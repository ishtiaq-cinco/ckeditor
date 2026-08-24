/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { ArticlePluginSet } from '@ssmckinney/ckeditor5-core/tests/_utils/articlepluginset.js';
import { Code, Strikethrough, Subscript, Superscript, Underline } from '@ssmckinney/ckeditor5-basic-styles';
import { CodeBlock } from '@ssmckinney/ckeditor5-code-block';
import { EasyImage } from '@ssmckinney/ckeditor5-easy-image';
import { FontBackgroundColor, FontColor, FontFamily, FontSize } from '@ssmckinney/ckeditor5-font';
import { GeneralHtmlSupport } from '@ssmckinney/ckeditor5-html-support';
import { ImageResize, ImageUpload } from '@ssmckinney/ckeditor5-image';
import { LinkImage } from '@ssmckinney/ckeditor5-link';
import { ListProperties, TodoList } from '@ssmckinney/ckeditor5-list';
import { PageBreak } from '@ssmckinney/ckeditor5-page-break';
import { TableCellProperties, TableProperties, TableCaption, TableColumnResize } from '@ssmckinney/ckeditor5-table';
import { CloudServices } from '@ssmckinney/ckeditor5-cloud-services';

import { PasteFromOffice } from '../../../../src/pastefromoffice.js';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [
			ArticlePluginSet, Underline, Strikethrough, Superscript, Subscript, Code,
			FontColor, FontBackgroundColor, FontFamily, FontSize,
			CodeBlock, TodoList, ListProperties, TableProperties, TableCellProperties, TableCaption,
			TableColumnResize, EasyImage, ImageResize, LinkImage,
			PageBreak,
			ImageUpload, CloudServices,
			GeneralHtmlSupport,
			PasteFromOffice
		],
		toolbar: [
			'heading',
			'|',
			'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'link',
			'|',
			'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
			'|',
			'bulletedList', 'numberedList', 'todoList',
			'|',
			'blockQuote', 'uploadImage', 'insertTable', 'codeBlock',
			'|',
			'pageBreak',
			'|',
			'undo', 'redo'
		],
		htmlSupport: {
			allow: [
				{
					name: /^.*$/,
					styles: true,
					attributes: true,
					classes: true
				}
			]
		},
		image: {
			toolbar: [
				'imageStyle:inline',
				'imageStyle:block',
				'imageStyle:side'
			]
		}
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
