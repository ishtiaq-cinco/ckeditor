/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * @module image/image/replaceimagesourcecommand
 */

import { Command, type Editor } from '@ssmckinney/ckeditor5-core';
import { type ImageUtils } from '../imageutils.js';
import type { ModelWriter, ModelElement } from '@ssmckinney/ckeditor5-engine';
import type { ImageSourceDefinition } from '../imageinsert/ui/imageinserturlview.js';

/**
 * Replace image source command.
 *
 * Changes image source to the one provided. Can be executed as follows:
 *
 * ```ts
 * editor.execute( 'replaceImageSource', { source: 'http://url.to.the/image' } );
 * ```
 *
 * Responsive sources can be replaced along with it, which is how a `<picture>` keeps its `<source>` elements across
 * an edit instead of being flattened back to a plain `<img>`:
 *
 * ```ts
 * editor.execute( 'replaceImageSource', {
 * 	source: 'http://url.to.the/large.png',
 * 	sources: [ { media: '(max-width: 767px)', srcset: 'http://url.to.the/small.png' } ]
 * } );
 * ```
 */
export class ReplaceImageSourceCommand extends Command {
	declare public value: string | null;

	constructor( editor: Editor ) {
		super( editor );

		this.decorate( 'cleanupImage' );
	}

	/**
	 * @inheritDoc
	 */
	public override refresh(): void {
		const editor = this.editor;
		const imageUtils: ImageUtils = editor.plugins.get( 'ImageUtils' );
		const element = this.editor.model.document.selection.getSelectedElement()!;

		this.isEnabled = imageUtils.isImage( element );
		this.value = this.isEnabled ? element.getAttribute( 'src' ) as string : null;
	}

	/**
	 * Executes the command.
	 *
	 * @fires execute
	 * @param options Options for the executed command.
	 * @param options.source The image source to replace.
	 * @param options.sources Responsive sources describing the new image source. Omit to leave the image a plain
	 * `<img>`; see {@link module:image/pictureediting~PictureEditing} for the shape and what it converts to.
	 */
	public override execute( options: { source: string; sources?: Array<ImageSourceDefinition> } ): void {
		const image = this.editor.model.document.selection.getSelectedElement()!;
		const imageUtils: ImageUtils = this.editor.plugins.get( 'ImageUtils' );

		this.editor.model.change( writer => {
			writer.setAttribute( 'src', options.source, image );

			this.cleanupImage( writer, image );

			// Applied after the cleanup rather than before it: `cleanupImage()` drops the previous `sources` because
			// they describe the previous `src`, while these describe the new one.
			if ( options.sources && options.sources.length ) {
				writer.setAttribute( 'sources', options.sources, image );
			}

			imageUtils.setImageNaturalSizeAttributes( image );
		} );
	}

	/**
	 * Cleanup image attributes that are not relevant to the new source.
	 *
	 * Removed attributes are: 'srcset', 'sizes', 'sources', 'width', 'height', 'alt'.
	 *
	 * This method is decorated, to allow custom cleanup logic.
	 * For example, to remove 'myImageId' attribute after 'src' has changed:
	 *
	 * ```ts
	 * replaceImageSourceCommand.on( 'cleanupImage', ( eventInfo, [ writer, image ] ) => {
	 * 	writer.removeAttribute( 'myImageId', image );
	 * } );
	 * ```
	 */
	public cleanupImage( writer: ModelWriter, image: ModelElement ): void {
		writer.removeAttribute( 'srcset', image );
		writer.removeAttribute( 'sizes', image );

		/**
		 * In case responsive images some attributes should be cleaned up.
		 * Check: https://github.com/ssmckinney/ckeditor5/issues/15093
		 */
		writer.removeAttribute( 'sources', image );
		writer.removeAttribute( 'width', image );
		writer.removeAttribute( 'height', image );
		writer.removeAttribute( 'alt', image );
	}
}
