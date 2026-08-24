/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Enter } from '@ssmckinney/ckeditor5-enter';
import { Typing } from '@ssmckinney/ckeditor5-typing';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Link } from '@ssmckinney/ckeditor5-link';
import { BlockToolbar } from '@ssmckinney/ckeditor5-ui';
import { Image } from '../../../../src/image.js';
import { ImageCaption } from '../../../../src/imagecaption.js';

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		plugins: [ Enter, Typing, Paragraph, Link, Image, ImageCaption, BlockToolbar ],
		toolbar: [],
		blockToolbar: [ 'Link' ]
	} )
	.then( editor => {
		window.editor = editor;

		const doc = editor.model.document;

		document.querySelector( '.start' ).addEventListener( 'click', () => {
			let image;

			editor.model.change( writer => {
				image = writer.createElement( 'imageBlock', { src: 'sample-small.jpg' } );
				writer.insert( image, doc.getRoot().getChild( 0 ), 'after' );
			} );

			setTimeout( () => {
				editor.ui.view.element.querySelector( 'img' ).src = '../../sample.jpg';
			}, 3000 );
		} );
	} )
	.catch( err => {
		console.error( err.stack );
	} );
