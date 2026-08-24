/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Alignment } from '@ssmckinney/ckeditor5-alignment';
import { ArticlePluginSet } from '@ssmckinney/ckeditor5-core/tests/_utils/articlepluginset.js';
import { AutoImage, ImageInsert } from '@ssmckinney/ckeditor5-image';
import { AutoLink, LinkImage } from '@ssmckinney/ckeditor5-link';
import { Code, Strikethrough, Subscript, Superscript, Underline } from '@ssmckinney/ckeditor5-basic-styles';
import { CodeBlock } from '@ssmckinney/ckeditor5-code-block';
import { FontBackgroundColor, FontColor, FontFamily, FontSize } from '@ssmckinney/ckeditor5-font';
import { Highlight } from '@ssmckinney/ckeditor5-highlight';
import { HorizontalLine } from '@ssmckinney/ckeditor5-horizontal-line';
import { IndentBlock } from '@ssmckinney/ckeditor5-indent';
import { Mention } from '@ssmckinney/ckeditor5-mention';
import { ShowBlocks } from '@ssmckinney/ckeditor5-show-blocks';
import { SourceEditing } from '@ssmckinney/ckeditor5-source-editing';
import { TextTransformation } from '@ssmckinney/ckeditor5-typing';
import { TextPartLanguage } from '@ssmckinney/ckeditor5-language';
import { TodoList } from '@ssmckinney/ckeditor5-list';
import { Style } from '@ssmckinney/ckeditor5-style';
import { GeneralHtmlSupport } from '@ssmckinney/ckeditor5-html-support';
import { Fullscreen } from '@ssmckinney/ckeditor5-fullscreen';

// For simplicity this is not blocked right now by the license key. We can do that later.
ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		root: {
			placeholder: 'Type the content here!'
		},
		plugins: [
			ArticlePluginSet, Underline, Strikethrough, Superscript, Subscript, Code,
			FontColor, FontBackgroundColor, FontFamily, FontSize, Highlight,
			CodeBlock, TodoList,
			ImageInsert, LinkImage, AutoImage,
			AutoLink, Mention, TextTransformation,
			Alignment, IndentBlock,
			HorizontalLine, ShowBlocks,
			TextPartLanguage, SourceEditing, Style, GeneralHtmlSupport, Fullscreen
		],
		toolbar: [
			'heading', 'style',
			'|',
			'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'link',
			'|',
			'highlight', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
			'|',
			'bulletedList', 'numberedList', 'todoList',
			'|',
			'blockQuote', 'insertImage', 'insertTable', 'mediaEmbed', 'codeBlock',
			'|',
			'alignment', 'outdent', 'indent',
			'|',
			'horizontalLine',
			'|',
			'textPartLanguage',
			'|',
			'sourceEditing', 'showBlocks',
			'|',
			'undo', 'redo', 'fullscreen'
		],
		table: {
			contentToolbar: [
				'tableColumn', 'tableRow', 'mergeTableCells'
			]
		},
		image: {
			styles: [
				'alignCenter',
				'alignLeft',
				'alignRight'
			],
			toolbar: [
				'linkImage', 'imageTextAlternative', 'toggleImageCaption', '|',
				'imageStyle:inline', 'imageStyle:breakText', 'imageStyle:wrapText'
			]
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
	} )
	.then( editor => {
		window.editor = editor;

		document.getElementById( 'clear-content' ).addEventListener( 'click', () => {
			editor.setData( '' );
		} );

		const button = document.getElementById( 'read-only' );
		let isReadOnly = false;

		button.addEventListener( 'click', () => {
			isReadOnly = !isReadOnly;

			if ( isReadOnly ) {
				editor.enableReadOnlyMode( 'manual-test' );
			} else {
				editor.disableReadOnlyMode( 'manual-test' );
			}

			button.textContent = isReadOnly ?
				'Turn off read-only mode' :
				'Turn on read-only mode';

			editor.editing.view.focus();
		} );
	} )
	.catch( err => {
		console.error( err.stack );
	} );
