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

		this.transformations.perspective = Utilities.multiply(
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

		this.transformations.rotate = Utilities.multiply(
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

		this.transformations.scale = Utilities.multiply(
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

		this.transformations.skew = Utilities.multiply(
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
