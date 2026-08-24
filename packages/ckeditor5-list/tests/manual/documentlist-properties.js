/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Alignment } from '@ssmckinney/ckeditor5-alignment';
import { AutoImage, ImageResize, ImageUpload, Image, ImageCaption, ImageStyle, ImageToolbar } from '@ssmckinney/ckeditor5-image';
import { CodeBlock } from '@ssmckinney/ckeditor5-code-block';
import { EasyImage } from '@ssmckinney/ckeditor5-easy-image';
import { HorizontalLine } from '@ssmckinney/ckeditor5-horizontal-line';
import { HtmlEmbed } from '@ssmckinney/ckeditor5-html-embed';
import { HtmlComment } from '@ssmckinney/ckeditor5-html-support';
import { LinkImage, Link } from '@ssmckinney/ckeditor5-link';
import { PageBreak } from '@ssmckinney/ckeditor5-page-break';
import { SourceEditing } from '@ssmckinney/ckeditor5-source-editing';
import { TableCaption, Table, TableToolbar } from '@ssmckinney/ckeditor5-table';
import { CloudServices } from '@ssmckinney/ckeditor5-cloud-services';
import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { BlockQuote } from '@ssmckinney/ckeditor5-block-quote';
import { Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Indent } from '@ssmckinney/ckeditor5-indent';
import { MediaEmbed } from '@ssmckinney/ckeditor5-media-embed';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';

import { CS_CONFIG } from '@ssmckinney/ckeditor5-cloud-services/tests/_utils/cloud-services-config.js';

import { List } from '../../src/list.js';
import { ListProperties } from '../../src/listproperties.js';

const config = {
	plugins: [
		Essentials, BlockQuote, Bold, Heading, Image, ImageCaption, ImageStyle, ImageToolbar, Indent, Italic, Link,
		MediaEmbed, Paragraph, Table, TableToolbar, CodeBlock, TableCaption, EasyImage, ImageResize, LinkImage,
		AutoImage, HtmlEmbed, HtmlComment, Alignment, PageBreak, HorizontalLine, ImageUpload,
		CloudServices, SourceEditing, List, ListProperties
	],
	toolbar: [
		'sourceEditing', '|',
		'numberedList', 'bulletedList',
		'outdent', 'indent', '|',
		'heading', '|',
		'bold', 'italic', 'link', '|',
		'blockQuote', 'uploadImage', 'insertTable', 'mediaEmbed', 'codeBlock', '|',
		'htmlEmbed', '|',
		'alignment', '|',
		'pageBreak', 'horizontalLine', '|',
		'undo', 'redo'
	],
	cloudServices: CS_CONFIG,
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
	root: {
		placeholder: 'Type the content here!'
	},
	htmlEmbed: {
		showPreviews: true,
		sanitizeHtml: html => ( { html, hasChange: false } )
	},
	menuBar: {
		isVisible: true
	}
};

function createEditor( idSuffix, properties ) {
	ClassicEditor
		.create( {
			...config,
			attachTo: document.querySelector( '#editor-' + idSuffix ),
			list: {
				properties
			}
		} )
		.then( editor => {
			window[ 'editor_' + idSuffix ] = editor;

			CKEditorInspector.attach( { [ idSuffix ]: editor } );
		} )
		.catch( err => {
			console.error( err.stack );
		} );
}

createEditor( 'all', {
	styles: true,
	startIndex: true,
	reversed: true
} );

createEditor( 'style-start', {
	styles: true,
	startIndex: true,
	reversed: false
} );

createEditor( 'style-reversed', {
	styles: true,
	startIndex: false,
	reversed: true
} );

createEditor( 'start-reversed', {
	styles: false,
	startIndex: true,
	reversed: true
} );

createEditor( 'start', {
	styles: false,
	startIndex: true,
	reversed: false
} );

createEditor( 'reversed', {
	styles: false,
	startIndex: false,
	reversed: true
} );

createEditor( 'style', {
	styles: true,
	startIndex: false,
	reversed: false
} );

createEditor( 'style-bulleted-only', {
	styles: {
		listTypes: 'bulleted'
	},
	startIndex: true,
	reversed: true
} );

createEditor( 'style-bulleted-only-styles', {
	styles: {
		listTypes: 'bulleted'
	},
	startIndex: false,
	reversed: false
} );

createEditor( 'style-numbered-only', {
	styles: {
		listTypes: 'numbered'
	},
	startIndex: true,
	reversed: true
} );

createEditor( 'style-numbered-only-styles', {
	styles: {
		listTypes: 'numbered'
	},
	startIndex: false,
	reversed: false
} );

createEditor( 'style-attribute', {
	styles: { useAttribute: true },
	startIndex: false,
	reversed: false
} );

createEditor( 'style-ui-options', {
	styles: {
		listStyleTypes: {
			numbered: [
				'decimal',
				'decimal-leading-zero',
				'arabic-indic'
			],
			bulleted: [
				'disc',
				'circle',
				'square'
			]
		}
	},
	startIndex: false,
	reversed: false
} );

createEditor( 'none', {
	styles: false,
	startIndex: false,
	reversed: false
} );
