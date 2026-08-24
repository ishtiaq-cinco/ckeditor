/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { Autoformat } from '@ssmckinney/ckeditor5-autoformat';
import { BlockQuote } from '@ssmckinney/ckeditor5-block-quote';
import { Bold, Italic, Underline, Strikethrough, Superscript, Subscript, Code } from '@ssmckinney/ckeditor5-basic-styles';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Image, ImageCaption, ImageStyle, ImageToolbar, ImageResize, ImageInsert, AutoImage } from '@ssmckinney/ckeditor5-image';
import { Indent, IndentBlock } from '@ssmckinney/ckeditor5-indent';
import { Link, LinkImage, AutoLink } from '@ssmckinney/ckeditor5-link';
import { List, ListProperties } from '@ssmckinney/ckeditor5-list';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Table, TableToolbar, TableProperties, TableCellProperties, TableCaption, TableColumnResize } from '@ssmckinney/ckeditor5-table';
import { RemoveFormat } from '@ssmckinney/ckeditor5-remove-format';
import { FindAndReplace } from '@ssmckinney/ckeditor5-find-and-replace';
import { FontColor, FontBackgroundColor, FontFamily, FontSize } from '@ssmckinney/ckeditor5-font';
import { Highlight } from '@ssmckinney/ckeditor5-highlight';
import { CodeBlock } from '@ssmckinney/ckeditor5-code-block';
import { EasyImage } from '@ssmckinney/ckeditor5-easy-image';
import { HtmlEmbed } from '@ssmckinney/ckeditor5-html-embed';
import { Mention } from '@ssmckinney/ckeditor5-mention';
import { TextTransformation } from '@ssmckinney/ckeditor5-typing';
import { Alignment } from '@ssmckinney/ckeditor5-alignment';
import { PageBreak } from '@ssmckinney/ckeditor5-page-break';
import { HorizontalLine } from '@ssmckinney/ckeditor5-horizontal-line';
import { CloudServices } from '@ssmckinney/ckeditor5-cloud-services';
import { TextPartLanguage } from '@ssmckinney/ckeditor5-language';
import { SourceEditing } from '@ssmckinney/ckeditor5-source-editing';
import { Style } from '@ssmckinney/ckeditor5-style';
import { GeneralHtmlSupport } from '@ssmckinney/ckeditor5-html-support';

import { CS_CONFIG } from '@ssmckinney/ckeditor5-cloud-services/tests/_utils/cloud-services-config.js';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor-classic-lists' ),
		plugins: [
			Essentials, Autoformat, BlockQuote, Bold, Heading, Image, ImageCaption, ImageStyle, ImageToolbar, Indent, Italic, Link,
			List, Paragraph, Table, TableToolbar, Underline, Strikethrough, Superscript, Subscript, Code, RemoveFormat,
			FindAndReplace, FontColor, FontBackgroundColor, FontFamily, FontSize, Highlight,
			CodeBlock, ListProperties, TableProperties, TableCellProperties, TableCaption, TableColumnResize,
			EasyImage, ImageResize, ImageInsert, LinkImage, AutoImage, HtmlEmbed,
			AutoLink, Mention, TextTransformation, Alignment, IndentBlock, PageBreak, HorizontalLine,
			CloudServices, TextPartLanguage, SourceEditing, Style, GeneralHtmlSupport
		],
		toolbar: [
			'heading', 'style',
			'|',
			'removeFormat', 'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'link',
			'|',
			'highlight', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
			'|',
			'bulletedList', 'numberedList',
			'|',
			'blockQuote', 'insertImage', 'insertTable', 'codeBlock',
			'|',
			'htmlEmbed',
			'|',
			'alignment', 'outdent', 'indent',
			'|',
			'pageBreak', 'horizontalLine',
			'|',
			'textPartLanguage',
			'|',
			'sourceEditing',
			'|',
			'undo', 'redo', 'findAndReplace'
		],
		cloudServices: CS_CONFIG,
		root: {
			placeholder: 'Type the content here!'
		},
		list: {
			properties: {
				styles: true,
				startIndex: true,
				reversed: true
			}
		}
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
