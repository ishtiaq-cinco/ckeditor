/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * @module list/listproperties/utils/config
 */

import { pick } from 'es-toolkit/compat';
import { toArray } from '@ssmckinney/ckeditor5-utils';
import type { ColorDefinition } from '@ssmckinney/ckeditor5-ui';

import type { ListPropertiesConfig, ListPropertiesStyleListType } from '../../listconfig.js';
import { LIST_COLUMN_COUNTS } from './markers.js';

/**
 * Normalizes {@link module:list/listconfig~ListPropertiesConfig} in the configuration of the list properties feature.
 * The structure of normalized list properties options looks as follows:
 *
 * ```ts
 * {
 * 	styles: {
 * 		listTypes: [ 'bulleted', 'numbered' ],
 * 		useAttribute: false
 * 	},
 * 	startIndex: true,
 * 	reversed: true
 * }
 * ```
 *
 * @internal
 * @param config The list properties {@link module:list/listconfig~ListPropertiesConfig config}.
 * @returns An object with normalized list properties options.
 */
export function getNormalizedConfig( config: ListPropertiesConfig ): NormalizedListPropertiesConfig {
	const { startIndex, reversed, styles, markerColor, columns } = config;

	return {
		styles: getNormalizedStylesConfig( styles ),
		startIndex: startIndex || false,
		reversed: reversed || false,
		markerColor: markerColor || false,
		markerColors: [],
		columns: getNormalizedColumnsConfig( columns )
	};
}

/**
 * Normalizes styles in the configuration of the list properties feature.
 * The structure of normalized list properties options looks as follows:
 *
 * ```ts
 * {
 * 	listTypes: [ 'bulleted', 'numbered' ],
 * 	useAttribute: false
 * }
 * ```
 *
 * @param styles The list properties styles.
 * @returns An object with normalized list properties styles.
 */
function getNormalizedStylesConfig( styles: ListPropertiesConfig['styles'] ): NormalizedListPropertiesConfig['styles'] {
	const normalizedConfig: NormalizedListPropertiesConfig['styles'] = {
		listTypes: [ 'bulleted', 'numbered' ],
		useAttribute: false,
		listStyleTypes: {
			numbered: [ 'decimal', 'decimal-leading-zero', 'lower-roman', 'upper-roman', 'lower-latin', 'upper-latin' ],
			bulleted: [ 'disc', 'circle', 'square', 'circle-tick', 'circle-cross' ]
		}
	};

	if ( styles === true ) {
		return normalizedConfig;
	}

	if ( !styles ) {
		normalizedConfig.listTypes = [];
		normalizedConfig.listStyleTypes = {};
	}
	else if ( Array.isArray( styles ) || typeof styles == 'string' ) {
		normalizedConfig.listTypes = toArray( styles );
		normalizedConfig.listStyleTypes = pick( normalizedConfig.listStyleTypes, normalizedConfig.listTypes );
	}
	else {
		normalizedConfig.listTypes = styles.listTypes ?
			toArray( styles.listTypes ) :
			normalizedConfig.listTypes;

		normalizedConfig.useAttribute = !!styles.useAttribute;

		if ( styles.listStyleTypes ) {
			normalizedConfig.listStyleTypes = styles.listStyleTypes;
		} else {
			normalizedConfig.listStyleTypes = pick( normalizedConfig.listStyleTypes, normalizedConfig.listTypes );
		}
	}

	return normalizedConfig;
}

/**
 * Normalizes the column counts a list may be laid out in.
 *
 * `false` means the control is off and yields `null` rather than an empty array, so that "no columns offered" and
 * "columns offered but none of them valid" cannot be confused. Counts outside {@link
 * module:list/listproperties/utils/markers~LIST_COLUMN_COUNTS} have no CSS behind them and are dropped.
 */
function getNormalizedColumnsConfig( columns: ListPropertiesConfig['columns'] ): Array<number> | null {
	if ( !columns ) {
		return null;
	}

	const requested = columns === true ? LIST_COLUMN_COUNTS : columns;
	const normalized = requested.filter( count => LIST_COLUMN_COUNTS.includes( count ) );

	return normalized.length ? normalized : null;
}

/**
* Normalized list properties config.
*
* @internal
*/
export type NormalizedListPropertiesConfig = {
	styles: {
		listTypes: Array<ListPropertiesStyleListType>;
		listStyleTypes?: {
			numbered?: Array<string>;
			bulleted?: Array<string>;
		};
		useAttribute: boolean;
	};
	startIndex: boolean;
	reversed: boolean;
	markerColor: boolean;

	/**
	 * The swatches the marker colour grid offers. Filled in by the UI, which is where the palette lives.
	 */
	markerColors: Array<ColorDefinition>;
	columns: Array<number> | null;
};
