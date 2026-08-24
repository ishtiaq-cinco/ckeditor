/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { DecoupledEditor } from '@ssmckinney/ckeditor5-editor-decoupled';
import { Alignment } from '@ssmckinney/ckeditor5-alignment';
import { ArticlePluginSet } from '@ssmckinney/ckeditor5-core/tests/_utils/articlepluginset.js';
import { AutoImage, ImageResize, ImageInsert } from '@ssmckinney/ckeditor5-image';
import { AutoLink, LinkImage } from '@ssmckinney/ckeditor5-link';
import { BlockQuote } from '@ssmckinney/ckeditor5-block-quote';
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
import { CloudServices } from '@ssmckinney/ckeditor5-cloud-services';
import { Style } from '@ssmckinney/ckeditor5-style';
import { Bookmark } from '@ssmckinney/ckeditor5-bookmark';
import type { Editor } from '@ssmckinney/ckeditor5-core';

import { CS_CONFIG } from '@ssmckinney/ckeditor5-cloud-services/tests/_utils/cloud-services-config.js';

import { Fullscreen } from '../../src/fullscreen.js';

declare global {
	interface Window { editor: any }
}

const EDITOR_CONTAINER = document.getElementById( 'editor-container' )!;
const CUSTOM_FULLSCREEN_CONTAINER = document.getElementById( 'custom-fullscreen-container' )!;

const DECOUPLED_EDITOR_BUTTON = document.getElementById( 'restart-decoupled' )!;
const CLASSIC_EDITOR_BUTTON = document.getElementById( 'restart-classic' )!;

const MENU_BAR_INPUT = document.getElementById( 'menu-bar' ) as HTMLInputElement;
const MENU_BAR_FULLSCREEN_INPUT = document.getElementById( 'menu-bar-fullscreen' ) as HTMLInputElement;
const TOOLBAR_INPUT = document.getElementById( 'toolbar' ) as HTMLInputElement;
const TOOLBAR_FULLSCREEN_INPUT = document.getElementById( 'toolbar-fullscreen' ) as HTMLInputElement;
const CUSTOM_CONTAINER_INPUT = document.getElementById( 'custom-container' ) as HTMLInputElement;

let editorElement = document.getElementById( 'editor' )!;
let editorInstance: Editor;
let currentData: string;

const toolbarItems = [
	'fullscreen',
	'|',
	'heading', 'style',
	'|',
	'sourceEditing', 'showBlocks',
	'|',
	'removeFormat', 'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'link', 'bookmark',
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
	'undo', 'redo', 'findAndReplace'
];
const commonConfig = {
	plugins: [
		ArticlePluginSet, Underline, Strikethrough, Superscript, Subscript, Code, RemoveFormat,
		FindAndReplace, FontColor, FontBackgroundColor, FontFamily, FontSize, Highlight,
		CodeBlock, TodoList, ListProperties, TableProperties, TableCellProperties, TableCaption, TableColumnResize,
		EasyImage, ImageResize, ImageInsert, LinkImage, AutoImage, HtmlEmbed, HtmlComment,
		AutoLink, Mention, TextTransformation,
		Alignment, IndentBlock, Bookmark, BlockQuote,
		PasteFromOffice, PageBreak, HorizontalLine, ShowBlocks,
		SpecialCharacters, SpecialCharactersEssentials,
		CloudServices, TextPartLanguage, SourceEditing, Style, GeneralHtmlSupport, Fullscreen
	],
	toolbar: {
		items: toolbarItems
	},
	cloudServices: CS_CONFIG,
	table: {
		contentToolbar: [
			'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties', 'toggleTableCaption'
		]
	},
	image: {
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
	link: {
		decorators: {
			isExternal: {
				mode: 'manual' as const,
				label: 'Open in a new tab',
				attributes: {
					target: '_blank',
					rel: 'noopener noreferrer'
				}
			},
			isDownloadable: {
				mode: 'manual' as const,
				label: 'Downloadable',
				attributes: {
					download: 'download'
				}
			},
			isGallery: {
				mode: 'manual' as const,
				label: 'Gallery link',
				classes: 'gallery'
			}
		}
	},
	htmlEmbed: {
		showPreviews: true,
		sanitizeHtml: html => ( { html, hasChanged: false } )
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

DECOUPLED_EDITOR_BUTTON.addEventListener( 'click', () => {
	editorElement = document.getElementById( 'editor' )!;
	EDITOR_CONTAINER.style.display = 'block';
	CUSTOM_FULLSCREEN_CONTAINER.style.display = CUSTOM_CONTAINER_INPUT.checked ? 'block' : 'none';
	currentData = editorInstance.getData();

	editorInstance.destroy().then( () => {
		editorInstance.ui.view.toolbar.element.remove();

		if ( editorInstance.ui.view.menuBarView ) {
			editorInstance.ui.view.menuBarView.element.remove();
		}

		DecoupledEditor
			.create( Object.assign( {}, commonConfig,
				{
					root: {
						element: editorElement
					},
					toolbar: { items: toolbarItems, shouldNotGroupWhenFull: TOOLBAR_INPUT.checked },
					fullscreen: {
						menuBar: { isVisible: MENU_BAR_FULLSCREEN_INPUT.checked },
						toolbar: { items: toolbarItems, shouldNotGroupWhenFull: TOOLBAR_FULLSCREEN_INPUT.checked },
						...( CUSTOM_CONTAINER_INPUT.checked ? { container: document.getElementById( 'custom-fullscreen-container' ) } : {} )
					}
				}
			) )
			.then( editor => {
				( document.querySelector( '.document-editor__toolbar' )! )
					.appendChild( editor.ui.view.toolbar.element! );

				if ( MENU_BAR_INPUT.checked ) {
					( document.querySelector( '.document-editor__menu-bar' )! )
						.appendChild( editor.ui.view.menuBarView.element! );
				}

				window.editor = editorInstance = editor;
				editor.setData( currentData );
			} )
			.catch( err => {
				console.error( err.stack );
			} );
	} );
} );

CLASSIC_EDITOR_BUTTON.addEventListener( 'click', () => {
	editorElement = document.getElementById( 'editor' )!;
	EDITOR_CONTAINER.style.display = 'block';
	CUSTOM_FULLSCREEN_CONTAINER.style.display = CUSTOM_CONTAINER_INPUT.checked ? 'block' : 'none';
	currentData = editorInstance.getData();

	editorInstance.destroy().then( () => {
		editorInstance.ui.view.toolbar.element.remove();

		if ( editorInstance.ui.view.menuBarView ) {
			editorInstance.ui.view.menuBarView.element.remove();
		}

		ClassicEditor
			.create( Object.assign( {}, commonConfig,
				{
					attachTo: editorElement,
					menuBar: { isVisible: MENU_BAR_INPUT.checked },
					toolbar: { items: toolbarItems, shouldNotGroupWhenFull: TOOLBAR_INPUT.checked },
					fullscreen: {
						menuBar: { isVisible: MENU_BAR_FULLSCREEN_INPUT.checked },
						toolbar: { shouldNotGroupWhenFull: TOOLBAR_FULLSCREEN_INPUT.checked },
						...( CUSTOM_CONTAINER_INPUT.checked ? { container: document.getElementById( 'custom-fullscreen-container' ) } : {} )
					}
				}
			) )
			.then( editor => {
				window.editor = editorInstance = editor;
				editor.setData( currentData );
			} )
			.catch( err => {
				console.error( err.stack );
			} );
	} );
} );

ClassicEditor
	.create( Object.assign( {}, commonConfig,
		{
			attachTo: editorElement,
			menuBar: { isVisible: MENU_BAR_INPUT.checked },
			fullscreen: {
				menuBar: {
					isVisible: MENU_BAR_FULLSCREEN_INPUT.checked
				},
				toolbar: {
					shouldNotGroupWhenFull: TOOLBAR_FULLSCREEN_INPUT.checked
				}
			}
		}
	) )
	.then( editor => {
		window.editor = editorInstance = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
