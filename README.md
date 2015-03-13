# Transformer

A library for working with CSS transforms/matrices in JS

## Usage

```js
// using the default matrix
var transform = new Transformer();

// or using a custom 4x4 matrix (meaning some transformations are already applied)
var matrix = [
    [1, 2, 3, 4]
    [5, 6, 7, 8]
    [9, 0, 1, 2]
    [3, 4, 5, 6]
];
var transform = new Transformer(matrix);
```

## Example

```js
var transformer = new Transformer()

// set some transforms
transformer
    .rotate('90deg')
    .translate3d(50, 100, 200);

// get a matrix copy
var computedMatrix = transformer.getMatrixCopy();

// Returns =>
[
    [6.123233995736766e-17, -1, 0, -100],
    [1,6.123233995736766e-17,0,50.00000000000001],
    [0,0,1,200],
    [0,0,0,1]
]


// As CSS property
transformer.getMatrixCSS()
// returns =>
'matrix3d(9.870993963020204, 0.7, 0, 0, -0.5, 0, 0, 0, 0, 0, 1, 0, 443.54969815101026, 35, 200, 1)'
```

## Supported transforms

- perspective
- rotate
- rotateX
- rotateY
- rotateZ
- rotate3d
- scale
- scaleX
- scaleY
- scaleZ
- scale3d
- skew
- skewX
- skewY
- translate
- translateX
- translateY
- translateZ
- translate3d


## See also

- http://www.w3.org/TR/css3-transforms/#transform-functions
- http://www.w3.org/TR/SVG/coords.html#TransformMatrixDefined
- http://dev.opera.com/articles/view/understanding-the-css-transforms-matrix/
- http://dev.opera.com/articles/view/understanding-3d-transforms/
- http://inside.mines.edu/~gmurray/ArbitraryAxisRotation/
- http://stackoverflow.com/a/15208858/435124
- http://desandro.github.io/3dtransforms/docs/perspective.html

## Running the tests

```bash
npm i
grunt test
open test/index.html
```

then, open test/index.html in a browser

## License

MIT

Project was forked from [bcherny/css-to-matrix](https://github.com/bcherny/css-to-matrix)
