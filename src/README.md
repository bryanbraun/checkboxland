# Developer Notes and Challenges

Here's some documentation on some challenges we've faced and solutions we've tried.

## Positioning

It's difficult to get checkboxes to stack next to each other well across browsers.

By default, checkboxes are `display: inline-block`, with a margin. Even when you remove the margin, the checkboxes still have space between them. This is because:

1. Inline-block elements render code white-space characters as display whitespace.
2. Inline-block elements inherit line-heights, which add extra vertical spacing.

You could remove whitespace from your code but setting line-heights is awkward because it looks different across browsers.

So, let's fix this by not making them inline-block! Unfortunately, we don't have many good options:

1. `block` - With block, you have to float the textboxes, which breaks the grid in small containers and screens.
2. `inline` - *Browsers won't let you do this one*! It still treats them like inline-block (see the computed properties).
3. `flex` - This works! However, I've noticed a noticeable performance hit on very large grids (Composite Layering taking up to twice as long on a 60x60 grid, for example).
4. `grid` - Same as flex, but with even worse performance.

For now, I'm using inline-block with some styles (like `vertical-align: top`) that minimizes most of the cross-browser differences.

Firefox's checkboxes have border-spacing around them, which it can't be overridden since they exist in the shadow-root (which cannot be customized). It's not too big of a deal, as long as the checkboxes are the same size (see next).

## Size

The default size of checkboxes can differ from browser to browser, which can affect the size of the full checkbox grid. The current browser default sizes look like this:

* Firefox: 14px;
* Edge: 14px;
* Chrome: 14px;
* Safari: 12px;

Checkboxland doesn't currently try to change these default checkbox sizes, but [this stylesheet used in the docs](https://github.com/bryanbraun/checkboxland/blob/main/docs/css/cbl-normalize-size.css) shows how to do it.

## Performance

Updating the checkboxes can be performance intensive when there's a lot of them. [Google recommends a your DOM be 1500 nodes or smaller](https://web.dev/dom-size/), which is pretty restrictive, given what we're trying to do.

Here's a few things we've done to mitigate the performance issues for large grids:

- Don't recreate checkboxes. Create them once and only toggle their attributes after that.
- Don't requery the DOM a bunch of times. Query it once, and use traversal to access the checkbox elements.
  - Note: this might be requiring more memory... possibly worth revisiting at some point.
- Don't update a checkbox if its state hasn't changed.
- Use some semi-hacky `inline-block` checkbox alignment instead of using flexbox on the rows.

The biggest issue we currently face for large grids is excessive time spent in Composite Layers. This is difficult to diagnose and fix, because it depends on browser internals.

These ideas didn't seem to make a difference:

- Applying `will-change` to the checkbox display as a whole.
- Removing `overflow: scroll` from the checkbox display.
- Applying styles using the `style` attribute, vs in a style tag on the page.

We *did* notice that using flex/grid to arrange the checkboxes has a performance cost for large grids, but the alternatives aren't ideal.

**Relevant performance reading**

- https://developers.google.com/web/tools/lighthouse/audits/dom-size
- https://codeburst.io/taming-huge-collections-of-dom-nodes-bebafdba332

### Future performance ideas

- Todo: Create a perf-test page with a pre-built scenario that makes it easier to profile and test solutions.
- Support rendering checkboxes to canvas (for extra large grids)?
  - Prototype here: https://codepen.io/bryanbraun/pen/abOZapL
  - Wouldn't be interactive.
  - Might have performance issues of its own, though a custom-designed checkbox *might* avoid those issues.
- Hide the default checkbox display and show instead a custom styled checkbox designed to look like the default one?
