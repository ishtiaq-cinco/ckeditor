/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { FindAndReplace } from '../../src/findandreplace.js';

import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Highlight } from '@ssmckinney/ckeditor5-highlight';
import { ArticlePluginSet } from '@ssmckinney/ckeditor5-core/tests/_utils/articlepluginset.js';
import { FontColor } from '@ssmckinney/ckeditor5-font';

// Note: We need to load paragraph because we don't have inline editors yet.
ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [ Essentials, Paragraph, FindAndReplace, Highlight, ArticlePluginSet, FontColor ],
		toolbar: [ 'heading', 'undo', 'redo', 'highlight', 'bold', 'fontColor', 'findAndReplace' ]
	} )
	.then( editor => {
		window.editor = editor;

		const button = document.getElementById( 'readonly-toggle' );
		let isReadOnly = false;

		button.addEventListener( 'click', () => {
			isReadOnly = !isReadOnly;

			if ( isReadOnly ) {
				editor.enableReadOnlyMode( 'manual-test' );
			} else {
				editor.disableReadOnlyMode( 'manual-test' );
			}

			editor.editing.view.focus();
		} );
	} )
	.catch( err => {
		console.error( err.stack );
	} );
