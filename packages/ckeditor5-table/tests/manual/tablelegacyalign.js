/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { GeneralHtmlSupport } from '@ssmckinney/ckeditor5-html-support';
import { HorizontalLine } from '@ssmckinney/ckeditor5-horizontal-line';
import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { Autoformat } from '@ssmckinney/ckeditor5-autoformat';
import { BlockQuote } from '@ssmckinney/ckeditor5-block-quote';
import { Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';
import { Alignment } from '@ssmckinney/ckeditor5-alignment';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { ImageInline, ImageCaption, ImageToolbar, ImageResize, ImageStyle, ImageBlock } from '@ssmckinney/ckeditor5-image';
import { Indent } from '@ssmckinney/ckeditor5-indent';
import { SourceEditing } from '@ssmckinney/ckeditor5-source-editing';
import { Link } from '@ssmckinney/ckeditor5-link';
import { List } from '@ssmckinney/ckeditor5-list';
import { MediaEmbed } from '@ssmckinney/ckeditor5-media-embed';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Table } from '../../src/table.js';
import { TableToolbar } from '../../src/tabletoolbar.js';
import { TableSelection } from '../../src/tableselection.js';
import { TableClipboard } from '../../src/tableclipboard.js';
import { TableProperties } from '../../src/tableproperties.js';
import { TableCellProperties } from '../../src/tablecellproperties.js';
import { TableColumnResize } from '../../src/tablecolumnresize.js';
import { TableCaption } from '../../src/tablecaption.js';
import { TableLayout } from '../../src/tablelayout.js';

const config = {
	attachTo: document.querySelector( '#editor' ),
	plugins: [
		Alignment,
		SourceEditing,
		Autoformat,
		BlockQuote,
		Bold,
		Essentials,
		GeneralHtmlSupport,
		Heading,
		HorizontalLine,
		ImageCaption,
		ImageInline,
		ImageBlock,
		ImageToolbar,
		ImageResize,
		ImageStyle,
		Indent,
		Italic,
		Link,
		List,
		MediaEmbed,
		Paragraph,
		Table,
		TableCaption,
		TableCellProperties,
		TableClipboard,
		TableColumnResize,
		TableLayout,
		TableProperties,
		TableSelection,
		TableToolbar
	],
	image: {
		toolbar: [
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:breakText',
			'|',
			'toggleImageCaption',
			'imageTextAlternative'
		]
	},
	toolbar: [
		'sourceEditing', '|',
		'undo', 'redo', '|',
		'insertTable', 'insertTableLayout', '|',
		'heading', '|',
		'bold', 'italic', 'link', 'alignment', '|',
		'bulletedList', 'numberedList', 'blockQuote'
	],
	table: {
		contentToolbar: [
			'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties', 'toggleTableCaption'
		]
	},
	htmlSupport: {
		allow: [
			{
				name: /.*/,
				attributes: true,
				classes: true,
				styles: true
			}
		]
	},
	menuBar: {
		isVisible: true
	}
};

ClassicEditor
	.create( config )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
