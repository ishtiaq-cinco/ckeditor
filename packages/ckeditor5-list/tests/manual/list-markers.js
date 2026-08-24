/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Indent, IndentBlock } from '@ssmckinney/ckeditor5-indent';
import { FontColor } from '@ssmckinney/ckeditor5-font';

import { List } from '../../src/list.js';
import { ListProperties } from '../../src/listproperties.js';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [ Essentials, Bold, Italic, Heading, Paragraph, Indent, IndentBlock, List, ListProperties, FontColor ],
		toolbar: [
			'heading', '|',
			'bulletedList', 'numberedList', '|',
			'fontColor', '|',
			'outdent', 'indent', '|',
			'undo', 'redo'
		],
		list: {
			properties: {
				styles: true,
				startIndex: true,
				reversed: true,
				markerColor: true,
				columns: true
			}
		}
	} )
	.then( editor => {
		CKEditorInspector.attach( { markers: editor } );
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
