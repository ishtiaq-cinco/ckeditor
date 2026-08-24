/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * @module list/listproperties/listpropertiesediting
 */

import { Plugin, type Editor, type PluginDependenciesOf } from '@ssmckinney/ckeditor5-core';

import type {
	Consumables,
	ViewDowncastWriter,
	ModelElement,
	ModelItem,
	UpcastElementEvent,
	ViewElement
} from '@ssmckinney/ckeditor5-engine';

import {
	ListEditing,
	type ListType,
	type ListEditingCheckAttributesEvent,
	type ListEditingPostFixerEvent,
	type ListItemAttributesMap
} from '../list/listediting.js';

import { ListStartCommand } from './liststartcommand.js';
import { ListStyleCommand } from './liststylecommand.js';
import { ListReversedCommand } from './listreversedcommand.js';
import { listPropertiesUpcastConverter } from './converters.js';
import {
	getAllSupportedStyleTypes,
	getListTypeFromListStyleType,
	getListStyleTypeFromTypeAttribute,
	getTypeAttributeFromListStyleType,
	normalizeListStyle
} from './utils/style.js';
import { ListPropertiesUtils } from './listpropertiesutils.js';
import {
	isNumberedListType
} from '../list/utils/model.js';

import type { ListIndentCommandAfterExecuteEvent } from '../list/listindentcommand.js';
import type { ListPropertiesConfig } from '../listconfig.js';
import { getNormalizedConfig } from './utils/config.js';
import { ListMarkerColorCommand } from './listmarkercolorcommand.js';
import { ListColumnsCommand } from './listcolumnscommand.js';
import {
	createListMarkerStyles,
	getListColumnsClass,
	getListColumnsFromClasses,
	getListMarkerClass,
	getListMarkerFromClasses,
	isListMarkerStyle,
	LIST_COLUMN_COUNTS,
	LIST_MARKERS
} from './utils/markers.js';

const MARKER_STYLE_ELEMENT_ID = 'ck-list-marker-styles';

const DEFAULT_LIST_TYPE = 'default';

/**
 * The custom property carrying the marker colour. It sits on the list rather than on the item so that a whole
 * list can be recoloured in one attribute, and `::marker` reads it back through `var()`.
 */
const MARKER_COLOR_PROPERTY = '--ck-list-marker-color';

/**
 * The document list properties engine feature.
 *
 * It registers the `'listStyle'`, `'listReversed'` and `'listStart'` commands if they are enabled in the configuration.
 * Read more in {@link module:list/listconfig~ListPropertiesConfig}.
 */
export class ListPropertiesEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	public static get requires(): PluginDependenciesOf<[ ListEditing, ListPropertiesUtils ]> {
		return [ ListEditing, ListPropertiesUtils ];
	}

	/**
	 * @inheritDoc
	 */
	public static get pluginName() {
		return 'ListPropertiesEditing' as const;
	}

	/**
	 * @inheritDoc
	 * @internal
	 */
	public static get licenseFeatureCode(): string {
		return 'LP';
	}

	/**
	 * @inheritDoc
	 */
	public static override get isOfficialPlugin(): true {
		return true;
	}

	/**
	 * @inheritDoc
	 */
	public static override get isPremiumPlugin(): true {
		return true;
	}

	/**
	 * @inheritDoc
	 */
	constructor( editor: Editor ) {
		super( editor );

		editor.config.define( 'list.properties', {
			styles: true,
			startIndex: false,
			reversed: false
		} );
	}

	/**
	 * @inheritDoc
	 */
	public init(): void {
		const editor = this.editor;
		const model = editor.model;
		const listEditing = editor.plugins.get( ListEditing );

		const enabledProperties = editor.config.get( 'list.properties' )!;
		const strategies = createAttributeStrategies( enabledProperties );

		this._injectMarkerStyles();

		for ( const strategy of strategies ) {
			strategy.addCommand( editor );

			model.schema.extend( '$listItem', { allowAttributes: strategy.attributeName } );

			// Register downcast strategy.
			listEditing.registerDowncastStrategy( {
				scope: 'list',
				attributeName: strategy.attributeName,

				setAttributeOnDowncast( writer, attributeValue, viewElement ) {
					strategy.setAttributeOnDowncast( writer, attributeValue, viewElement );
				}
			} );
		}

		// Set up conversion.
		editor.conversion.for( 'upcast' ).add( dispatcher => {
			for ( const strategy of strategies ) {
				dispatcher.on<UpcastElementEvent>( 'element:ol', listPropertiesUpcastConverter( strategy ) );
				dispatcher.on<UpcastElementEvent>( 'element:ul', listPropertiesUpcastConverter( strategy ) );
			}
		} );

		// Verify if the list view element (ul or ol) requires refreshing.
		listEditing.on<ListEditingCheckAttributesEvent>(
			'checkAttributes:list',
			( evt, { viewElement, modelAttributes, modelReferenceElement } ) => {
				for ( const strategy of strategies ) {
					if ( !strategy.appliesToListItem( modelReferenceElement ) ) {
						continue;
					}

					if ( strategy.getAttributeOnUpcast( viewElement ) != modelAttributes[ strategy.attributeName ] ) {
						evt.return = true;
						evt.stop();
					}
				}
			}
		);

		// Reset list properties after indenting list items.
		this.listenTo<ListIndentCommandAfterExecuteEvent>(
			editor.commands.get( 'indentList' )!,
			'afterExecute',
			( evt, changedBlocks ) => {
				model.change( writer => {
					for ( const node of changedBlocks ) {
						for ( const strategy of strategies ) {
							if ( strategy.appliesToListItem( node ) ) {
								// Just reset the attribute.
								// If there is a previous indented list that this node should be merged into,
								// the postfixer will unify all the attributes of both sub-lists.
								writer.setAttribute( strategy.attributeName, strategy.defaultValue, node );
							}
						}
					}
				} );
			}
		);

		// Add or remove list properties attributes depending on the list type.
		listEditing.on<ListEditingPostFixerEvent>( 'postFixer', ( evt, { listNodes, writer } ) => {
			for ( const { node } of listNodes ) {
				for ( const strategy of strategies ) {
					// Check if attribute is valid.
					if ( strategy.hasValidAttribute( node ) ) {
						continue;
					}

					// Add missing default property attributes...
					if ( strategy.appliesToListItem( node ) ) {
						writer.setAttribute( strategy.attributeName, strategy.defaultValue, node );
					}
					// ...or remove invalid property attributes.
					else {
						writer.removeAttribute( strategy.attributeName, node );
					}

					evt.return = true;
				}
			}
		} );

		// Make sure that all items in a single list (items at the same level & listType) have the same properties.
		listEditing.on<ListEditingPostFixerEvent>( 'postFixer', ( evt, { listNodes, writer } ) => {
			for ( const { node, previousNodeInList } of listNodes ) {
				// This is a first item of a nested list.
				if ( !previousNodeInList ) {
					continue;
				}

				// This is a first block of a list of a different type.
				if ( previousNodeInList.getAttribute( 'listType' ) != node.getAttribute( 'listType' ) ) {
					continue;
				}

				// Copy properties from the previous one.
				for ( const strategy of strategies ) {
					const { attributeName } = strategy;

					if ( !strategy.appliesToListItem( node ) ) {
						continue;
					}

					const value = previousNodeInList.getAttribute( attributeName );

					if ( node.getAttribute( attributeName ) != value ) {
						writer.setAttribute( attributeName, value, node );
						evt.return = true;
					}
				}
			}
		} );
	}

	/**
	 * Injects the generated marker rules into the document.
	 *
	 * These are *content* styles, not editor chrome: any page rendering the saved HTML needs them too, or a list
	 * with a marker class falls back to a plain bullet. They are generated from the SVGs rather than shipped as a
	 * static stylesheet so the two cannot drift apart. Use
	 * {@link module:list/listproperties/utils/markers~createListMarkerStyles} to obtain the same string for a
	 * published page or a preview iframe.
	 */
	private _injectMarkerStyles(): void {
		if ( typeof document === 'undefined' || document.getElementById( MARKER_STYLE_ELEMENT_ID ) ) {
			return;
		}

		const style = document.createElement( 'style' );

		style.id = MARKER_STYLE_ELEMENT_ID;
		style.textContent = createListMarkerStyles();

		document.head.appendChild( style );
	}
}

/**
 * Strategy for dealing with `listItem` attributes supported by this plugin.
 *
 * @internal
 */
export interface AttributeStrategy {

	/**
	 * The model attribute name.
	 */
	attributeName: keyof ListItemAttributesMap;

	/**
	 * The model attribute default value.
	 */
	defaultValue: unknown;

	/**
	 * The view consumable as expected by {@link module:engine/conversion/viewconsumable~ViewConsumable#consume `ViewConsumable`}.
	 */
	viewConsumables: Consumables;

	/**
	 * Registers an editor command.
	 */
	addCommand( editor: Editor ): void;

	/**
	 * Verifies whether the strategy is applicable for the specified model element.
	 */
	appliesToListItem( element: ModelItem ): boolean;

	/**
	 * Verifies whether the model attribute value is valid.
	 */
	hasValidAttribute( element: ModelElement ): boolean;

	/**
	 * Sets the property on the view element.
	 */
	setAttributeOnDowncast( writer: ViewDowncastWriter, value: unknown, element: ViewElement ): void;

	/**
	 * Retrieves the property value from the view element.
	 */
	getAttributeOnUpcast( element: ViewElement ): unknown;
}

/**
 * Creates an array of strategies for dealing with enabled listItem attributes.
 */
function createAttributeStrategies( enabledProperties: ListPropertiesConfig ) {
	const strategies: Array<AttributeStrategy> = [];
	const normalizedConfig = getNormalizedConfig( enabledProperties );

	if ( enabledProperties.styles ) {
		const useAttribute = normalizedConfig.styles.useAttribute;

		strategies.push( {
			attributeName: 'listStyle',
			defaultValue: DEFAULT_LIST_TYPE,
			viewConsumables: { styles: 'list-style-type' },

			addCommand( editor ) {
				let supportedTypes = getAllSupportedStyleTypes();

				if ( useAttribute ) {
					supportedTypes = supportedTypes.filter( styleType => !!getTypeAttributeFromListStyleType( styleType ) );
				}

				editor.commands.add( 'listStyle', new ListStyleCommand( editor, DEFAULT_LIST_TYPE, supportedTypes ) );
			},

			appliesToListItem( item ) {
				return item.getAttribute( 'listType' ) == 'numbered' || item.getAttribute( 'listType' ) == 'bulleted';
			},

			hasValidAttribute( item ) {
				if ( !this.appliesToListItem( item ) ) {
					return !item.hasAttribute( 'listStyle' );
				}

				if ( !item.hasAttribute( 'listStyle' ) ) {
					return false;
				}

				const value = item.getAttribute( 'listStyle' );

				if ( value == DEFAULT_LIST_TYPE ) {
					return true;
				}

				return getListTypeFromListStyleType( value as string ) == item.getAttribute( 'listType' );
			},

			setAttributeOnDowncast( writer, listStyle, element ) {
				// Whatever marker was in force before goes: only one can apply at a time, and the style being
				// set now may well not be a marker at all.
				for ( const marker of LIST_MARKERS ) {
					writer.removeClass( getListMarkerClass( marker.name ), element );
				}

				// Markers drawn from an SVG have no `list-style-type` keyword to write, so they travel as a class
				// that the generated stylesheet paints. See `module:list/listproperties/utils/markers`.
				if ( listStyle && isListMarkerStyle( listStyle as string ) ) {
					writer.removeStyle( 'list-style-type', element );
					writer.removeAttribute( 'type', element );
					writer.addClass( getListMarkerClass( listStyle as string ), element );

					return;
				}

				if ( listStyle && listStyle !== DEFAULT_LIST_TYPE ) {
					if ( useAttribute ) {
						const value = getTypeAttributeFromListStyleType( listStyle as string );

						if ( value ) {
							writer.setAttribute( 'type', value, element );

							return;
						}
					} else {
						writer.setStyle( 'list-style-type', listStyle as string, element );

						return;
					}
				}

				writer.removeStyle( 'list-style-type', element );
				writer.removeAttribute( 'type', element );
			},

			getAttributeOnUpcast( listParent ) {
				// Checked before `list-style-type`, so a `<ul>` carrying both keeps the marker it was saved with
				// rather than the plain fallback another editor or a sanitizer may have added alongside it.
				const marker = getListMarkerFromClasses( listParent.getClassNames() );

				if ( marker ) {
					return marker;
				}

				const style = listParent.getStyle( 'list-style-type' );

				if ( style ) {
					return normalizeListStyle( style );
				}

				const attribute = listParent.getAttribute( 'type' );

				if ( attribute ) {
					return getListStyleTypeFromTypeAttribute( attribute );
				}

				return DEFAULT_LIST_TYPE;
			}
		} );
	}

	if ( enabledProperties.markerColor ) {
		strategies.push( {
			attributeName: 'listMarkerColor',

			// The empty string rather than `null`, because the model treats setting an attribute to `null` as
			// removing it — the post-fixer would then set the default, find the attribute still absent, and set
			// it again forever. An empty string is stored, so "no colour chosen" is a state the list can be in.
			defaultValue: '',
			viewConsumables: { styles: MARKER_COLOR_PROPERTY },

			addCommand( editor ) {
				editor.commands.add( 'listMarkerColor', new ListMarkerColorCommand( editor ) );
			},

			appliesToListItem() {
				// Both list types: `::marker` colours the numbers of an ordered list as readily as the bullets
				// of an unordered one.
				return true;
			},

			hasValidAttribute( item ) {
				return item.hasAttribute( 'listMarkerColor' );
			},

			setAttributeOnDowncast( writer, listMarkerColor, element ) {
				if ( listMarkerColor ) {
					writer.setStyle( MARKER_COLOR_PROPERTY, listMarkerColor as string, element );
				} else {
					writer.removeStyle( MARKER_COLOR_PROPERTY, element );
				}
			},

			getAttributeOnUpcast( listParent ) {
				return listParent.getStyle( MARKER_COLOR_PROPERTY ) || '';
			}
		} );
	}

	if ( enabledProperties.columns ) {
		strategies.push( {
			attributeName: 'listColumns',
			defaultValue: 1,
			viewConsumables: { classes: LIST_COLUMN_COUNTS.filter( count => count > 1 ).map( getListColumnsClass ) },

			addCommand( editor ) {
				editor.commands.add( 'listColumns', new ListColumnsCommand( editor ) );
			},

			appliesToListItem() {
				return true;
			},

			hasValidAttribute( item ) {
				return item.hasAttribute( 'listColumns' );
			},

			setAttributeOnDowncast( writer, listColumns, element ) {
				// Every column class is cleared first: the value being set now may be a different count, or the
				// stacked default, which carries no class at all.
				for ( const count of LIST_COLUMN_COUNTS ) {
					writer.removeClass( getListColumnsClass( count ), element );
				}

				if ( ( listColumns as number ) > 1 ) {
					writer.addClass( getListColumnsClass( listColumns as number ), element );
				}
			},

			getAttributeOnUpcast( listParent ) {
				return getListColumnsFromClasses( listParent.getClassNames() );
			}
		} );
	}

	if ( enabledProperties.reversed ) {
		strategies.push( {
			attributeName: 'listReversed',
			defaultValue: false,
			viewConsumables: { attributes: 'reversed' },

			addCommand( editor ) {
				editor.commands.add( 'listReversed', new ListReversedCommand( editor ) );
			},

			appliesToListItem( item ) {
				return item.getAttribute( 'listType' ) == 'numbered';
			},

			hasValidAttribute( item ) {
				return this.appliesToListItem( item ) == item.hasAttribute( 'listReversed' );
			},

			setAttributeOnDowncast( writer, listReversed, element ) {
				if ( listReversed ) {
					writer.setAttribute( 'reversed', 'reversed', element );
				} else {
					writer.removeAttribute( 'reversed', element );
				}
			},

			getAttributeOnUpcast( listParent ) {
				return listParent.hasAttribute( 'reversed' );
			}
		} );
	}

	if ( enabledProperties.startIndex ) {
		strategies.push( {
			attributeName: 'listStart',
			defaultValue: 1,
			viewConsumables: { attributes: 'start' },

			addCommand( editor ) {
				editor.commands.add( 'listStart', new ListStartCommand( editor ) );
			},

			appliesToListItem( item ) {
				return isNumberedListType( item.getAttribute( 'listType' ) as ListType );
			},

			hasValidAttribute( item ) {
				return this.appliesToListItem( item ) == item.hasAttribute( 'listStart' );
			},

			setAttributeOnDowncast( writer, listStart, element ) {
				if ( listStart == 0 || ( listStart as number ) > 1 ) {
					writer.setAttribute( 'start', listStart, element );
				} else {
					writer.removeAttribute( 'start', element );
				}
			},

			getAttributeOnUpcast( listParent ) {
				const startAttributeValue: any = listParent.getAttribute( 'start' );

				return startAttributeValue >= 0 ? startAttributeValue : 1;
			}
		} );
	}

	return strategies;
}

declare module '../list/listediting' {
	interface ListItemAttributesMap {
		listStyle?: string;
		listStart?: number;
		listReversed?: boolean;
		listMarkerColor?: string;
		listColumns?: number;
	}
}

declare module '../list/utils/model' {
	interface ListElement {
		getAttribute( key: 'listStyle' | 'listMarkerColor' ): string;
		getAttribute( key: 'listStart' | 'listColumns' ): number;
		getAttribute( key: 'listReversed' ): boolean;
	}
}
