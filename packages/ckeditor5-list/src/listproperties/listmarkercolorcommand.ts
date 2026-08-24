/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * @module list/listproperties/listmarkercolorcommand
 */

import { Command } from '@ssmckinney/ckeditor5-core';
import { first } from '@ssmckinney/ckeditor5-utils';

import {
	expandListBlocksToCompleteList,
	isListItemBlock
} from '../list/utils/model.js';

/**
 * The list marker colour command. It changes the `listMarkerColor` attribute of the selected list items, which is
 * what colours the bullets or numbers of a list independently of the text beside them.
 *
 * It is used by the {@link module:list/listproperties~ListProperties list properties feature}.
 *
 * **Note**: This has no effect on the markers drawn from an SVG
 * ({@link module:list/listproperties/utils/markers~LIST_MARKERS}). Those are images, and CSS cannot recolour an
 * image — they render in the colours they were drawn in, which is the point of choosing one.
 */
export class ListMarkerColorCommand extends Command {
	/**
	 * The colour of the list under the selection, or the empty string for the default.
	 *
	 * @observable
	 * @readonly
	 */
	declare public value: string;

	/**
	 * @inheritDoc
	 */
	public override refresh(): void {
		const value = this._getValue();

		this.value = value === undefined ? '' : value;
		this.isEnabled = value !== undefined;
	}

	/**
	 * Executes the command.
	 *
	 * @fires execute
	 * @param options.color A CSS colour, or `null` to restore the default.
	 */
	public override execute( options: { color?: string | null } = {} ): void {
		const model = this.editor.model;
		const document = model.document;
		// Stored as the empty string rather than `null`; see the `listMarkerColor` strategy for why.
		const color = options.color || '';

		const blocks = expandListBlocksToCompleteList(
			Array.from( document.selection.getSelectedBlocks() ).filter( block => isListItemBlock( block ) )
		);

		model.change( writer => {
			for ( const block of blocks ) {
				writer.setAttribute( 'listMarkerColor', color, block );
			}
		} );
	}

	/**
	 * The colour of the list under the selection.
	 *
	 * Returns `undefined` — as opposed to the empty string — when the selection is not in a list at all, which
	 * is what separates "no colour set" from "nothing to set a colour on".
	 */
	private _getValue(): string | undefined {
		const block = first( this.editor.model.document.selection.getSelectedBlocks() );

		if ( !isListItemBlock( block ) ) {
			return undefined;
		}

		return ( block.getAttribute( 'listMarkerColor' ) as string ) || '';
	}
}
