/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * @module list/listproperties/listcolumnscommand
 */

import { Command } from '@ssmckinney/ckeditor5-core';
import { first } from '@ssmckinney/ckeditor5-utils';

import {
	expandListBlocksToCompleteList,
	isListItemBlock
} from '../list/utils/model.js';

/**
 * The list columns command. It changes the `listColumns` attribute of the selected list items, laying a list out
 * across several columns instead of stacking it.
 *
 * It is used by the {@link module:list/listproperties~ListProperties list properties feature}.
 */
export class ListColumnsCommand extends Command {
	/**
	 * The column count of the list under the selection, or `1` for a plain stacked list.
	 *
	 * @observable
	 * @readonly
	 */
	declare public value: number | null;

	/**
	 * @inheritDoc
	 */
	public override refresh(): void {
		const value = this._getValue();

		this.value = value;
		this.isEnabled = value !== null;
	}

	/**
	 * Executes the command.
	 *
	 * @fires execute
	 * @param options.columns How many columns to lay the list out in. `1` stacks it, which is the default.
	 */
	public override execute( options: { columns?: number } = {} ): void {
		const model = this.editor.model;
		const document = model.document;
		const columns = options.columns && options.columns > 1 ? options.columns : 1;

		const blocks = expandListBlocksToCompleteList(
			Array.from( document.selection.getSelectedBlocks() ).filter( block => isListItemBlock( block ) )
		);

		model.change( writer => {
			for ( const block of blocks ) {
				writer.setAttribute( 'listColumns', columns, block );
			}
		} );
	}

	/**
	 * The column count of the list under the selection, or `null` when the selection is not in a list.
	 */
	private _getValue(): number | null {
		const block = first( this.editor.model.document.selection.getSelectedBlocks() );

		if ( !isListItemBlock( block ) ) {
			return null;
		}

		return ( block.getAttribute( 'listColumns' ) as number ) || 1;
	}
}
