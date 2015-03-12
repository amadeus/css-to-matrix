(function(root, factory) {
	if (typeof exports === 'object') {
		module.exports = factory(
		  require('transform-to-matrix'),
		  require('matrix-utilities'),
		  require('umodel')
		);
	} else if (typeof define === 'function' && define.amd) {
		define(
			'matrixee',
			[
				'transform-to-matrix',
				'matrix-utilities',
				'umodel'
			],
			factory
		);
	} else {
		root.Matrixee = factory(
			root['transform-to-matrix'],
			root['matrix-utilities'],
			root.umodel
		);
	}
})(this, function(transformToMatrix, Utilities, UModel) {

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

// Converts output from
var _convertCSS2DMatrix = function(data){
	return data;
};

var Matrixee = function Matrixee (data) {
	// default options
	this.model = new UModel({
		matrix: new Utilities.Identity(),
		transformations: {
			perspective : new Utilities.Identity(),
			rotate      : new Utilities.Identity(),
			scale       : new Utilities.Identity(),
			skew        : new Utilities.Identity(),
			translate   : new Utilities.Identity()
		}
	});

	// set data?
	if (data) {
		this.matrix(data);
	}
};

var _matrixRegex = /(.*matrix[\w]*\(| |\).*)/g;

Matrixee.prototype = {
	// set matrix in model
	matrix: function (data) {
		////DEV
		var rows, columns;
		if (_toString.call(data) !== '[object Array]') {
			throw new TypeError('expected parameter `data` to be an Array, but was given a ' + typeof data);
		}

		rows    = data.length;
		columns = rows > 0 ? rows : 0;

		if (_toString.call(data[0]) !== '[object Array]') {
			data = _convertCSS2DMatrix(data);
		}

		if (rows !== 4 || columns !== 4) {
			throw new Error('expected parameter `data` to be a 4x4 matrix of arrays, but was given a ' + rows + 'x' + columns + ' matrix');
		}
		////END DEV

		this.model.set('matrix', data);

		return this;
	},

	setMatrixFromCSS: function(str){
		var matrix = Matrixee.getMatrixFromCSS(str);
		this.matrix(matrix);
		return this;
	},

	// apply transformations as defined in the model, and get back get calculated matrix
	getMatrix: function() {
		var matrix = this.model.get('matrix'),
			t = this.model.get('transformations');

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

		this.model.set(
			'transformations/perspective',
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

		// if angle was passed as a string, convert it to a float first
		this.model.set(
			'transformations/rotate',
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

		this.model.set(
			'transformations/scale',
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

		this.model.set(
			'transformations/skew',
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

		this.model.set(
			'transformations/translate',
			transformToMatrix.translate3d(x, y, z)
		);

		return this;
	}

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
