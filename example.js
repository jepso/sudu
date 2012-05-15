(function(){
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
			buf.push('<input id="' + (n++) + '" type="number" class="digit" />');
			buf.push('</td>');
		};
		buf.push('</tr>');
	};
	buf.push('</table>');
	document.getElementById('inputTable').innerHTML = buf.join("");
	var solved = false;
	$('#btnSolve').click(function(){
		if(solved){
			alert('you must reset or clear before solving again');
			return;
		}
		var puzzle = sudoku.getEmpty();
		for(var i = 0; i<puzzle.length;i++){
			var val = $('#'+i).val();
			var done = false;
			for (var x = 0; !done && x < sudoku.getDefaultAlphabet().length; x++) {
				if(sudoku.getDefaultAlphabet()[x] == val){
					puzzle[i] = sudoku.getDefaultAlphabet()[x];
					done = true;
				}
			};
			if(!done){
				$('#'+i).val("").removeClass("original").addClass("new");
			}else{
				$('#'+i).removeClass("new").addClass("original");
			}
		}
		var solution = sudoku.problemType().solve(puzzle);
		if(solution){
			solved = true;
			for(var i = 0; i<solution.length;i++){
				$('#'+i).val(solution[i]);
			}
		}else{
			alert('Could not find solution');
		}
	});
	$('#btnReset').click(function(){
		solved = false;
		$('.new').val('').removeClass('new');
		$('.original').removeClass('original');
	});
	$('#btnClear').click(function(){
		if(confirm('This will remove any values you have entered.')){
			solved = false;
			$('.new').val('').removeClass('new');
			$('.original').val('').removeClass('original');
			$('.digit').val('');
		}
	});
}());