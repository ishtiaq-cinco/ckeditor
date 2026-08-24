/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { ArticlePluginSet } from '@ssmckinney/ckeditor5-core/tests/_utils/articlepluginset.js';
import { Alignment } from '@ssmckinney/ckeditor5-alignment';
import { IndentBlock, Indent } from '@ssmckinney/ckeditor5-indent';

import { TableProperties } from '../../src/tableproperties.js';
import { TableCellProperties } from '../../src/tablecellproperties.js';

const sourceElement = document.querySelector( '#editor-table-alignment' );

ClassicEditor
	.create( {
		attachTo: sourceElement,
		image: { toolbar: [ 'toggleImageCaption', 'imageTextAlternative' ] },
		plugins: [
			ArticlePluginSet,
			Alignment,
			Indent,
			IndentBlock,
			TableProperties,
			TableCellProperties
		],
		toolbar: [
			'heading', '|', 'insertTable', '|', 'bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo'
		],
		table: {
			contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties' ],
			tableToolbar: [ 'bold', 'italic' ]
		}
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
