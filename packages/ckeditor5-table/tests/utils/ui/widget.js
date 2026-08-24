/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import { ViewSelection } from '@ssmckinney/ckeditor5-engine';
import { getTableWidgetAncestor } from '../../../src/utils/ui/widget.js';

describe( 'table utils', () => {
	describe( 'widget', () => {
		describe( 'getTableWidgetAncestor()', () => {
			// See https://github.com/ssmckinney/ckeditor5/issues/11972.
			it( 'should return null if view selection is empty', () => {
				const selection = new ViewSelection();

				expect( getTableWidgetAncestor( selection ) ).toBeNull();
			} );
		} );
	} );
} );
