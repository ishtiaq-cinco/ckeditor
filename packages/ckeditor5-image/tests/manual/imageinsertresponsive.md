### Loading

Three editors, differing only in `config.image.insert.responsive`:

1. **`true`** — the default Mobile and Tablet breakpoints.
2. **A custom list** — Watch, Phone and Print. Note that a breakpoint need not be a width: `media: 'print'`
	is just as valid, which is why the option takes media queries rather than pixel values.
3. **Absent** — the stock single-URL dialog, unchanged.

### Testing

**Insert.** Insert image → "Insert via URL". The dialog should show the main URL field followed by one field
per breakpoint, each labelled and showing its media query underneath. Fill the main URL and at least one
breakpoint, press Insert. The result should be a `<figure class="image"><picture>` with one `<source>` per
filled field and an `<img>` carrying the main URL.

**Blank fields are not sources.** Fill the main URL only. The result should be a plain `<img>` with no
`<picture>` wrapper at all — a blank field means "fall back", not "empty source".

**Edit.** Select a responsive image and press "Update image URL" in the image toolbar. Every field should be
prefilled from the image. Change only the main URL and save — the `<source>` elements must survive. This is
the case that used to be impossible: `replaceImageSource` deliberately clears `sources`.

**Clearing.** Select a responsive image, clear every breakpoint field, save. It should flatten back to a plain
`<img>`.

**Round trip.** Run `editor.getData()`, then `editor.setData( <that string> )`. Nothing should be lost.

**The third editor.** Its dialog must have exactly one field and behave as it always did.

```
editor = window.editors.default;
editor.getData();
editor.model.document.getRoot().getChild( 1 ).getAttribute( 'sources' );
```
