(function(exports){

	/**
	 * The main method for constructing a sudoku solver for a particular type of
	 * sudoku puzzle.
	 * 
	 * @param {array}  [alphabet] defaults to [1,2,3,4,5,6,7,8,9] and represents the set of allowed symbols.
	 * @param {number} [length]   defaults to 9x9 and represents the number of cells in the puzzle.
	 * @param {array}  [groups]   the groups that must have distinct values, defaults to correct values for sudoku.
	 * @return {object} an object with a solve and a solveState function.
	 * @api public
	 */
	function problemType(alphabet, length, groups){
		alphabet = alphabet || getDefaultAlphabet();
		length = length || getDefaultLength();
		groups = groups || getDefaultGroups();
		function start(){
			var res = [];
			for (var i = 0; i <length; i++) {
				res.push(arrayClone(alphabet));
			}
			return res;
		};
		var groupCache = (function(){
			var res = [];
			for (var i = 0; i <length; i++) {
				var relevantGroups = groups.filter(function(group){
					return group.some(function(value){
						return value == i;
					});
				});
				var flattened = arrayDistinct(arrayFlatten(relevantGroups));
				var dependancies = arrayRemove(flattened,i);
				res.push(dependancies);
			}
			return res;
		}());
		function set(puzzleState, position, value){
			puzzleState[position] = [value];
			var group = groupCache[position];
			for (var i = 0; i < group.length; i++) {
				var mustRec = puzzleState[group[i]].length !=1;
				puzzleState[group[i]] = arrayRemove(puzzleState[group[i]], value);
				if(mustRec && puzzleState[group[i]].length === 1){
					set(puzzleState, group[i], puzzleState[group[i]][0]);
				}
			}
			return puzzleState;
		}

		/**
		 * The standard method to solve a puzzle. Will return either a solution, or false.
		 * 
		 * @api public
		 */
		function solve(initial){
			if(initial.length != length){
				throw "Initial length expected to equal standard length of problem type."+initial.length + "!=" + length;
			}
			var state = start();
			for (var i = 0; i < initial.length; i++) {
				if(initial[i] != null) set(state, i, initial[i]);
			};
			var result = solveState(state);
			if(result){
				return result.map(function(arr){
					return arr[0];
				})
			}else{
				console.log(state);
				return false;
			}
		}
		function solveState(state){
			var solved = true;
			var shortest = alphabet.length + 10;
			var shortestIndex = null;
			for(var i = 0; i < state.length; i++){
				if(state[i].length === 0){
					return false;
				}else if(state[i].length > 1){
					solved = false;
					if(state[i].length < shortest){
						shortest = state[i].length;
						shortestIndex = i;
					}
				}
			}
			if(solved)return state;
			var current;
			for(var i = 0; i<shortest; i++){
				current = arrayClone(state);
				var result = solveState(set(current, shortestIndex, current[shortestIndex][i]));
				if(result){
					return result;
				}
			}
			return false;
		}
		return {solve:solve,solveState:solveState};
	}
	exports.problemType = problemType;

	/**
	 * Gets a string with an ASCII grid to show where the indexes in an array correspond to cells in Sudoku.
	 * 
	 * @return {string}
	 * @api development (not for use in live systems)
	 */
	function getSudokuPattern(){
		var lineSeparator = "\n ||--------------||--------------||--------------||\n";
		var res = [];
		for(var x = 0; x<9; x++){
			if(x/3===parseInt(x/3))res.push(lineSeparator.replace(/-/g,"="));
			else res.push(lineSeparator);
			var lineData = range(x*9, ((x+1)*9)).map(function(v){
				var s = ""+v;
				if(s.length === 1) s = "0"+s;
				return s;
			});
			var line = [];
			for (var i = 0; i < lineData.length; i++) {
				if(i/3===parseInt(i/3))line.push(" || ");
				else line.push(" | ");
				line.push(lineData[i]);
			};
			line.push(" || ");
			res.push(line.join(""));
		}
		res.push(lineSeparator.replace(/-/g,"="));
		return res.join("");
	}
	exports.getSudokuPattern = getSudokuPattern;

	/**
	 * formats the solution array as a 9x9 grid with inner grids of 3x3.
	 * 
	 * @param {arrray} solution The solution array.
	 * @return {string} formatted output for display.
	 * @api development (not for use in live systems)
	 */
	function formatSudoku(solution){
		if(!solution) return "Could not solve this puzzle";
		var lineSeparator = "\n ||-----------||-----------||-----------||\n";
		var res = [];
		for(var x = 0; x<9; x++){
			if(x/3===parseInt(x/3))res.push(lineSeparator.replace(/-/g,"="));
			else res.push(lineSeparator);
			var lineData = range(x*9, ((x+1)*9)).map(function(v){
				return solution[v] || " ";
			});
			var line = [];
			for (var i = 0; i < lineData.length; i++) {
				if(i/3===parseInt(i/3))line.push(" || ");
				else line.push(" | ");
				line.push(lineData[i]);
			};
			line.push(" || ");
			res.push(line.join(""));
		}
		res.push(lineSeparator.replace(/-/g,"="));
		return res.join("");
	}
	exports.formatSudoku = formatSudoku;

	/**
	 * Get the default Sudoku alphabet: [1,2,3,4,5,6,7,8,9]
	 * 
	 * This is useful if you need to extend the aphabet slightly
	 * 
	 * Example:
	 *     
	 *     //Numbers 0-9 and A or B
	 *     var alphabet = sudoku.getDefaultAlphabet();
	 *     alphabet.push('A');
	 *     alphabet.push('B');
	 *     var solver = sudoku.problemType(alphabet).solve;
	 * 
	 * @returns {array} an array with the numbers 1-9 (inclusive)
	 * @api public
	 */
	function getDefaultAlphabet(){
		return range(1,10);
	}
	exports.getDefaultAlphabet = getDefaultAlphabet;

	/**
	 * Get the default lenght of a sudoku puzle, used internally.
	 * 
	 * @returns {number}
	 * @api private
	 */
	function getDefaultLength(){
		return 9*9;
	}

	/**
	 * Returns the default groups of distinct characters.
	 * 
	 * For sudoku this is rows, columns and 3x3 squares.
	 * 
	 * Useful for extending.
	 *
	 * Example:
	 *     
	 *     //Adding diagonals as well
	 *     var groups = sudoku.getDefaultGroups();
	 *	   groups.add([0,10,20,30,40,50,60,70,80]);
	 *     groups.add([8,16,24,32,40,48,56,64,72]);
	 *     var solver = sodoku.problemType(null, null, groups);
	 *
	 * @return {array} an array of arrays of cell indexes.
	 * @api public
	 */
	function getDefaultGroups(){
		var result = [];
		for(var x = 0; x<9; x++){
			//rows
			result.push(range(x*9, ((x+1)*9)));
			//columns
			result.push(range(x, 9*9 + x, 9));
		}
		//3 x 3 sauares
		var pattern = [
			0,1,2,
			9,10,11,
			18,19,20
			];
		function shifted(shift){
			result.push(pattern.map(function(v){
				return v+shift;
			}));
		}
		shifted(0);
		shifted(3);
		shifted(6);
		shifted(9*3 + 0);
		shifted(9*3 + 3);
		shifted(9*3 + 6);
		shifted(9*6 + 0);
		shifted(9*6 + 3);
		shifted(9*6 + 6);
		return result;
	}
	exports.getDefaultGroups = getDefaultGroups;

	/**
	 * Get a new empty grid of the right size to then fill with values.
	 * Once you have filled in the values you want, the rest will be
	 * filled in when the puzzle is solved.
	 *
	 * @param {number} [length] The length of the array/total number of cells (defaults to sudoku)
	 * @return {array} An array filled with null values.
	 * @api public
	 */
	function getEmpty(length){
		length = length || getDefaultLength();
		var res = [];
		for (var i = 0; i < length; i++) {
			res.push(null);
		}
		return res;
	}
	exports.getEmpty = getEmpty;

	/**
	 * Helper Functions
	 * 
	 * @api private
	 */
	function range(start, end, jump){
		jump = jump || 1;
		var result = [];
		for(var i = start; i<end; i+=jump){
			result.push(i);
		}
		return result;
	}
	function arrayClone(arr){
		if(isArray(arr)){
			return arr.map(arrayClone);
		}else{
			return arr;
		}
	}
	function arrayFlatten(arr){
		if(isArray(arr)){
			return arr.map(arrayFlatten).reduce(function(acc,val){
				for(var i = 0; i<val.length; i++){
					acc.push(val[i]);
				}
				return acc;
			},[]);
		}else{
			return [arr];
		}
	}
	function arrayDistinct(arr){
		var res = [];
		var set = {};
		for (var i = 0; i < arr.length; i++) {
			if(!set[arr[i]]){
				set[arr[i]] = true;
				res.push(arr[i]);
			}
		}
		return res;
	}
	function arrayRemove(arr, value){
		return arr.filter(function(v){
			return v != value;
		});
	}
	//Shim so browsers can still use this app.
	var isArray = (function(){
		if(typeof Array.isArray != "function"){
			return function(a){
				return typeof a != "undefined" && typeof a.length === "number" && 
					typeof a.map === "function" && typeof a.filter === "function" &&
					typeof a.some === "function";
			};
		}else{
			return Array.isArray;
		}
	}());
}(typeof exports === 'undefined'?this['sudoku']={}:exports));