/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Bold, Italic, Underline, Strikethrough } from '@ssmckinney/ckeditor5-basic-styles';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Image, ImageCaption } from '@ssmckinney/ckeditor5-image';

import { GeneralHtmlSupport } from '../../src/generalhtmlsupport.js';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [
			Bold,
			Essentials,
			Heading,
			Italic,
			Paragraph,
			Strikethrough,
			Underline,
			GeneralHtmlSupport,
			Image,
			ImageCaption
		],
		toolbar: [
			'bold',
			'italic',
			'underline',
			'strikethrough'
		],
		htmlSupport: {
			allow: [
				{
					name: 'div'
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
