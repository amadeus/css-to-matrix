(function() {
  var data, div, expect, precision;

  expect = chai.expect;

  div = document.getElementById('test');

  precision = 100000;

  data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];

  mocha.setup('bdd');

  describe('constructor', function() {
    return it('adds data that is passed when intialized to its model', function() {
      var transformer;
      transformer = new Transformer(data);
      return expect(transformer.matrix).to.deep.equal(data);
    });
  });

  describe('matrix', function() {
    it('add valid data to its instance model', function() {
      var transformer;
      transformer = new Transformer;
      transformer.setMatrix(data);
      return expect(transformer.matrix).to.deep.equal(data);
    });
    it('throw an error when intialized with an invalid array', function() {
      var fn;
      fn = function() {
        return new Transformer('bad');
      };
      return expect(fn).to["throw"](Error);
    });
    return it('convert 3x3 matrix to 4x4', function() {
      var actual, data2, expected, transformer;
      data2 = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
      transformer = new Transformer(data2);
      actual = transformer.getMatrix();
      expected = [[0, 1, 2, 0], [3, 4, 5, 0], [6, 7, 8, 0], [0, 0, 0, 1]];
      return expect(actual).to.deep.equal(expected);
    });
  });

  describe('getMatrix', function() {
    return it('properly apply transformations', function() {
      var actual, expected, transformer;
      transformer = new Transformer;
      transformer.translate3d(10, 20, 30);
      actual = transformer.getMatrix();
      expected = [[1, 0, 0, 10], [0, 1, 0, 20], [0, 0, 1, 30], [0, 0, 0, 1]];
      return expect(actual).to.deep.equal(expected);
    });
  });

  describe('getMatrixCSS', function() {
    return it('convert matricies to CSS strings', function() {
      var css, transformer;
      transformer = new Transformer(data);
      css = transformer.getMatrixCSS();
      return expect(css).to.equal('matrix3d(1,5,9,13,2,6,10,14,3,7,11,15,4,8,12,16)');
    });
  });

  describe('setMatrixFromCSS', function() {
    it('set a 4x4 matrix from a matrix3d css string', function() {
      var actual, expected, transformer;
      transformer = new Transformer;
      transformer.setMatrixFromCSS('matrix3d(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)');
      actual = transformer.getMatrix();
      expected = [[0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15]];
      return expect(actual).to.deep.equal(expected);
    });
    it('getMatrixCSS should match what was passed to setMatrixFromCSS', function() {
      var actual, string, transformer;
      string = 'matrix3d(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)';
      transformer = new Transformer;
      transformer.setMatrixFromCSS(string);
      actual = transformer.getMatrixCSS();
      return expect(actual).to.equal(string);
    });
    it('set a 4x4 matrix from a matrix 2d css string', function() {
      var actual, expected, transformer;
      transformer = new Transformer;
      transformer.setMatrixFromCSS('matrix(0, 1, 2, 3, 4, 5)');
      actual = transformer.getMatrix();
      expected = [[0, 2, 4, 0], [1, 3, 5, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
      return expect(actual).to.deep.equal(expected);
    });
    it('create an identity matrix with a none value', function() {
      var actual, expected, transformer;
      transformer = new Transformer;
      transformer.setMatrixFromCSS('none');
      actual = transformer.getMatrix();
      expected = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
      return expect(actual).to.deep.equal(expected);
    });
    return it('create an identity matrix from an empty string', function() {
      var actual, expected, transformer;
      transformer = new Transformer;
      transformer.setMatrixFromCSS();
      actual = transformer.getMatrix();
      expected = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
      return expect(actual).to.deep.equal(expected);
    });
  });

  mocha.run();

}).call(this);
