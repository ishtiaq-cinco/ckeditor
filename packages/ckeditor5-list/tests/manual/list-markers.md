### Loading

The two decorated lists above should load with their SVG markers already applied — a green tick and a
red cross — which is upcast from the `class` on the `<ul>` doing its job.

### Testing

**The style grid.** Put the caret in a list and open the bulleted list dropdown. Beside Disc, Circle and
Square there should be two more tiles: Tick and Cross. The tile of the style currently in force should be
highlighted.

**Applying.** Pick Tick on the plain list. Every marker in that list should become the green tick. Pick Disc
again and it should go back to a plain bullet, with no leftover class in the data.

**Numbered lists.** Open the numbered list dropdown — the two marker tiles must *not* appear there, and
picking a marker style while in a numbered list should not be possible.

**Round trip.** Run `editor.getData()`, then `editor.setData( <that string> )`. The markers should survive.
The `<ul>` should carry a plain `class`, not a data URI.

**Nesting.** Indent an item of a tick list. The nested list should be independently styleable.

```
editor.getData();
editor.execute( 'listStyle', { type: 'circle-tick' } );
editor.execute( 'listStyle', { type: 'circle-cross' } );
editor.execute( 'listStyle', { type: 'disc' } );
```

### List properties

Open the bulleted list dropdown and expand **List properties**. It should show:

**Marker color.** The same swatches as the Font color dropdown, plus a "default" tile at the front. Picking one
should recolour the bullets — and only the bullets, not the text. It is stored as
`style="--ck-list-marker-color:…"` on the list.

Picking a colour while a **Tick or Cross** list is selected will have no visible effect, and that is correct:
those markers are images and CSS cannot recolour an image. Switch the list to Disc and the colour appears.

**Columns.** 1, 2, 3 and 4. Picking one lays the list out as a grid; picking 1 goes back to a stacked list with
no class left in the data. Narrow the window: a 3- or 4-column list should collapse to two columns below 1200px
and to one below 768px.

Both rows should grey out when the caret is not in a list.

```
editor.execute( 'listMarkerColor', { color: '#E80E71' } );
editor.execute( 'listMarkerColor', {} );          // back to default
editor.execute( 'listColumns', { columns: 3 } );
editor.execute( 'listColumns', { columns: 1 } );  // back to stacked
```
