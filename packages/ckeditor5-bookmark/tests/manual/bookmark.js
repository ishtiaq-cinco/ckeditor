/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ClassicEditor } from '@ssmckinney/ckeditor5-editor-classic';
import { Essentials } from '@ssmckinney/ckeditor5-essentials';
import { BlockQuote } from '@ssmckinney/ckeditor5-block-quote';
import { Bold, Italic } from '@ssmckinney/ckeditor5-basic-styles';
import { CloudServices } from '@ssmckinney/ckeditor5-cloud-services';
import { CodeBlock } from '@ssmckinney/ckeditor5-code-block';
import { EasyImage } from '@ssmckinney/ckeditor5-easy-image';
import { GeneralHtmlSupport } from '@ssmckinney/ckeditor5-html-support';
import { Heading } from '@ssmckinney/ckeditor5-heading';
import { Image, ImageUpload, ImageInsert, ImageStyle, ImageToolbar } from '@ssmckinney/ckeditor5-image';
import { Link, LinkImage } from '@ssmckinney/ckeditor5-link';
import { List } from '@ssmckinney/ckeditor5-list';
import { Paragraph } from '@ssmckinney/ckeditor5-paragraph';
import { Table } from '@ssmckinney/ckeditor5-table';

import { Bookmark } from '../../src/bookmark.js';

import { CS_CONFIG } from '@ssmckinney/ckeditor5-cloud-services/tests/_utils/cloud-services-config.js';

const config = {
	plugins: [
		Essentials, Link, List, LinkImage, Paragraph, Table, Image, ImageUpload, ImageStyle, ImageToolbar,
		CodeBlock, BlockQuote, EasyImage, CloudServices, ImageInsert, Heading, Bold, Italic, Bookmark
	],
	toolbar: [
		'bookmark', '|',
		'undo', 'redo', '|',
		'heading', '|',
		'bold', 'italic', '|',
		'link', 'insertImage', 'insertTable', 'codeBlock', 'blockQuote', '|',
		'bulletedList', 'numberedList'
	],
	cloudServices: CS_CONFIG,
	menuBar: {
		isVisible: true
	},
	image: {
		toolbar: [
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:wrapText',
			'|',
			'toggleImageCaption',
			'imageTextAlternative'
		]
	}
};

const { plugins, ...configWithoutPlugins } = config;

ClassicEditor
	.create( {
		...config,
		attachTo: document.querySelector( '#editor' )
	} )
	.then( editor => {
		window.editor = editor;
		CKEditorInspector.attach( { editor } );
	} )
	.catch( err => {
		console.error( err.stack );
	} );

ClassicEditor
	.create( {
		...config,
		attachTo: document.querySelector( '#editor-wrapped-anchors-not-allowed' ),
		bookmark: {
			enableNonEmptyAnchorConversion: false
		}
	} )
	.then( editor => {
		window.editor_wrapped_anchors_not_allowed = editor;
		CKEditorInspector.attach( { editor_wrapped_anchors_not_allowed: editor } );
	} )
	.catch( err => {
		console.error( err.stack );
	} );

ClassicEditor
	.create( {
		...configWithoutPlugins,
		attachTo: document.querySelector( '#editor-with-ghs' ),
		plugins: [
			...plugins,
			GeneralHtmlSupport
		],
		htmlSupport: {
			allow: [
				{
					name: /^.*$/,
					styles: true,
					attributes: true,
					classes: true
				}
			]
		}
	} )
	.then( editor => {
		window.editor_ghs = editor;
		CKEditorInspector.attach( { editor_ghs: editor } );
	} )
	.catch( err => {
		console.error( err.stack );
	} );

ClassicEditor
	.create( {
		...configWithoutPlugins,
		attachTo: document.querySelector( '#editor-with-ghs-wrapped-anchors-not-allowed' ),
		plugins: [
			...plugins,
			GeneralHtmlSupport
		],
		bookmark: {
			enableNonEmptyAnchorConversion: false
		},
		htmlSupport: {
			allow: [
				{
					name: /^.*$/,
					styles: true,
					attributes: true,
					classes: true
				}
			]
		}
	} )
	.then( editor => {
		window.editor_ghs_wrapped_anchors_not_allowed = editor;
		CKEditorInspector.attach( { editor_ghs_wrapped_anchors_not_allowed: editor } );
	} )
	.catch( err => {
		console.error( err.stack );
	} );

ClassicEditor
	.create( {
		...config,
		language: 'ar',
		attachTo: document.querySelector( '#editor-rtl' )
	} )
	.then( editor => {
		window.editor_rtl = editor;
		CKEditorInspector.attach( { editor_rtl: editor } );
	} )
	.catch( err => {
		console.error( err.stack );
	} );
