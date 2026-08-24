/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { BlockQuote } from '@ssmckinney/ckeditor5-block-quote';
import { Bold, Italic, Code } from '@ssmckinney/ckeditor5-basic-styles';
import { Heading, HeadingButtonsUI } from '@ssmckinney/ckeditor5-heading';
import { Image, ImageCaption, ImageStyle, ImageToolbar, ImageResize, ImageInsert, AutoImage, ImageUpload } from '@ssmckinney/ckeditor5-image';
import { Link, LinkImage, AutoLink } from '@ssmckinney/ckeditor5-link';
import { List, ListProperties } from '@ssmckinney/ckeditor5-list';
import { Paragraph, ParagraphButtonUI } from '@ssmckinney/ckeditor5-paragraph';
import { Table, TableToolbar, TableProperties, TableCellProperties, TableCaption, TableColumnResize } from '@ssmckinney/ckeditor5-table';
import { CodeBlock } from '@ssmckinney/ckeditor5-code-block';
import { EasyImage } from '@ssmckinney/ckeditor5-easy-image';
import { HtmlEmbed } from '@ssmckinney/ckeditor5-html-embed';
import { Alignment } from '@ssmckinney/ckeditor5-alignment';
import { PageBreak } from '@ssmckinney/ckeditor5-page-break';
import { HorizontalLine } from '@ssmckinney/ckeditor5-horizontal-line';
import { CloudServices } from '@ssmckinney/ckeditor5-cloud-services';
import { BalloonEditor } from '@ssmckinney/ckeditor5-editor-balloon';
import { BlockToolbar } from '@ssmckinney/ckeditor5-ui';

import { CS_CONFIG } from '@ssmckinney/ckeditor5-cloud-services/tests/_utils/cloud-services-config.js';

BalloonEditor
	.create( {
		root: {
			element: document.querySelector( '#editor-balloon' )
		},
		plugins: [
			Essentials, List, Paragraph, Heading, BlockQuote, Bold, Italic, Code,
			Image, ImageResize, ImageStyle, ImageToolbar, ImageCaption, HorizontalLine,
			HeadingButtonsUI, ParagraphButtonUI, BlockToolbar, Table, TableToolbar,
			CloudServices, ImageUpload, EasyImage, ImageInsert, AutoImage, PageBreak,
			Link, LinkImage, AutoLink, ListProperties, CodeBlock, HtmlEmbed, Alignment,
			TableProperties, TableCellProperties, TableCaption, TableColumnResize
		],
		cloudServices: CS_CONFIG,
		blockToolbar: [
			'heading', '|',
			'bold', 'italic', 'code', 'link', '|',
			'bulletedList', 'numberedList', '|',
			'blockQuote', 'insertImage', 'insertTable', 'codeBlock', 'htmlEmbed', '|',
			'alignment', '|',
			'pageBreak', 'horizontalLine', '|',
			'undo', 'redo'
		],
		image: {
			toolbar: [
				'imageTextAlternative', 'toggleImageCaption', '|',
				'imageStyle:inline', 'imageStyle:breakText', 'imageStyle:wrapText', '|',
				'resizeImage'
			]
		},
		table: {
			contentToolbar: [
				'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties', 'toggleTableCaption'
			]
		}
	} )
	.then( editor => {
		window.editorBalloon = editor;

		CKEditorInspector.attach( { balloon: editor } );
	} )
	.catch( err => {
		console.error( err.stack );
	} );
