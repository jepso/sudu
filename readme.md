# SUDU

SUDU is a library for sudoku solving in either the browser, or node.js (available on npm).

## Puzzle Format

A sudoku style puzzle is one that contains cells which must take values from an alphabet, and where certain groups of cells must contain distinct values.  There are many such puzzles (Sudoku, Killer Sudoku etc.) and although the example app only solves the garden variety normal sudoku, the code could easilly be extended to solve other puzzles.

Puzzles are therefore input as an array of the correct length, it is up to you to map this onto a grid.  The default solver simply numbers each cell from top left to bottom right starting at 0.  Unknown cells are represented by a null value.

## Solving normal sudoku

```javascript
//Obtain an empty sudoku puzzle array
var puzzle = sudu.getEmpty();

//Set any known cells
puzzle[0] = '3';//top left cell is 3

//Get the problem type definition
var problemType = sudoku.problemType();

//Get the solution
var solution = problemType.solve(puzzle);

if(solution !== false){
	//puzzle was successfully solved.

	//Output result
	console.log(sudu.formatSudoku(solution));
	//or read individual cells
	console.log(puzzle[1]);//cell one in from top left.
}else{
	console.log("There is no solution to this puzzle.""
}
```

If the problem can't be solved, we get false back.  We get back a solution, but no guarantee that it is a unique solution.  There may be a new major version at some point, which could change this behaviour to return the set of possible solutions in the event that there are many.

**Warning** The formatSudoku method is part of the development api, it is subject to change without warning and should not be used in produciton environments.

## Solving other sudoku types

The problemType method can take 3 optional arguments.  Any you wish to leave as their defaults, you should pass false to.  The parameters are as follows.

 * @param {array}  [alphabet] defaults to [1,2,3,4,5,6,7,8,9] and represents the set of allowed symbols.
 * @param {number} [length]   defaults to 9x9 and represents the number of cells in the puzzle.
 * @param {array}  [groups]   the groups that must have distinct values, defaults to correct values for sudoku.

The groups parameter takes an array of arrays of cell numbers.

You can use getDefaultAlphabet, getDefaultLength and getDefaultGroups respectively to get the defaults for alphabet, length and groups.  These are functions and return copies of the defaults, which makes it safe to modify the copy you obtain without changing the standard behaviour of SUDU.  That is extremely useful if you want to make small modifications to the defaults.  Consider the following example for creating a puzzle type where the diagonals of a sudoku board must also be distinct.

```javascript
//Adding diagonals as well
var groups = sudoku.getDefaultGroups();
groups.push([0,10,20,30,40,50,60,70,80]);
groups.push([8,16,24,32,40,48,56,64,72]);
var solver = sodoku.problemType(false, false, groups);
```