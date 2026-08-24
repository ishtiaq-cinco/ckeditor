/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * @module link/utils/builtindecorators
 */

import { logWarning } from '@ssmckinney/ckeditor5-utils';

import type { LinkBuiltinDecoratorName, LinkConfig, LinkDecoratorManualDefinition } from '../linkconfig.js';

/**
 * The manual decorators shipped with the link feature, keyed by the name used in
 * {@link module:link/linkconfig~LinkConfig#builtinDecorators `config.link.builtinDecorators`}.
 *
 * Each one is an ordinary {@link module:link/linkconfig~LinkDecoratorManualDefinition manual decorator}, so it
 * costs nothing beyond its definition: the switch buttons, undo/redo, upcast of pasted links and the state
 * restored when the caret enters an existing link all come from the machinery that already backs
 * {@link module:link/linkconfig~LinkConfig#decorators `config.link.decorators`}.
 *
 * The four `rel` flags **compose rather than overwrite** each other. On an `<a>` element `rel` is a token list
 * in the view, and it is exempt from the conflict check in
 * {@link module:link/utils/conflictingdecorators~areDecoratorsConflicting}. So turning on Nofollow and Noindex
 * together produces `rel="nofollow noindex"`, and a pasted `rel="nofollow noindex"` upcasts back into both
 * switches. `target` is deliberately *not* mergeable, which is what keeps a project's own `target` decorator
 * from silently fighting with `openInNewTab`.
 */
export const BUILTIN_LINK_DECORATORS: Record<LinkBuiltinDecoratorName, LinkDecoratorManualDefinition> = {
	openInNewTab: {
		mode: 'manual',
		label: 'Open in a new tab',
		attributes: {
			target: '_blank',

			// `noopener` denies the opened page a reference back to this one through `window.opener`, and
			// `noreferrer` additionally withholds the `Referer` header. They are what makes `target="_blank"`
			// safe, so they belong to this decorator rather than to a switch of their own.
			rel: 'noopener noreferrer'
		}
	},

	noFollow: {
		mode: 'manual',
		label: 'Nofollow',
		attributes: {
			rel: 'nofollow'
		}
	},

	noIndex: {
		mode: 'manual',
		label: 'Noindex',

		// Note that `rel="noindex"` is not part of the HTML specification: indexing is controlled on the
		// target page through `<meta name="robots">` or an `X-Robots-Tag` header. It is offered because some
		// SEO tooling reads it off links, and it is emitted verbatim.
		attributes: {
			rel: 'noindex'
		}
	},

	sponsored: {
		mode: 'manual',
		label: 'Sponsored',
		attributes: {
			rel: 'sponsored'
		}
	},

	ugc: {
		mode: 'manual',
		label: 'User-generated content',
		attributes: {
			rel: 'ugc'
		}
	},

	downloadable: {
		mode: 'manual',
		label: 'Downloadable',

		// The empty value is the boolean form of the attribute: `<a download>` asks the browser to save the
		// target under the file name the server suggests. A decorator is a single on/off switch and cannot
		// carry a per-link file name, so the named form (`download="report.pdf"`) is left to the integrator.
		attributes: {
			download: ''
		}
	}
};

/**
 * Resolves {@link module:link/linkconfig~LinkConfig#builtinDecorators `config.link.builtinDecorators`} into
 * decorator definitions, ready to be merged with `config.link.decorators`.
 *
 * @internal
 * @param builtinDecorators The configuration value: `true` for all of them, or a list of names.
 */
export function getBuiltinDecorators(
	builtinDecorators: LinkConfig[ 'builtinDecorators' ]
): Record<string, LinkDecoratorManualDefinition> {
	if ( !builtinDecorators ) {
		return {};
	}

	const names = builtinDecorators === true ?
		Object.keys( BUILTIN_LINK_DECORATORS ) as Array<LinkBuiltinDecoratorName> :
		builtinDecorators;

	const decorators: Record<string, LinkDecoratorManualDefinition> = {};

	for ( const name of names ) {
		// `hasOwnProperty` rather than `in`, so that `toString` and the rest of the prototype chain are
		// reported as unknown instead of being handed back as a decorator definition.
		// Replace with Object.hasOwn() when we upgrade to es2022.
		if ( !Object.prototype.hasOwnProperty.call( BUILTIN_LINK_DECORATORS, name ) ) {
			/**
			 * The {@link module:link/linkconfig~LinkConfig#builtinDecorators `config.link.builtinDecorators`}
			 * configuration names a decorator that the link feature does not ship.
			 *
			 * Check the spelling against {@link module:link/utils/builtindecorators~BUILTIN_LINK_DECORATORS},
			 * or define the decorator yourself in
			 * {@link module:link/linkconfig~LinkConfig#decorators `config.link.decorators`}.
			 *
			 * @error link-unknown-builtin-decorator
			 * @param {string} name The name that could not be resolved.
			 */
			logWarning( 'link-unknown-builtin-decorator', { name } );

			continue;
		}

		decorators[ name ] = BUILTIN_LINK_DECORATORS[ name ];
	}

	return decorators;
}
