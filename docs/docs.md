## Overview

Checkboxland is a JavaScript library for rendering things as HTML checkboxes, and embedding them in a webpage.

You can use it to display animations, text, and arbitrary data. Checkboxland is dependency-free, framework-agnostic, and fun.

## Limitations

Having lots of elements on a webpage [can impact runtime performance](https://web.dev/dom-size/). Checkboxes are no exception. Checkboxland attempts to mitigate some of these issues, but you'll likely run into performance issues if you are displaying large grids (1500+ checkboxes), and trying to update them rapidly.

For best results, stay below 1500 checkboxes. Some good sizes in this range include `32x32`, `48x24`, and `64x16`;

## Setup

Install this package via npm:

```
npm install checkboxland
```

Import it into your application, and create a checkbox grid:

```js
import { Checkboxland } from 'checkboxland';

// Creates a 16x16 checkbox grid inside `#my-container`.
const cbl = new Checkboxland({ dimensions: '16x8', selector: '#my-container' });
```

If no options are provided, the following defaults will be used:

- `dimensions`: `8x8`
- `selector`: `#checkboxland`

## An Example

Let's display a heart on a checkbox grid:

```js
import { Checkboxland } from 'checkboxland';

const cbl = new Checkboxland({ dimensions: '8x8', selector: '#my-container' });

// Create a data representation of the heart.
const heart = [
  [0,1,1,0,0,1,1,0],
  [1,0,0,1,1,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [0,1,0,0,0,0,1,0],
  [0,0,1,0,0,1,0,0],
  [0,0,0,1,1,0,0,0],
  [0,0,0,0,0,0,0,0]
];

// This updates the grid with the data we provided.
cbl.setData(heart);
```

<img src="docs/img/checkbox-heart.png" style="width:115px; height:102px" alt="a grid of checkboxes displaying the shape of a heart" />

So what happened?

We created a JavaScript matrix (an array of arrays) to represent the grid. Each location in the matrix represents a checkbox, where:

- 0 = Unchecked
- 1 = Checked

By passing this matrix to our `setData()` method, we update the checkbox grid on the page.

For more ways to interact with the checkbox grid, see the API methods below.

## Low-level API

The low-level API lets you update the checkbox grid with raw data.

### getCheckboxValue

Gets the value of a single checkbox in the checkbox grid.

Requires an (x,y) coordinate to identify the checkbox.

*Note: the top-left corner of the grid represents the origin (0,0)*.

```
.getCheckboxValue(x, y)
```

**Arguments**

- `x` (number): The x-coordinate of the checkbox you are targeting.
- `y` (number): The y-coordinate of the checkbox you are targeting.

**Returns**

(number): Returns a 0 or a 1, where 0 represents "unchecked" and 1 represents "checked"

### setCheckboxValue

Sets the value of a single checkbox in the checkbox grid.

Requires an (x, y) coordinate to identify the checkbox.

*Note: the top-left corner of the grid represents the origin (0,0)*.

```
.setCheckboxValue(x, y, value)
```

**Arguments**

- `x` (number): The x-coordinate of the checkbox you are targeting.
- `y` (number): The y-coordinate of the checkbox you are targeting.
- `value` (number): The value of the checkbox you are setting. Must be a 0 or a 1, (since 0 represents "unchecked" and 1 represents "checked").

**Returns**

Nothing

### getData

Get a data matrix representing the current state of the checkbox grid.

```
.getData()
```

**Arguments**

None

**Returns**

(array): A matrix (array of arrays), representing the full state of the checkbox grid.


### setData

Sets the values in the checkbox grid to those in the provided matrix.

The matrix will overwrite the existing data in the grid, starting at the top-left corner.

```
.setData(data)
```

**Arguments**

- `data` (array): A matrix (array of arrays), representing the intended state of the checkbox grid.

**Returns**

Nothing

### clearData

Clears all data from the checkbox grid. Result: all checkboxes in the grid become unchecked.

```
.clearData()
```

**Arguments**

None

**Returns**

Nothing

## Extended API

Checkboxland comes with built-in plugins that extend the API with higher-level functionality. The following are the API methods provided by these "core" plugins.

### print

Prints text to the checkbox grid. This text overwrites the existing checkbox grid, starting in the top left corner.

Most of the characters in [the default font](https://github.com/bryanbraun/checkboxland/blob/master/src/plugins/print/font-5x7.js) are 5x7 checkboxes in size. Supported characters include the following:

```
ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz
0123456789`~!@#$%^&*()-_+=[]{}|\/;:"',.<>?
```

For a working example, see [the textbox demo](https://github.com/bryanbraun/checkboxland/blob/master/docs/demos/textbox/demo.js).

```
.print(text, [options])
```

**Arguments**

- `text` (string): The text you want printed to the checkbox grid.
- `options` (object)
  - `font` (object): An object containing character data for a custom font, if you want to use one. For an example, see [the clock demo](https://github.com/bryanbraun/checkboxland/blob/master/docs/demos/clock/demo.js).
  - `dataOnly` (boolean): If `true`, returns a data matrix for the text instead of updating the checkbox grid. *Default: `false`*

**Returns**

None, UNLESS `options.dataOnly` is set to `true`. If this is the case, it returns a matrix (array of array).

### marquee

Animates a block of data, by making it scroll across the checkbox grid from right to left.

For an working example, see [the marquee demo](https://github.com/bryanbraun/checkboxland/blob/master/docs/demos/marquee/demo.js).

```
.marquee(data, [options])
```

**Arguments**

- `data` (array): A matrix (array of arrays), representing the block of data you want to scroll across the grid.
- `options` (object)
  - `repeat` (boolean): Repeat the animation, once it is complete. *Default: `false`*
  - `interval` (number): The number of milliseconds between each step in the animation. *Default: `200`*
  - `fillValue` (number): If the scrolling data doesn't fill the whole checkbox grid, this value is used to fill the leftover areas. *Default: `0`*
  - `callback` (function): A callback to be executed when the animation is complete.

**Returns**

Nothing

### transitionWipe

Transition between the current checkbox grid state and a future state by wiping across the screen.

For a working example, see [the wipe demo](https://github.com/bryanbraun/checkboxland/blob/master/docs/demos/wipe/demo.js).

```
.transitionWipe(newData, [options])
```

**Arguments**

- `newData` (array): A matrix (array of arrays), representing the final state of the checkbox grid after the transition.
- `options` (object)
  - `direction` (string): The direction of the wipe. Accepts `ltr` (left-to-right) and `rtl` (right-to-left). *Default: `ltr`*
  - `interval` (number): The number of milliseconds between each step in the animation. *Default: `200`*
  - `fillValue` (number): If the scrolling data doesn't fill the whole checkbox grid, this value is used to fill the leftover areas. *Default: `0`*
  - `callback` (function): A callback to be executed when the animation is complete.

**Returns**

Nothing

### dataUtils

Perform a variety of transformations (or actions) on a matrix of data, and return the result. These transformation do not affect the checkbox grid.

```
.dataUtils(actionName, matrix, [options])
```

**Arguments**

- `actionName` (string): The name of the transformation you want to apply to your matrix.
- `matrix` (array): A matrix (array of arrays), representing the data you want to transform.
- `options` (object): Options for the transformation.

*Supported `actionName`s:*

- `invert`: Inverts the provided matrix (all 0s become 1s and vice-versa). No options supported.
- `pad`: Adds padding around the provided matrix. Options include:
  - `top` (number): The number of rows of padding on the top.
  - `bottom` (number): The number of rows of padding on the bottom.
  - `left` (number): The number of columns of padding on the left.
  - `right` (number): The number of columns of padding on the right.
  - `all` (number): Sets this padding value on all sides of the matrix.

**Returns**

(array): A matrix (array of arrays), representing the transformed data.


## Using Plugins

Checkboxland supports plugins, which extend the API and provide higher-level functionality.

Here's an example on how use a plugin to extend Checkboxland:

```js

import { Checkboxland } from 'checkboxland';
import { newFunctionality } from 'myPlugin';

Checkboxland.extend(newFunctionality);

const cbl = new Checkboxland();

// Now we can run the newFunctionality
cbl.newFunctionality();
```

You can see [an example of this in action, with Checkboxland's core plugins](https://github.com/bryanbraun/checkboxland/blob/master/src/index.js).


## Creating a Plugin

Checkboxland plugins are just JavaScript functions that get special access to Checkboxland data.

Plugins can access all of Checkboxland's properties and low-level API methods on the `this` object. This includes:

- `this.displayEl` (object) - The stored DOM element for the checkbox grid
- `this.dimensions` (array) - The dimensions of the checkbox grid, formatted like `[x, y]`
- `this.getCheckboxValue()` (function) - [See getCheckboxValue()](#getCheckboxValue)
- `this.setCheckboxValue()` (function) - [See setCheckboxValue()](#setCheckboxValue)
- `this.getData()` (function) - [See getData()](#getData)
- `this.setData()` (function) - [See setData()](#setData)
- `this.clearData()` (function) - [See clearData()](#clearData)

*Note: do not access Checkboxland's internal `this._data` object directly. Instead, use `this.getData()` and `this.setData()`.*

**An Example**

Here's an example of a plugin that logs various pieces of data to the JavaScript console:

```js
import { Checkboxland } from 'checkboxland';

// Define the plugin's functionality.
// The function name 'logData' becomes the api method name.
const myPlugin = function logData(propertyName) {
  if (propertyName === 'element') {
    console.log(this.displayEl);
  } else
  if (propertyName === 'dimensions') {
    console.log(`width: ${dimensions[0]}, height: ${dimensions[1]}`);
  } else
  if (propertyName === 'matrix') {
    console.log(this.getData());
  }
};

Checkboxland.extend(myPlugin);

const cbl = new Checkboxland({ dimensions: '4x2' });

// Use the plugin
cbl.logData('dimensions'); // => 'width: 4, height: 2'
cbl.logData('element'); // => <div id="checkboxland">...</div>
cbl.logData('matrix'); // => (2) [Array(4), Array(4)]

```

*Note: your function must have a name.* If you try to use an anonymous function as a plugin, Checkboxland will throw an error.

For more plugin examples, see [these plugins built into Checkboxland](https://github.com/bryanbraun/checkboxland/tree/master/src/plugins).
