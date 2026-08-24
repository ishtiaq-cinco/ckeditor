/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { ArticlePluginSet } from '@ssmckinney/ckeditor5-core/tests/_utils/articlepluginset.js';

import { ListProperties } from '@ssmckinney/ckeditor5-list';
import { Strikethrough, Underline } from '@ssmckinney/ckeditor5-basic-styles';
import { Table, TableToolbar, TableProperties, TableCellProperties, TableColumnResize } from '@ssmckinney/ckeditor5-table';
import { EasyImage } from '@ssmckinney/ckeditor5-easy-image';
import { FontColor, FontBackgroundColor } from '@ssmckinney/ckeditor5-font';
import { PageBreak } from '@ssmckinney/ckeditor5-page-break';
import { ImageUpload } from '@ssmckinney/ckeditor5-image';
import { Bookmark } from '@ssmckinney/ckeditor5-bookmark';
import { CloudServices } from '@ssmckinney/ckeditor5-cloud-services';
import { GeneralHtmlSupport } from '@ssmckinney/ckeditor5-html-support';
import { Indent, IndentBlock } from '@ssmckinney/ckeditor5-indent';

import { PasteFromOffice } from '../../src/pastefromoffice.js';

import { _stringifyView } from '@ssmckinney/ckeditor5-engine';

import { CS_CONFIG } from '@ssmckinney/ckeditor5-cloud-services/tests/_utils/cloud-services-config.js';

const htmlDiv = document.querySelector( '#html' );
const textDiv = document.querySelector( '#text' );
const dataDiv = document.querySelector( '#data' );
const rtfDiv = document.querySelector( '#rtf' );

ClassicEditor
	.create( {
		attachTo: document.querySelector( '#editor' ),
		image: { toolbar: [ 'toggleImageCaption', 'imageTextAlternative' ] },
		plugins: [
			ArticlePluginSet,
			Strikethrough,
			Underline,
			GeneralHtmlSupport,
			Table,
			TableToolbar,
			PageBreak,
			TableProperties,
			TableCellProperties,
			TableColumnResize,
			ImageUpload,
			CloudServices,
			EasyImage,
			PasteFromOffice,
			FontColor,
			FontBackgroundColor,
			ListProperties,
			Bookmark,
			Indent,
			IndentBlock
		],
		bookmark: {
			enableNonEmptyAnchorConversion: false
		},
		list: { properties: { styles: true, startIndex: true } },
		toolbar: [ 'heading', '|', 'bold', 'italic', 'strikethrough', 'underline', 'link', 'bookmark',
			'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'pageBreak', 'undo', 'redo' ],
		table: {
			contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties' ]
		},
		cloudServices: CS_CONFIG,
		htmlSupport: {
			allow: [
				{
					name: /.*/,
					attributes: true,
					classes: true,
					styles: true
				}
			]
		}
	} )
	.then( editor => {
		window.editor = editor;

		const clipboard = editor.plugins.get( 'ClipboardPipeline' );

		editor.editing.view.document.on( 'paste', ( evt, data ) => {
			console.clear();

			console.log( '----- paste -----' );
			console.log( data );
			console.log( 'text/html\n', data.dataTransfer.getData( 'text/html' ) );
			console.log( 'text/rtf\n', data.dataTransfer.getData( 'text/rtf' ) );
			console.log( 'text/plain\n', data.dataTransfer.getData( 'text/plain' ) );

			htmlDiv.innerText = data.dataTransfer.getData( 'text/html' );
			textDiv.innerText = data.dataTransfer.getData( 'text/plain' );
			rtfDiv.innerText = data.dataTransfer.getData( 'text/rtf' );
		} );

		clipboard.on( 'inputTransformation', ( evt, data ) => {
			console.log( '----- clipboardInput -----' );
			console.log( 'stringify( data.dataTransfer )\n', _stringifyView( data.content ) );

			dataDiv.innerText = _stringifyView( data.content );
		} );
	} )
	.catch( err => {
		console.error( err.stack );
	} );
