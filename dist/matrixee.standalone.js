(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define('matrix-utilities', [], factory);
    }
    else {
        root['matrix-utilities'] = factory();
    }
}(this, function() {
var matrixutilities;

matrixutilities = (function() {
  var util;
  return util = {
    add: function(one, two) {
      var i, j, result, row, value, _i, _j, _len, _len1;
      if (one.length !== two.length) {
        throw new Error('Matrix y dimensions do not match');
      }
      result = [];
      for (i = _i = 0, _len = one.length; _i < _len; i = ++_i) {
        row = one[i];
        if (row.length !== two[i].length) {
          throw new Error("Matrix x dimensions do not match on row " + (i + 1));
        }
        result[i] = [];
        for (j = _j = 0, _len1 = row.length; _j < _len1; j = ++_j) {
          value = row[j];
          result[i][j] = value + two[i][j];
        }
      }
      return result;
    },
    multiply: function(one, two) {
      var j, k, l, result, row, size, sum, value, _i, _j, _len, _len1;
      if (one[0].length !== two.length) {
        throw new Error('Matrix 1\'s row count should equal matrix 2\'s column count');
      }
      size = one[0].length;
      result = [];
      for (j = _i = 0, _len = two.length; _i < _len; j = ++_i) {
        row = two[j];
        result[j] = [];
        for (k = _j = 0, _len1 = row.length; _j < _len1; k = ++_j) {
          value = row[k];
          l = size;
          sum = 0;
          while (l--) {
            sum += one[j][l] * two[l][k];
          }
          result[j][k] = sum;
        }
      }
      return result;
    },
    flip: function(matrix) {
      var j, k, result, row, value, _i, _j, _len, _len1;
      result = [];
      for (j = _i = 0, _len = matrix.length; _i < _len; j = ++_i) {
        row = matrix[j];
        for (k = _j = 0, _len1 = row.length; _j < _len1; k = ++_j) {
          value = row[k];
          (result[k] || (result[k] = []))[j] = value;
        }
      }
      return result;
    },
    to2d: function(matrix) {
      return [[matrix[0][0] || 1, matrix[0][1] || 0, matrix[0][3] || 0], [matrix[1][0] || 0, matrix[1][1] || 1, matrix[1][3] || 0]];
    },
    to3d: function(matrix) {
      return [[matrix[0][0] || 1, matrix[0][1] || 0, 0, matrix[0][2] || 0], [matrix[1][0] || 0, matrix[1][1] || 1, 0, matrix[1][2] || 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    },
    Identity: function() {
      return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    }
  };
})();

    return matrixutilities;
}));
(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define('transform-to-matrix', [], factory);
    }
    else {
        root['transform-to-matrix'] = factory();
    }
}(this, function() {
var transformtomatrix;

transformtomatrix = (function() {
  var fns;
  return fns = {
    perspective: function(d) {
      return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, -1 / d, 1]];
    },
    rotate: function(a) {
      return fns.rotateZ(a);
    },
    rotateX: function(a) {
      return fns.rotate3d(1, 0, 0, a);
    },
    rotateY: function(a) {
      return fns.rotate3d(0, 1, 0, a);
    },
    rotateZ: function(a) {
      var c, n;
      c = Math.cos(a);
      n = Math.sin(a);
      return [[c, -n, 0], [n, c, 0]];
    },
    rotate3d: function(x, y, z, a) {
      var c, i, n, rs, s;
      s = x * x + y * y + z * z;
      c = Math.cos(a);
      n = Math.sin(a);
      i = 1 - c;
      rs = Math.sqrt(s) * n;
      return [[(x * x + (y * y + z * z) * c) / s, (x * y * i - z * rs) / s, (x * z * i + y * rs) / s, 0], [(x * y * i + z * rs) / s, (y * y + (x * x + z * z) * c) / s, (y * z * i - x * rs) / s, 0], [(x * z * i - y * rs) / s, (y * z * i + x * rs) / s, (z * z + (x * x + y * y) * c) / s, 0], [0, 0, 0, 1]];
    },
    scale: function(x, y) {
      return [[x, 0, 0], [0, y, 0]];
    },
    scaleX: function(x) {
      return fns.scale(x, 1);
    },
    scaleY: function(y) {
      return fns.scale(1, y);
    },
    scaleZ: function(z) {
      return fns.scale3d(1, 1, z);
    },
    scale3d: function(x, y, z) {
      return [[x, 0, 0, 0], [0, y, 0, 0], [0, 0, z, 0], [0, 0, 0, 1]];
    },
    skew: function(x, y) {
      return [[1, Math.tan(x), 0], [Math.tan(y), 1, 0]];
    },
    skewX: function(x) {
      return [[1, Math.tan(x), 0], [0, 1, 0]];
    },
    skewY: function(y) {
      return [[1, 0, 0], [Math.tan(y), 1, 0]];
    },
    translate: function(x, y) {
      return [[1, 0, x], [0, 1, y]];
    },
    translateX: function(x) {
      return fns.translate(x, 0);
    },
    translateY: function(y) {
      return fns.translate(0, y);
    },
    translateZ: function(z) {
      return fns.translate3d(0, 0, z);
    },
    translate3d: function(x, y, z) {
      return [[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]];
    }
  };
})();

    return transformtomatrix;
}));
(function(root, factory) {
	if (typeof exports === 'object') {
		module.exports = factory(
		  require('transform-to-matrix'),
		  require('matrix-utilities')
		);
	} else if (typeof define === 'function' && define.amd) {
		define(
			'matrixee',
			[
				'transform-to-matrix',
				'matrix-utilities'
			],
			factory
		);
	} else {
		root.Matrixee = factory(
			root['transform-to-matrix'],
			root['matrix-utilities']
		);
	}
})(this, function(transformToMatrix, Utilities) {

// convert strings like "55deg" or ".75rad" to floats (in radians)
var _getRad = function (string) {
	if (typeof string === 'string') {
		var angle     = parseFloat(string, 10),
			isDegrees = string.indexOf('deg') > -1;

		// convert deg -> rad?
		if (isDegrees) {
			angle *= Math.PI / 180;
		}

		return angle;
	}

	return string;
};

var _toString = Object.prototype.toString;

var Matrixee = function Matrixee (data) {
	this.matrix = new Utilities.Identity();
	this.transformations = {
		perspective : new Utilities.Identity(),
		rotate      : new Utilities.Identity(),
		scale       : new Utilities.Identity(),
		skew        : new Utilities.Identity(),
		translate   : new Utilities.Identity()
	};

	// set data?
	if (data) {
		this.setMatrix(data);
	}
};

var _matrixRegex = /(.*matrix[\w]*\(| |\).*)/g;

Matrixee.prototype = {
	// set matrix in model
	setMatrix: function (data) {
		////DEV
		if (_toString.call(data) !== '[object Array]') {
			throw new TypeError('expected parameter `data` to be an Array, but was given a ' + _toString.call(data));
		}

		if (_toString.call(data[0]) !== '[object Array]') {
			throw new TypeError('nested array expected.');
		}

		if (data.length !== data[0].length) {
			throw new Error('parent and child arrays must be the same length');
		}

		if (data.length > 4 || data.length < 3) {
			throw new Error('must be a 3x3 or 4x4 matrix, was ' + data.length + 'x' + data[0].length);
		}
		////END DEV

		if (data.length === 3) {
			Matrixee.from3x3to4x4(data);
		}

		this.matrix = Matrixee.merge(this.matrix, data);

		return this;
	},

	setMatrixFromCSS: function(str){
		var matrix = Matrixee.getMatrixFromCSS(str);
		this.setMatrix(matrix);
		return this;
	},

	// apply transformations as defined in the model, and get back get calculated matrix
	getMatrix: function() {
		var matrix = Matrixee.clone(this.matrix),
			t = this.transformations;

		// perspective
		matrix = Utilities.multiply(matrix, t.perspective);

		// translate
		matrix = Utilities.multiply(matrix, t.translate);

		// rotate
		matrix = Utilities.multiply(matrix, t.rotate);

		// skew
		matrix = Utilities.multiply(matrix, t.skew);

		// scale
		matrix = Utilities.multiply(matrix, t.scale);

		return matrix;
	},

	// get matrix formatted as a string that can be plugged right into CSS's `transform` function
	getMatrixCSS: function() {
		return 'matrix3d(' +
			Utilities.flip(this.getMatrix()).reduce(function (flat, row) {
				flat.push.apply(flat, row);
				return flat;
			}, []).join(',') + ')';
	},

	// transform functions
	// 1-to-1 with their CSS equivalents
	rotate     : function (a) {
		return this.rotateZ(a);
	},

	rotateX    : function (a) {
		return this.rotate3d(1, 0, 0, a);
	},

	rotateY    : function (a) {
		return this.rotate3d(0, 1, 0, a);
	},

	rotateZ    : function (a) {
		return this.rotate3d(0, 0, 1, a);
	},

	scale      : function (x, y) {
		return this.scale3d(x, y);
	},

	scaleX     : function (x) {
		return this.scale3d(x);
	},

	scaleY     : function (y) {
		return this.scale3d(null, y);
	},

	scaleZ     : function (z) {
		return this.scale3d(null, null, z);
	},

	skewX      : function (x) {
		return this.skew(x);
	},

	skewY      : function (y) {
		return this.skew(null, y);
	},

	translate  : function (x, y) {
		return this.translate3d(x, y);
	},

	translateX : function (x) {
		return this.translate3d(x);
	},

	translateY : function (y) {
		return this.translate3d(null, y);
	},

	translateZ : function (z) {
		return this.translate3d(null, null, z);
	},

	perspective: function (x) {
		if (!x) {
			x = 0;
		}

		////DEV
		if (typeof x !== 'number') {
			throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x);
		}
		////END DEV

		Matrixee.merge(
			this.transformations.perspective,
			transformToMatrix.perspective(x)
		);
		return this;
	},

	rotate3d: function (x, y, z, a) {
		if (!x) {
			x = 0;
		}
		if (!y) {
			y = 0;
		}
		if (!z) {
			z = 0;
		}
		if (!a) {
			a = 0;
		}

		////DEV
		if (typeof x !== 'number') {
			throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x);
		}
		if (typeof y !== 'number') {
			throw new TypeError('expected parameter `y` to be a Number, but was given a ' + typeof y);
		}
		if (typeof z !== 'number') {
			throw new TypeError('expected parameter `z` to be a Number, but was given a ' + typeof z);
		}
		////END DEV

		Matrixee.merge(
			this.transformations.rotate,
			transformToMatrix.rotate3d(
				x,
				y,
				z,
				_getRad(a)
			)
		);


		return this;
	},

	scale3d: function (x, y, z) {
		if (!x && x !== 0) {
			x = 1;
		}
		if (!y && y !== 0) {
			y = 1;
		}
		if (!z && z !== 0) {
			z = 1;
		}

		////DEV
		if (typeof x !== 'number') {
			throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x);
		}
		if (typeof y !== 'number') {
			throw new TypeError('expected parameter `y` to be a Number, but was given a ' + typeof y);
		}
		if (typeof z !== 'number') {
			throw new TypeError('expected parameter `z` to be a Number, but was given a ' + typeof z);
		}
		////END DEV

		Matrixee.merge(
			this.transformations.scale,
			transformToMatrix.scale3d(x, y, z)
		);

		return this;
	},

	skew: function (x, y) {
		if (!x) {
			x = 0;
		}
		if (!y) {
			y = 0;
		}

		Matrixee.merge(
			this.transformations.skew,
			Utilities.to3d(
				transformToMatrix.skew(
					_getRad(x),
					_getRad(y)
				)
			)
		);

		return this;
	},

	translate3d: function(x, y, z) {
		if (!x) {
			x = 0;
		}
		if (!y) {
			y = 0;
		}
		if (!z) {
			z = 0;
		}

		////DEV
		if (typeof x !== 'number') {
			throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x);
		}
		if (typeof y !== 'number') {
			throw new TypeError('expected parameter `y` to be a Number, but was given a ' + typeof y);
		}
		if (typeof z !== 'number') {
			throw new TypeError('expected parameter `z` to be a Number, but was given a ' + typeof z);
		}
		////END DEV

		Matrixee.merge(
			this.transformations.translate,
			transformToMatrix.translate3d(x, y, z)
		);

		return this;
	}

};

Matrixee.clone = function(matrix){
	var newMatrix = [],
		r, c;

	for (r = 0; r < matrix.length; r++) {
		newMatrix[r] = [];
		for (c = 0; c < matrix[r].length; c++) {
			newMatrix[r][c] = matrix[r][c] || 0;
		}
	}

	return newMatrix;
};

Matrixee.merge = function(base, toMerge){
	var r, c;

	for (r = 0; r < base.length; r++) {
		for (c = 0; c < base[r].length; c++) {
			base[r][c] = toMerge[r][c] || 0;
		}
	}

	return base;
};

Matrixee.from3x3to4x4 = function(matrix){
	matrix[0].push(0);
	matrix[1].push(0);
	matrix[2].push(0);
	matrix[3] = [0, 0, 0, 1];
	return matrix;
};

Matrixee.getMatrixFromCSS = function(str){
	var values, matrix, i, ii;

	if (str === 'none' || !str) {
		return new Utilities.Identity();
	}

	str = str.replace(_matrixRegex, '');
	values = str.split(',');

	////DEV
	if (values.length !== 6 && values.length !== 16) {
		throw new TypeError('invalid array parsed from string: ' + str);
	}
	////END DEV

	if (values.length === 6) {
		values.splice(2, 0, 0, 0);
		values.splice(6, 0, 0, 0);
		values.push(1, 0, 0, 0, 0, 1);
	}

	matrix = [];

	for (i = 0; i < values.length / 4; i++) {
		matrix[i] = [];
		for (ii = 0; ii < 4; ii++) {
			matrix[i][ii] = parseFloat(values[(i * 4) + ii]);
		}
	}

	matrix = Utilities.flip(matrix);

	return matrix;
};

return Matrixee;

});
