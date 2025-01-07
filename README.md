# PixelPainter

## Technologies Used

* Javascript

## Description

A javascript module that adds pixel art tools to your project.

## Setup/Installation Requirements  

* download the PixelPainter.js file and add it to your project directory
* import the class `import PixelPainter from './PixelPainter.js'`
* create a PixelPainter object. The dimension of the square can be passed in as an optional parameter.
* create a dom element reference for adding dom elements

## Example
```
import PixelPainter from "./PixelPainter";

const domAnchor = document.getElementById("app");

let test = new PixelPainter(16);
test.createUI(domAnchor)
test.createGalery(domAnchor)
```

## Additional Notes
* The `setGaleryPipeFunction` function takes a callback function that runs when items in the galery drawer (created by the `createGalery` function). The callback function will only ever be served a base64 image, or null when an item is deselected.

## Known Bugs

* No known bugs

## License

[MIT](https://opensource.org/licenses/MIT)

If you have any issues, questions, ideas or concerns, please reach out to me at my email and/or make a contribution to the code via GitHub.

Copyright (c) 2025 Skylar Brockbank