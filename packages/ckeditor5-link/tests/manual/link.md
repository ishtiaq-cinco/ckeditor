## Link

### Create new link from text

1. Select fragment of regular text.
2. Click toolbar link button.
3. Check if balloon panel attached to the selection appeared.
4. Fill in `Link URL` input in the panel.
5. Click `Save` button.
6. Check if the selection is after the text that was converted into a link.
7. Typing should not modify the link node.

### Insert new link

1. Set collapsed selection inside a regular text.
2. Click toolbar link button.
3. Check if balloon panel attached to the selection appeared.
4. Fill in `Link URL` input in the panel.
5. Click `Save` button.
6. Check if new link with anchor text the same as url value has been inserted.
7. Check if the selection is after the text node. Typing should not modify the node.

### Edit link

1. Click a link element.
2. Check if balloon panel attached to the link element appeared.
3. Change `Link URL` input value.
4. Click `Save` button.
5. Check if link href value has changed.
6. Check if the selection is after the updated text node. Typing should not modify the node.

### Keyboard support

1. Check if above use cases works for keyboard support. For opening Link panel press `Ctrl+K`, for submitting form press `Enter`.

### Unlink link fragment

1. Select link fragment.
2. Click the toolbar link button.
3. Click the "Unlink" button.
4. Check if selected text has been converted into a regular text.

### Unlink whole link

1. Click a link element.
2. Click toolbar unlink button.
3. Check if link has been converted into a regular text.

### Link options

1. Select a fragment of regular text and click the toolbar link button.
2. Below the `Link URL` field there should be a **Link properties** row.
3. Click it. Six switches should appear: Open in a new tab, Nofollow, Noindex, Sponsored,
	User-generated content, Downloadable.
4. Turn a few on. Nothing should reach the document yet.
5. Press Back, fill in `Link URL`, then click `Insert`. The link should appear with all of the
	chosen attributes at once, and a single undo should remove the whole thing.
6. Turning Nofollow, Noindex and Sponsored all on should produce `rel="nofollow noindex sponsored"` —
	they compose rather than replace one another.
7. Put the caret in an existing link and use the gear in the link toolbar instead. Those switches
	apply immediately, without a Save.
