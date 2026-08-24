/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { ArticlePluginSet } from '@ssmckinney/ckeditor5-core/tests/_utils/articlepluginset.js';
import { LinkImage } from '../../src/linkimage.js';

// Just to have nicely styled switch buttons.
import '@ssmckinney/ckeditor5-ui/theme/components/list/list.css';

window.editors = {};

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [ ArticlePluginSet, LinkImage ],
		toolbar: [ 'link', 'undo', 'redo' ],
		link: {
			builtinDecorators: true,
			defaultProtocol: 'https://'
		},
		image: {
			toolbar: [ 'imageStyle:block', 'imageStyle:wrapText', '|', 'imageTextAlternative', '|', 'linkImage' ]
		}
	} )
	.then( editor => {
		CKEditorInspector.attach( { all: editor } );
		window.editors.all = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor2' ),
		plugins: [ ArticlePluginSet, LinkImage ],
		toolbar: [ 'link', 'undo', 'redo' ],
		link: {
			builtinDecorators: [ 'noFollow', 'noIndex' ],

			// Overrides the built-in `noFollow` by name; `noIndex` is left alone.
			decorators: {
				noFollow: {
					mode: 'manual',
					label: 'Do not follow (overridden)',
					attributes: {
						rel: 'nofollow'
					}
				},
				isGallery: {
					mode: 'manual',
					label: 'Gallery link',
					classes: 'gallery'
				}
			}
		},
		image: {
			toolbar: [ 'imageStyle:block', 'imageStyle:wrapText', '|', 'imageTextAlternative', '|', 'linkImage' ]
		}
	} )
	.then( editor => {
		CKEditorInspector.attach( { subset: editor } );
		window.editors.subset = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor3' ),
		plugins: [ ArticlePluginSet, LinkImage ],
		toolbar: [ 'link', 'undo', 'redo' ],
		image: {
			toolbar: [ 'imageStyle:block', 'imageStyle:wrapText', '|', 'imageTextAlternative', '|', 'linkImage' ]
		}
	} )
	.then( editor => {
		CKEditorInspector.attach( { off: editor } );
		window.editors.off = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
