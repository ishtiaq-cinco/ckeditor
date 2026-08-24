/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Essentials } from '@ssmckinney/ckeditor5-essentials';

import { GeneralHtmlSupport } from '../../src/generalhtmlsupport.js';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [
			Essentials,
			GeneralHtmlSupport,
			Paragraph
		],
		htmlSupport: {
			allow: [
				{
					name: /^.*$/,
					attributes: true
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
