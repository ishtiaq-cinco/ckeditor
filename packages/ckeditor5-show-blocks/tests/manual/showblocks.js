/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ShowBlocks } from '../../src/showblocks.js';

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Alignment } from '@ssmckinney/ckeditor5-alignment';
import { Autoformat } from '@ssmckinney/ckeditor5-autoformat';
import { Bold, Code, Italic, Strikethrough, Subscript, Superscript, Underline } from '@ssmckinney/ckeditor5-basic-styles';
import { BlockQuote } from '@ssmckinney/ckeditor5-block-quote';
import { CloudServices } from '@ssmckinney/ckeditor5-cloud-services';
import { CodeBlock } from '@ssmckinney/ckeditor5-code-block';
import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { FindAndReplace } from '@ssmckinney/ckeditor5-find-and-replace';
import { Font } from '@ssmckinney/ckeditor5-font';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Highlight } from '@ssmckinney/ckeditor5-highlight';
import { HorizontalLine } from '@ssmckinney/ckeditor5-horizontal-line';
import { HtmlEmbed } from '@ssmckinney/ckeditor5-html-embed';
import { GeneralHtmlSupport } from '@ssmckinney/ckeditor5-html-support';
import {
	AutoImage,
	Image,
	ImageCaption,
	ImageInsert,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	PictureEditing
} from '@ssmckinney/ckeditor5-image';
import { Indent, IndentBlock } from '@ssmckinney/ckeditor5-indent';
import { AutoLink, Link, LinkImage } from '@ssmckinney/ckeditor5-link';
import { List, ListProperties } from '@ssmckinney/ckeditor5-list';
import { MediaEmbed } from '@ssmckinney/ckeditor5-media-embed';
import { Mention } from '@ssmckinney/ckeditor5-mention';
import { PageBreak } from '@ssmckinney/ckeditor5-page-break';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { PasteFromOffice } from '@ssmckinney/ckeditor5-paste-from-office';
import { RemoveFormat } from '@ssmckinney/ckeditor5-remove-format';
import { SourceEditing } from '@ssmckinney/ckeditor5-source-editing';
import { SpecialCharacters, SpecialCharactersEssentials } from '@ssmckinney/ckeditor5-special-characters';
import { Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar } from '@ssmckinney/ckeditor5-table';
import { TextTransformation } from '@ssmckinney/ckeditor5-typing';

import { ArticlePluginSet } from '@ssmckinney/ckeditor5-core/tests/_utils/articlepluginset.js';
import { EasyImage } from '@ssmckinney/ckeditor5-easy-image';
import { CS_CONFIG } from '@ssmckinney/ckeditor5-cloud-services/tests/_utils/cloud-services-config.js';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [
			Autoformat, BlockQuote, Bold, Heading, Image, ImageCaption,
			ImageStyle, ImageToolbar, Indent, Italic, Link, List, MediaEmbed,
			Paragraph, Table, TableToolbar, Alignment, AutoImage, AutoLink,
			CloudServices, Code, CodeBlock, Essentials, EasyImage,
			FindAndReplace, Font, Highlight, HorizontalLine,
			HtmlEmbed, GeneralHtmlSupport, ImageInsert, ImageResize, ImageUpload, IndentBlock,
			LinkImage, ListProperties, Mention, PageBreak, PasteFromOffice,
			PictureEditing, RemoveFormat, SourceEditing, SpecialCharacters,
			SpecialCharactersEssentials, Strikethrough, Subscript, Superscript,
			TableCaption, TableCellProperties, TableColumnResize,
			TableProperties, TextTransformation,
			Underline, ShowBlocks
		],
		toolbar: {
			items: [
				'showBlocks',
				'|',
				'undo', 'redo',
				'|',
				'sourceEditing',
				'|',
				'findAndReplace', 'selectAll',
				'|',
				'heading',
				'|',
				'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
				'-',
				'bold', 'italic', 'underline',
				{
					label: 'Formatting',
					icon: 'text',
					items: [ 'strikethrough', 'subscript', 'superscript', 'code', '|', 'removeFormat' ]
				},
				'|',
				'specialCharacters', 'horizontalLine', 'pageBreak',
				'|',
				'link', 'insertImage', 'insertTable',
				{
					label: 'Insert',
					icon: 'plus',
					items: [ 'highlight', 'blockQuote', 'mediaEmbed', 'codeBlock', 'htmlEmbed' ]
				},
				'|',
				'alignment',
				'|',
				'bulletedList', 'numberedList', 'outdent', 'indent'
			],
			shouldNotGroupWhenFull: true
		},
		fontFamily: {
			supportAllValues: true
		},
		fontSize: {
			options: [ 10, 12, 14, 'default', 18, 20, 22 ],
			supportAllValues: true
		},
		htmlEmbed: {
			showPreviews: true
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
					label: 'Original',
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
		list: {
			properties: {
				styles: true,
				startIndex: true,
				reversed: true
			}
		},
		link: {
			decorators: {
				addTargetToExternalLinks: true,
				defaultProtocol: 'https://',
				toggleDownloadable: {
					mode: 'manual',
					label: 'Downloadable',
					attributes: {
						download: 'file'
					}
				}
			}
		},
		mention: {
			feeds: [
				{
					marker: '@',
					feed: [
						'@apple', '@bears', '@brownie', '@cake', '@cake', '@candy', '@canes', '@chocolate', '@cookie', '@cotton', '@cream',
						'@cupcake', '@danish', '@donut', '@dragée', '@fruitcake', '@gingerbread', '@gummi', '@ice', '@jelly-o',
						'@liquorice', '@macaroon', '@marzipan', '@oat', '@pie', '@plum', '@pudding', '@sesame', '@snaps', '@soufflé',
						'@sugar', '@sweet', '@topping', '@wafer'
					],
					minimumCharacters: 1
				}
			]
		},
		root: {
			placeholder: 'Type or paste your content here!'
		},
		table: {
			contentToolbar: [
				'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties', 'toggleTableCaption'
			]
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
		cloudServices: CS_CONFIG
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err );
	} );

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor-rtl' ),
		cloudServices: CS_CONFIG,
		plugins: [ ArticlePluginSet, ImageUpload, CloudServices, EasyImage, ShowBlocks ],
		toolbar: [
			'showBlocks',
			'|',
			'undo', 'redo',
			'|',
			'heading',
			'|',
			'bold', 'italic', 'numberedList', 'bulletedList',
			'|',
			'link', 'blockquote', 'uploadImage', 'insertTable', 'mediaEmbed'
		],
		language: 'ar'
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err );
	} );
