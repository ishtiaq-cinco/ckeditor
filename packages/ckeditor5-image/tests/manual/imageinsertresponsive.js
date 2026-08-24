/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { ArticlePluginSet } from '@ssmckinney/ckeditor5-core/tests/_utils/articlepluginset.js';
import { ImageInsertViaUrl } from '../../src/imageinsertviaurl.js';
import { PictureEditing } from '../../src/pictureediting.js';

window.editors = {};

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [ ArticlePluginSet, ImageInsertViaUrl, PictureEditing ],
		toolbar: [ 'heading', '|', 'insertImage', '|', 'undo', 'redo' ],
		image: {
			insert: {
				responsive: true
			},
			toolbar: [ 'imageTextAlternative', '|', 'insertImageViaUrl' ]
		}
	} )
	.then( editor => {
		CKEditorInspector.attach( { default: editor } );
		window.editors.default = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor2' ),
		plugins: [ ArticlePluginSet, ImageInsertViaUrl, PictureEditing ],
		toolbar: [ 'heading', '|', 'insertImage', '|', 'undo', 'redo' ],
		image: {
			insert: {
				responsive: [
					{ label: 'Watch', media: '(max-width: 320px)' },
					{ label: 'Phone', media: '(min-width: 321px) and (max-width: 767px)' },
					{ label: 'Print', media: 'print' }
				]
			},
			toolbar: [ 'imageTextAlternative', '|', 'insertImageViaUrl' ]
		}
	} )
	.then( editor => {
		CKEditorInspector.attach( { custom: editor } );
		window.editors.custom = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor3' ),
		plugins: [ ArticlePluginSet, ImageInsertViaUrl, PictureEditing ],
		toolbar: [ 'heading', '|', 'insertImage', '|', 'undo', 'redo' ],
		image: {
			toolbar: [ 'imageTextAlternative', '|', 'insertImageViaUrl' ]
		}
	} )
	.then( editor => {
		CKEditorInspector.attach( { off: editor } );
		window.editors.off = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
