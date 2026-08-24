/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { BalloonEditor } from '@ssmckinney/ckeditor5-editor-balloon';
import { ArticlePluginSet } from '@ssmckinney/ckeditor5-core/tests/_utils/articlepluginset.js';

const config = {
	image: { toolbar: [ 'toggleImageCaption', 'imageTextAlternative' ] },
	plugins: [ ArticlePluginSet ]
};

ClassicEditor
	.create( {
		...config,
		attachTo: document.querySelector( '#editor-classic' )
	} )
	.then( editor => {
		window.classicEditor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );

BalloonEditor
	.create( {
		...config,
		root: {
			element: document.querySelector( '#editor-balloon' )
		}
	} )
	.then( editor => {
		window.balloonEditor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
