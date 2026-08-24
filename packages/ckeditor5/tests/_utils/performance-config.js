/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { Alignment } from '@ssmckinney/ckeditor5-alignment';
import { ArticlePluginSet } from '@ssmckinney/ckeditor5-core/tests/_utils/articlepluginset.js';
import { AutoImage, ImageResize, ImageInsert } from '@ssmckinney/ckeditor5-image';
import { AutoLink, LinkImage } from '@ssmckinney/ckeditor5-link';
import { Code, Strikethrough, Subscript, Superscript, Underline } from '@ssmckinney/ckeditor5-basic-styles';
import { CodeBlock } from '@ssmckinney/ckeditor5-code-block';
import { EasyImage } from '@ssmckinney/ckeditor5-easy-image';
import { FindAndReplace } from '@ssmckinney/ckeditor5-find-and-replace';
import { FontBackgroundColor, FontColor, FontFamily, FontSize } from '@ssmckinney/ckeditor5-font';
import { Highlight } from '@ssmckinney/ckeditor5-highlight';
import { HorizontalLine } from '@ssmckinney/ckeditor5-horizontal-line';
import { HtmlEmbed } from '@ssmckinney/ckeditor5-html-embed';
import { HtmlComment, GeneralHtmlSupport } from '@ssmckinney/ckeditor5-html-support';
import { IndentBlock } from '@ssmckinney/ckeditor5-indent';
import { ListProperties, TodoList } from '@ssmckinney/ckeditor5-list';
import { Mention } from '@ssmckinney/ckeditor5-mention';
import { PageBreak } from '@ssmckinney/ckeditor5-page-break';
import { PasteFromOffice } from '@ssmckinney/ckeditor5-paste-from-office';
import { RemoveFormat } from '@ssmckinney/ckeditor5-remove-format';
import { ShowBlocks } from '@ssmckinney/ckeditor5-show-blocks';
import { SourceEditing } from '@ssmckinney/ckeditor5-source-editing';
import { SpecialCharacters, SpecialCharactersEssentials } from '@ssmckinney/ckeditor5-special-characters';
import { TableCellProperties, TableProperties, TableCaption, TableColumnResize } from '@ssmckinney/ckeditor5-table';
import { TextTransformation } from '@ssmckinney/ckeditor5-typing';
import { TextPartLanguage } from '@ssmckinney/ckeditor5-language';
import { WordCount } from '@ssmckinney/ckeditor5-word-count';
import { CloudServices } from '@ssmckinney/ckeditor5-cloud-services';
import { Style } from '@ssmckinney/ckeditor5-style';

import { CS_CONFIG } from '@ssmckinney/ckeditor5-cloud-services/tests/_utils/cloud-services-config.js';

export const config = {
	plugins: [
		ArticlePluginSet, Underline, Strikethrough, Superscript, Subscript, Code, RemoveFormat,
		FindAndReplace, FontColor, FontBackgroundColor, FontFamily, FontSize, Highlight,
		CodeBlock, TodoList, ListProperties, TableProperties, TableCellProperties, TableCaption, TableColumnResize,
		EasyImage, ImageResize, ImageInsert, LinkImage, AutoImage, HtmlEmbed, HtmlComment,
		AutoLink, Mention, TextTransformation,
		Alignment, IndentBlock,
		PasteFromOffice, PageBreak, HorizontalLine, ShowBlocks,
		SpecialCharacters, SpecialCharactersEssentials, WordCount,
		CloudServices, TextPartLanguage, SourceEditing, Style, GeneralHtmlSupport
	],
	toolbar: [
		'heading', 'style',
		'|',
		'removeFormat', 'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'link',
		'|',
		'highlight', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
		'|',
		'bulletedList', 'numberedList', 'todoList',
		'|',
		'blockQuote', 'insertImage', 'insertTable', 'mediaEmbed', 'codeBlock',
		'|',
		'htmlEmbed',
		'|',
		'alignment', 'outdent', 'indent',
		'|',
		'pageBreak', 'horizontalLine', 'specialCharacters',
		'|',
		'textPartLanguage',
		'|',
		'sourceEditing', 'showBlocks',
		'|',
		'undo', 'redo', 'findAndReplace'
	],
	cloudServices: CS_CONFIG,
	table: {
		contentToolbar: [
			'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties', 'toggleTableCaption'
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
	menuBar: {
		isVisible: true
	},
	link: {
		decorators: {
			isExternal: {
				mode: 'manual',
				label: 'Open in a new tab',
				attributes: {
					target: '_blank',
					rel: 'noopener noreferrer'
				}
			},
			isDownloadable: {
				mode: 'manual',
				label: 'Downloadable',
				attributes: {
					download: 'download'
				}
			},
			isGallery: {
				mode: 'manual',
				label: 'Gallery link',
				classes: 'gallery'
			}
		}
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
		}
	},
	style: {
		definitions: [
			{
				name: 'Article category',
				element: 'h3',
				classes: [ 'category' ]
			},
			{
				name: 'Title',
				element: 'h2',
				classes: [ 'document-title' ]
			},
			{
				name: 'Subtitle',
				element: 'h3',
				classes: [ 'document-subtitle' ]
			},
			{
				name: 'Info box',
				element: 'p',
				classes: [ 'info-box' ]
			},
			{
				name: 'Side quote',
				element: 'blockquote',
				classes: [ 'side-quote' ]
			},
			{
				name: 'Marker',
				element: 'span',
				classes: [ 'marker' ]
			},
			{
				name: 'Spoiler',
				element: 'span',
				classes: [ 'spoiler' ]
			},
			{
				name: 'Code (dark)',
				element: 'pre',
				classes: [ 'fancy-code', 'fancy-code-dark' ]
			},
			{
				name: 'Code (bright)',
				element: 'pre',
				classes: [ 'fancy-code', 'fancy-code-bright' ]
			}
		]
	}
};
