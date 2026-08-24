#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * Publishes this fork to a private npm-compatible registry.
 *
 * The upstream release scripts do a great deal this fork does not need — changelogs, GitHub releases, CDN uploads,
 * signing. This does the three things that actually matter for consuming the fork from another project:
 *
 *   1. stamps a fork version across every package,
 *   2. builds each package's `dist`,
 *   3. publishes them all to the registry you name.
 *
 * Usage:
 *
 *   node scripts/release/publish-fork.mjs --registry https://npm.pkg.github.com --version 48.3.0-cinco.1
 *   node scripts/release/publish-fork.mjs --registry https://npm.pkg.github.com --version 48.3.0-cinco.1 --dry-run
 *   node scripts/release/publish-fork.mjs --restore              # put the versions back
 *
 * The version must differ from the upstream release the fork is based on. A registry that proxies npmjs will
 * otherwise hold two different tarballs claiming to be 48.3.0, and which one a project resolves comes down to
 * cache order.
 */

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '..', '..' );
const PACKAGES = path.join( ROOT, 'packages' );

// Where the original versions are kept while the fork version is stamped in, so `--restore` is exact rather than
// a guess at what they used to be.
const BACKUP = path.join( ROOT, 'build', '.fork-versions.json' );

const args = parseArgs( process.argv.slice( 2 ) );

if ( args.help ) {
	console.log( readFileSync( fileURLToPath( import.meta.url ), 'utf8' ).split( '*/' )[ 0 ] );
	process.exit( 0 );
}

const packageDirs = ( await readdir( PACKAGES, { withFileTypes: true } ) )
	.filter( entry => entry.isDirectory() )
	.map( entry => path.join( PACKAGES, entry.name ) )
	.filter( dir => existsSync( path.join( dir, 'package.json' ) ) );

if ( args.restore ) {
	restoreVersions();
	process.exit( 0 );
}

if ( !args.registry || !args.version ) {
	console.error( 'Both --registry and --version are required. Pass --help for usage.' );
	process.exit( 1 );
}

console.log( `Publishing ${ packageDirs.length } packages as ${ args.version } to ${ args.registry }` );

if ( args.registry.includes( 'npm.pkg.github.com' ) ) {
	console.log(
		'GitHub Packages note: if the source repository is public, disable package access inheritance ' +
		'or verify each package remains private after publishing.'
	);
}

stampVersions( args.version );

try {
	console.log( '\nBuilding every package...' );
	run( 'pnpm', [ '--recursive', '--filter', './packages/**', 'run', 'build' ], ROOT );

	console.log( '\nPublishing...' );

	// `pnpm publish` is what rewrites `workspace:*` into the real version and applies each package's
	// `publishConfig`, so the published manifests point at `dist` rather than at the TypeScript sources.
	run( 'pnpm', [
		'--recursive',
		'--filter', './packages/**',
		'publish',
		'--registry', args.registry,
		'--no-git-checks',
		...( args.dryRun ? [ '--dry-run' ] : [] )
	], ROOT );

	console.log( `\nDone. Point a project at it with:\n  npm config set registry ${ args.registry }` );
} finally {
	// The stamped version is a publishing detail; leaving it in the working tree would turn every release into a
	// diff against the branch.
	restoreVersions();
}

/**
 * Writes the fork version into every package, remembering what was there before.
 */
function stampVersions( version ) {
	const original = {};

	for ( const dir of packageDirs ) {
		const file = path.join( dir, 'package.json' );
		const pkg = JSON.parse( readFileSync( file, 'utf8' ) );

		original[ file ] = pkg.version;
		pkg.version = version;

		writeFileSync( file, JSON.stringify( pkg, null, 2 ) + '\n' );
	}

	writeFileSync( BACKUP, JSON.stringify( original, null, 2 ) + '\n' );
	console.log( `Stamped ${ Object.keys( original ).length } packages (previous versions saved).` );
}

/**
 * Puts the versions back exactly as they were.
 */
function restoreVersions() {
	if ( !existsSync( BACKUP ) ) {
		console.log( 'Nothing to restore.' );

		return;
	}

	const original = JSON.parse( readFileSync( BACKUP, 'utf8' ) );

	for ( const [ file, version ] of Object.entries( original ) ) {
		const pkg = JSON.parse( readFileSync( file, 'utf8' ) );

		pkg.version = version;
		writeFileSync( file, JSON.stringify( pkg, null, 2 ) + '\n' );
	}

	console.log( `Restored ${ Object.keys( original ).length } package versions.` );
}

function run( command, commandArgs, cwd ) {
	const result = spawnSync( command, commandArgs, { cwd, stdio: 'inherit', shell: process.platform === 'win32' } );

	if ( result.status !== 0 ) {
		throw new Error( `${ command } ${ commandArgs.join( ' ' ) } failed with ${ result.status }` );
	}
}

function parseArgs( argv ) {
	const parsed = { dryRun: false, restore: false, help: false };

	for ( let i = 0; i < argv.length; i++ ) {
		switch ( argv[ i ] ) {
			case '--registry':
				parsed.registry = argv[ ++i ];
				break;
			case '--version':
				parsed.version = argv[ ++i ];
				break;
			case '--dry-run':
				parsed.dryRun = true;
				break;
			case '--restore':
				parsed.restore = true;
				break;
			case '--help':
			case '-h':
				parsed.help = true;
				break;
		}
	}

	return parsed;
}
