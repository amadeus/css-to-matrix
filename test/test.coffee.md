setup

	expect = chai.expect
	div = document.getElementById 'test'
	precision = 100000
	data = [
		[1,2,3,4]
		[5,6,7,8]
		[9,10,11,12]
		[13,14,15,16]
	]

setup

	mocha.setup 'bdd'

	describe 'constructor', ->

		it 'adds data that is passed when intialized to its model', ->
			matrixee = new Matrixee data
			expect(matrixee.matrix).to.deep.equal data

	describe 'matrix', ->

		it 'add valid data to its instance model', ->
			matrixee = new Matrixee
			matrixee.setMatrix data
			expect(matrixee.matrix).to.deep.equal data

		it 'throw an error when intialized with an invalid array', ->
			fn = -> new Matrixee 'bad'
			expect(fn).to.throw Error

		it 'convert 3x3 matrix to 4x4', ->
			data2 = [
				[0, 1, 2],
				[3, 4, 5],
				[6, 7, 8]
			]
			matrixee = new Matrixee data2
			actual  = matrixee.getMatrix()
			expected = [
				[0, 1, 2, 0],
				[3, 4, 5, 0],
				[6, 7, 8, 0],
				[0, 0, 0, 1],
			]
			expect(actual).to.deep.equal expected

	describe 'getMatrix', ->

		it 'properly apply transformations', ->
			matrixee = new Matrixee
			matrixee.translate3d 10, 20, 30
			actual = matrixee.getMatrix()
			expected = [
				[1, 0, 0, 10]
				[0, 1, 0, 20]
				[0, 0, 1, 30]
				[0, 0, 0, 1]
			]
			expect(actual).to.deep.equal expected


	describe 'getMatrixCSS', ->

		it 'convert matricies to CSS strings', ->
			matrixee = new Matrixee data
			css = matrixee.getMatrixCSS()
			expect(css).to.equal 'matrix3d(1,5,9,13,2,6,10,14,3,7,11,15,4,8,12,16)'


	describe 'setMatrixFromCSS', ->

		it 'set a 4x4 matrix from a matrix3d css string', ->
			matrixee = new Matrixee
			matrixee.setMatrixFromCSS 'matrix3d(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)'
			actual = matrixee.getMatrix()
			expected = [
				[0, 4, 8,  12],
				[1, 5, 9,  13],
				[2, 6, 10, 14],
				[3, 7, 11, 15]
			]
			expect(actual).to.deep.equal expected

		it 'getMatrixCSS should match what was passed to setMatrixFromCSS', ->
			string = 'matrix3d(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)'
			matrixee = new Matrixee
			matrixee.setMatrixFromCSS string
			actual = matrixee.getMatrixCSS()
			expect(actual).to.equal string

		it 'set a 4x4 matrix from a matrix 2d css string', ->
			matrixee = new Matrixee
			matrixee.setMatrixFromCSS 'matrix(0, 1, 2, 3, 4, 5)'
			actual = matrixee.getMatrix()
			expected = [
				[0, 2, 4, 0],
				[1, 3, 5, 0],
				[0, 0, 1, 0],
				[0, 0, 0, 1]
			]
			expect(actual).to.deep.equal expected

		it 'create an identity matrix with a none value', ->
			matrixee = new Matrixee
			matrixee.setMatrixFromCSS('none')
			actual = matrixee.getMatrix()
			expected = [
				[1, 0, 0, 0],
				[0, 1, 0, 0],
				[0, 0, 1, 0],
				[0, 0, 0, 1]
			]
			expect(actual).to.deep.equal expected

		it 'create an identity matrix from an empty string', ->
			matrixee = new Matrixee
			matrixee.setMatrixFromCSS()
			actual = matrixee.getMatrix()
			expected = [
				[1, 0, 0, 0],
				[0, 1, 0, 0],
				[0, 0, 1, 0],
				[0, 0, 0, 1]
			]
			expect(actual).to.deep.equal expected

run

	mocha.run()
