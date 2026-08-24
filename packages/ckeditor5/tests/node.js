/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import * as @ssmckinney/ckeditor5 from '../src/index.js';
import { describe, expect, it } from 'vitest';
import * as adapterCkfinder from '@ssmckinney/ckeditor5-adapter-ckfinder';
import * as alignment from '@ssmckinney/ckeditor5-alignment';
import * as autoformat from '@ssmckinney/ckeditor5-autoformat';
import * as autosave from '@ssmckinney/ckeditor5-autosave';
import * as basicStyles from '@ssmckinney/ckeditor5-basic-styles';
import * as blockQuote from '@ssmckinney/ckeditor5-block-quote';
import * as ckbox from '@ssmckinney/ckeditor5-ckbox';
import * as ckfinder from '@ssmckinney/ckeditor5-ckfinder';
import * as clipboard from '@ssmckinney/ckeditor5-clipboard';
import * as cloudServices from '@ssmckinney/ckeditor5-cloud-services';
import * as codeBlock from '@ssmckinney/ckeditor5-code-block';
import * as core from '@ssmckinney/ckeditor5-core';
import * as easyImage from '@ssmckinney/ckeditor5-easy-image';
import * as editorBalloon from '@ssmckinney/ckeditor5-editor-balloon';
import * as editorClassic from '@ssmckinney/ckeditor5-editor-classic';
import * as editorDecoupled from '@ssmckinney/ckeditor5-editor-decoupled';
import * as editorInline from '@ssmckinney/ckeditor5-editor-inline';
import * as editorMultiRoot from '@ssmckinney/ckeditor5-editor-multi-root';
import * as engine from '@ssmckinney/ckeditor5-engine';
import * as enter from '@ssmckinney/ckeditor5-enter';
import * as essentials from '@ssmckinney/ckeditor5-essentials';
import * as findAndReplace from '@ssmckinney/ckeditor5-find-and-replace';
import * as font from '@ssmckinney/ckeditor5-font';
import * as heading from '@ssmckinney/ckeditor5-heading';
import * as highlight from '@ssmckinney/ckeditor5-highlight';
import * as horizontalLine from '@ssmckinney/ckeditor5-horizontal-line';
import * as htmlEmbed from '@ssmckinney/ckeditor5-html-embed';
import * as htmlSupport from '@ssmckinney/ckeditor5-html-support';
import * as image from '@ssmckinney/ckeditor5-image';
import * as indent from '@ssmckinney/ckeditor5-indent';
import * as language from '@ssmckinney/ckeditor5-language';
import * as link from '@ssmckinney/ckeditor5-link';
import * as list from '@ssmckinney/ckeditor5-list';
import * as markdownGfm from '@ssmckinney/ckeditor5-markdown-gfm';
import * as mediaEmbed from '@ssmckinney/ckeditor5-media-embed';
import * as mention from '@ssmckinney/ckeditor5-mention';
import * as minimap from '@ssmckinney/ckeditor5-minimap';
import * as pageBreak from '@ssmckinney/ckeditor5-page-break';
import * as paragraph from '@ssmckinney/ckeditor5-paragraph';
import * as pasteFromOffice from '@ssmckinney/ckeditor5-paste-from-office';
import * as removeFormat from '@ssmckinney/ckeditor5-remove-format';
import * as restrictedEditing from '@ssmckinney/ckeditor5-restricted-editing';
import * as selectAll from '@ssmckinney/ckeditor5-select-all';
import * as showBlocks from '@ssmckinney/ckeditor5-show-blocks';
import * as sourceEditing from '@ssmckinney/ckeditor5-source-editing';
import * as specialCharacters from '@ssmckinney/ckeditor5-special-characters';
import * as style from '@ssmckinney/ckeditor5-style';
import * as table from '@ssmckinney/ckeditor5-table';
import * as typing from '@ssmckinney/ckeditor5-typing';
import * as ui from '@ssmckinney/ckeditor5-ui';
import * as undo from '@ssmckinney/ckeditor5-undo';
import * as upload from '@ssmckinney/ckeditor5-upload';
import * as utils from '@ssmckinney/ckeditor5-utils';
import * as watchdog from '@ssmckinney/ckeditor5-watchdog';
import * as widget from '@ssmckinney/ckeditor5-widget';
import * as wordCount from '@ssmckinney/ckeditor5-word-count';

const packages = [
	adapterCkfinder,
	alignment,
	autoformat,
	autosave,
	basicStyles,
	blockQuote,
	ckbox,
	ckfinder,
	clipboard,
	cloudServices,
	codeBlock,
	core,
	easyImage,
	editorBalloon,
	editorClassic,
	editorDecoupled,
	editorInline,
	editorMultiRoot,
	engine,
	enter,
	essentials,
	findAndReplace,
	font,
	heading,
	highlight,
	horizontalLine,
	htmlEmbed,
	htmlSupport,
	image,
	indent,
	language,
	link,
	list,
	markdownGfm,
	mediaEmbed,
	mention,
	minimap,
	pageBreak,
	paragraph,
	pasteFromOffice,
	removeFormat,
	restrictedEditing,
	selectAll,
	showBlocks,
	sourceEditing,
	specialCharacters,
	style,
	table,
	typing,
	ui,
	undo,
	upload,
	utils,
	watchdog,
	widget,
	wordCount
];

describe( '"@ssmckinney/ckeditor5" Node build', () => {
	it( 'Re-exports everything', () => {
		for ( const pkg of packages ) {
			for ( const exportName of Object.keys( pkg ) ) {
				expect( @ssmckinney/ckeditor5[ exportName ], exportName ).toBe( pkg[ exportName ] );
			}
		}
	} );
} );
