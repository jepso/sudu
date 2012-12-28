(function(){
	var inputTable = document.getElementById('inputTable');
	var btnSolve = document.getElementById('btnSolve');
	var btnReset = document.getElementById('btnReset');
	var btnClear = document.getElementById('btnClear');
	function render(fn) {
		var buf = ["<table>"];
		var n = 0;
		for (var i = 0; i < 9; i++) {
			if(i/3 === parseInt(i/3)) buf.push('<tr class="row-divider">');
			else if (i === 8) buf.push('<tr class="row-end">');
			else buf.push('<tr>');
			for (var x = 0; x < 9; x++) {
				if(x/3 === parseInt(x/3)) buf.push('<td class="column-divider">');
				else if (x === 8) buf.push('<td class="column-end">');
				else buf.push('<td>');
				buf.push(fn(n++));
				buf.push('</td>');
			};
			buf.push('</tr>');
		};
		buf.push('</table>');
		inputTable.innerHTML = buf.join("");
	}
	render(function (n) {
		return '<input id="' + n + '" type="text" pattern="[0-9]*" class="digit" />'
	});

	var puzzle;
	function solve() {
		puzzle = getPuzzle();
		var solution = sudoku.problemType().solve(puzzle);
		if (solution) {
			btnSolve.setAttribute('disabled');
			btnReset.removeAttribute('disabled');
			render(function (n) {
				return '<div class="digit ' + (puzzle[n] ? 'original' : 'new') +'">' + solution[n] + '</div>';
			});
		} else {
			alert('Could not find solution');
		}
	}
	function reset() {
		btnSolve.removeAttribute('disabled');
		btnReset.setAttribute('disabled');
		render(function (n) {
			return '<input id="' + n + '" type="text" pattern="[0-9]*" class="digit" value="' + (puzzle[n] || '') + '" />'
		});
	}
	function clear() {
		btnSolve.removeAttribute('disabled');
		btnReset.setAttribute('disabled');
		render(function (n) {
			return '<input id="' + n + '" type="text" pattern="[0-9]*" class="digit" />'
		});
	}

	function getPuzzle() {
		var puzzle = sudoku.getEmpty();
		for (var i = 0; i<puzzle.length;i++) {
			var val = document.getElementById(i).value;
			if (+val < 10 && +val > 0) {
				puzzle[i] = +val;
			}
		}
		return puzzle;
	}
	function attach(el, handler) {
		el.addEventListener('click', handler, false);
	}
	attach(btnSolve, solve);
	attach(btnReset, reset);
	attach(btnClear, clear);
}());