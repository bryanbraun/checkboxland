# Checkboxland

<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11325206/336ea5f4-9150-11e5-9e90-d86ad31993d8.png' height='20px'/></a>

<img src="docs/img/checkboxland-banner.png" alt="a grid of checkboxes displaying the words 'Welcome to Checkboxland" />

Checkboxland is a JavaScript library for rendering anything as HTML checkboxes.

You can use it to display animations, text, and arbitrary data. It also supports plugins, so you can build more powerful APIs on top of it.

Checkboxland is dependency-free, framework-agnostic, and fun! 🙃

**[For more details see the docs.](https://bryanbraun.com/checkboxland)**

## Setup

Install this package via npm:

```
npm install checkboxland
```

## Example

Import it into your application, and create a checkbox grid:

```
import { Checkboxland } from 'checkboxland';

const cbl = new Checkboxland({ dimensions: '8x7', selector: '#my-container' });

// Create a data representation of the heart.
const heart = [
  [0,1,1,0,0,1,1,0],
  [1,0,0,1,1,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [0,1,0,0,0,0,1,0],
  [0,0,1,0,0,1,0,0],
  [0,0,0,1,1,0,0,0],
];

// This updates the grid with the data we provided.
cbl.setData(heart);
```

<img src="docs/img/checkbox-heart.png" style="width:115px; height:102px" alt="a grid of checkboxes displaying the shape of a heart" />

## Contributing

Checkboxland is designed to be extendable. If you want to add a feature, first ask yourself if it could be done as an external plugin.

If you contribution requires a change to the core library, follow these steps:

1. Fork/Clone the repo.
2. Make your changes on a feature branch.
3. Run the docs site locally (`npm run dev`) to confirm that the demos still work as expected.
4. Submit a Pull Request.

## License

MIT
