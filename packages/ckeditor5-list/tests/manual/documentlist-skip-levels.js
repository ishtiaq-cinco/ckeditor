/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Alignment } from '@ssmckinney/ckeditor5-alignment';
import { ImageResize, ImageUpload, Image, ImageCaption, ImageStyle, ImageToolbar } from '@ssmckinney/ckeditor5-image';
import { CodeBlock } from '@ssmckinney/ckeditor5-code-block';
import { HorizontalLine } from '@ssmckinney/ckeditor5-horizontal-line';
import { HtmlEmbed } from '@ssmckinney/ckeditor5-html-embed';
import { HtmlComment, GeneralHtmlSupport } from '@ssmckinney/ckeditor5-html-support';
import { LinkImage, Link } from '@ssmckinney/ckeditor5-link';
import { PageBreak } from '@ssmckinney/ckeditor5-page-break';
import { SourceEditing } from '@ssmckinney/ckeditor5-source-editing';
import { TableCaption, Table, TableToolbar } from '@ssmckinney/ckeditor5-table';
import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { BlockQuote } from '@ssmckinney/ckeditor5-block-quote';
import { Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Indent, IndentBlock } from '@ssmckinney/ckeditor5-indent';
import { MediaEmbed } from '@ssmckinney/ckeditor5-media-embed';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { PasteFromOffice } from '@ssmckinney/ckeditor5-paste-from-office';
import { Autoformat } from '@ssmckinney/ckeditor5-autoformat';
import { TodoList } from '../../src/todolist.js';

import { List } from '../../src/list.js';
import { ListProperties } from '../../src/listproperties.js';

const editorElement = document.querySelector( '#editor' );
const INITIAL_DATA = editorElement.innerHTML;

const controls = {
	skipLevels: document.querySelector( '#skipLevels' ),
	indentBlock: document.querySelector( '#indentBlock' ),
	ghs: document.querySelector( '#ghs' ),
	pfo: document.querySelector( '#pfo' ),
	listProperties: document.querySelector( '#listProperties' )
};

let editor = null;

function getEditorConfig() {
	const plugins = [
		Essentials, BlockQuote, Bold, Heading, Image, ImageCaption, ImageStyle, ImageToolbar, Indent, Italic, Link,
		MediaEmbed, Paragraph, Table, TableToolbar, CodeBlock, TableCaption, ImageResize, LinkImage,
		HtmlEmbed, HtmlComment, Alignment, PageBreak, HorizontalLine, ImageUpload,
		SourceEditing, List, TodoList, Autoformat
	];

	if ( controls.indentBlock.checked ) {
		plugins.push( IndentBlock );
	}

	if ( controls.ghs.checked ) {
		plugins.push( GeneralHtmlSupport );
	}

	if ( controls.pfo.checked ) {
		plugins.push( PasteFromOffice );
	}

	if ( controls.listProperties.checked ) {
		plugins.push( ListProperties );
	}

	const config = {
		plugins,
		toolbar: [
			'sourceEditing', '|',
			'numberedList', 'bulletedList', 'todoList', '|',
			'outdent', 'indent', '|',
			'heading', '|',
			'bold', 'italic', 'link', '|',
			'blockQuote', 'insertTable', 'mediaEmbed', 'codeBlock', '|',
			'htmlEmbed', '|',
			'alignment', '|',
			'pageBreak', 'horizontalLine', '|',
			'undo', 'redo'
		],
		table: {
			contentToolbar: [
				'tableColumn', 'tableRow', 'mergeTableCells', 'toggleTableCaption'
			]
		},
		image: {
			styles: [
				'alignCenter',
				'alignLeft',
				'alignRight'
			],
			resizeOptions: [
				{
					name: 'resizeImage:original',
					label: 'Original size',
					value: null
				},
				{
					name: 'resizeImage:50',
					label: '50%',
					value: '50'
				},
				{
					name: 'resizeImage:75',
					label: '75%',
					value: '75'
				}
			],
			toolbar: [
				'imageTextAlternative', 'toggleImageCaption', '|',
				'imageStyle:inline', 'imageStyle:breakText', 'imageStyle:wrapText', '|',
				'resizeImage'
			]
		},
		htmlEmbed: {
			showPreviews: true,
			sanitizeHtml: html => ( { html, hasChange: false } )
		},
		list: {
			properties: {
				styles: true,
				startIndex: true,
				reversed: true
			},
			enableSkipLevelLists: controls.skipLevels.checked
		},
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
		menuBar: {
			isVisible: true
		}
	};

	return config;
}

function createEditor() {
	const initialize = () =>
		ClassicEditor.create( {
			...getEditorConfig(),
			attachTo: editorElement
		} ).then( newEditor => {
			editor = newEditor;
			window.editor = editor;
			editor.setData( INITIAL_DATA );
		} );

	return Promise.resolve()
		.then( () => editor && editor.destroy() )
		.then( initialize )
		.catch( err => console.error( err ) );
}

createEditor();

Object.values( controls ).forEach( input => {
	input.addEventListener( 'change', () => {
		createEditor();
	} );
} );
