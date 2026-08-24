/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Bold, Italic, Strikethrough } from '@ssmckinney/ckeditor5-basic-styles';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { List } from '@ssmckinney/ckeditor5-list';
import { Image } from '@ssmckinney/ckeditor5-image';
import { Table, TableCaption } from '@ssmckinney/ckeditor5-table';
import { SourceEditing } from '@ssmckinney/ckeditor5-source-editing';

import { GeneralHtmlSupport } from '../../src/generalhtmlsupport.js';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [
			Bold,
			Essentials,
			GeneralHtmlSupport,
			Italic,
			Heading,
			List,
			Image,
			Paragraph,
			SourceEditing,
			Strikethrough,
			Table,
			TableCaption
		],
		toolbar: [ 'insertTable', '|', 'bold', 'italic', 'strikethrough', '|', 'sourceEditing' ],
		htmlSupport: {
			allow: [
				{
					name: /^(figure|table|tbody|thead|tr|th|td|caption|figcaption|span|p|img)$/,
					attributes: [ 'valign' ],
					styles: true,
					classes: true
				}
			]
		}
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
