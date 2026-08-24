### Loading

Three editors, differing only in `config.link.builtinDecorators`:

1. **All of them.** Six switches: Open in a new tab, Nofollow, Noindex, Sponsored, User-generated content, Downloadable.
2. **A subset with an override.** `[ 'noFollow', 'noIndex' ]` plus the integrator's own two decorators, one of
	which reuses the `noFollow` name — so that switch should read "Do not follow (overridden)" and there should
	be exactly three: it, Noindex, and Gallery link.
3. **Off.** The default. No options button below the form and no gear in the link toolbar.

The data above should load with the flags already reflected in the switches — upcast is being exercised too.

### Testing

**The button below the form.** Select some text and press the link button. Below the URL field there should be a
**Link properties** row. Press it, and the switches should appear in the same balloon; press Back and the form
should come back with the URL still typed in.

**Options on a link that does not exist yet.** With the form open on a *new* link, open Link properties, turn
Nofollow and Open in a new tab on, press Back, type a URL, then press Insert. The link should appear with
`rel="nofollow noopener noreferrer" target="_blank"` in one go — and a single Ctrl+Z should undo all of it.

**Discarding.** Do the same but press Back on the form (or click outside) instead of Insert. Reopening the form
should show the switches back where the model has them, not where you left them.

**Composition.** Turn Nofollow, Noindex and Sponsored all on. The `rel` attribute should read
`nofollow noindex sponsored` — they compose rather than replace one another. Turning one off should leave the
other two in place.

**Editing an existing link.** Put the caret in a link and press the gear in the link toolbar. Those switches
apply *immediately*, without a Save — that is the pre-existing behaviour and should be unchanged. Reaching the
same panel through the form instead makes them wait for Insert/Update.

```
editor = window.editors.all;
editor.getData();
editor.commands.get( 'link' ).manualDecorators.map( d => d.id );
```
