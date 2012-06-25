# SUDU

SUDU is a library for sudoku solving in either the browser, or node.js (available on npm).

## Puzzle Format

A sudoku style puzzle is one that contains cells which must take values from an alphabet, and where certain groups of cells must contain distinct values.  There are many such puzzles (Sudoku, Killer Sudoku etc.) and although the example app only solves the garden variety normal sudoku, the code could easilly be extended to solve other puzzles.

Puzzles are therefore input as an array of the correct length, it is up to you to map this onto a grid.  The default solver simply numbers each cell from top left to bottom right starting at 0.  Unknown cells are represented by a null value.

## Solving normal sudoku

```
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