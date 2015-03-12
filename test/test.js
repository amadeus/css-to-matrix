(function() {
  var data, div, expect, precision;

  expect = chai.expect;

  div = document.getElementById('test');

  precision = 100000;

  data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];

  mocha.setup('bdd');

  describe('constructor', function() {
    return it('adds data that is passed when intialized to its model', function() {
      var actual, matrixee;
      matrixee = new Matrixee(data);
      actual = matrixee.model.get('matrix');
      return expect(actual).to.deep.equal(data);
    });
  });

  describe('matrix', function() {
    it('add valid data to its instance model', function() {
      var actual, matrixee;
      matrixee = new Matrixee;
      matrixee.matrix(data);
      actual = matrixee.model.get('matrix');
      return expect(actual).to.deep.equal(data);
    });
    return it('throw an error when intialized with an invalid array', function() {
      var fn;
      fn = function() {
        return new Matrixee('bad');
      };
      return expect(fn).to["throw"](Error);
    });
  });

  describe('getMatrix', function() {
    return it('properly apply transformations', function() {
      var actual, expected, matrixee;
      matrixee = new Matrixee;
      matrixee.translate3d(10, 20, 30);
      actual = matrixee.getMatrix();
      expected = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [10, 20, 30, 1]];
      return expect(actual).to.deep.equal(expected);
    });
  });

  describe('getMatrixCSS-durp', function() {
    return it('convert matricies to CSS strings', function() {
      var css, matrixee;
      matrixee = new Matrixee(data);
      css = matrixee.getMatrixCSS();
      return expect(css).to.equal('matrix3d(1,5,9,13,2,6,10,14,3,7,11,15,4,8,12,16)');
    });
  });

  describe('setMatrixFromCSS', function() {
    it('set a 4x4 matrix from a matrix3d css string', function() {
      var actual, expected, matrixee;
      matrixee = new Matrixee;
      matrixee.setMatrixFromCSS('matrix3d(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)');
      actual = matrixee.getMatrix();
      expected = [[0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15]];
      return expect(actual).to.deep.equal(expected);
    });
    it('set a 4x4 matrix from a matrix 2d css string', function() {
      var actual, expected, matrixee;
      matrixee = new Matrixee;
      matrixee.setMatrixFromCSS('matrix(0, 1, 2, 3, 4, 5)');
      actual = matrixee.getMatrix();
      expected = [[0, 2, 4, 0], [1, 3, 5, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
      return expect(actual).to.deep.equal(expected);
    });
    it('create an identity matrix with a none value', function() {
      var actual, expected, matrixee;
      matrixee = new Matrixee;
      matrixee.setMatrixFromCSS('none');
      actual = matrixee.getMatrix();
      expected = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
      return expect(actual).to.deep.equal(expected);
    });
    return it('create an identity matrix from an empty string', function() {
      var actual, expected, matrixee;
      matrixee = new Matrixee;
      matrixee.setMatrixFromCSS();
      actual = matrixee.getMatrix();
      expected = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
      return expect(actual).to.deep.equal(expected);
    });
  });

  mocha.run();

}).call(this);
