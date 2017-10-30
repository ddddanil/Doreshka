
function addTableHandlers() // Просто бегаем по всем таблицам вешаем клик хендлеры
{
    var tables = document.getElementsByClassName("standings");
    for(table = 0; table < tables.length; ++table)
    {
//	console.log("At table ", table, tables[table]);
	var rows = tables[table].getElementsByTagName("tr");
	var tasks = rows[0].getElementsByTagName("th");
//	console.log("tasks: ", tasks);
	for(row = 1; row < rows.length; ++row)
	{
//	    console.log("  At row ", row, rows[row]);
	    var cells = rows[row].getElementsByTagName("th");
	    var name = cells[0].innerHTML;
	    for(cell = 1; cell < cells.length; ++cell)
	    {
//		console.log("      At cell ", cell, cells[cell]);
		var cur_cell = cells[cell];
		var task = tasks[cell].innerHTML;
		var ClickHandler = function(table, task, name, cell) { return function() {
		    cur_data = {cont: table, task: task, name: name};
		    //$.post("/submit", {data: cur_data});
		    //		    console.log(cur_data);
		    var success = function(data) {
			cell.className = "table-done" + data;
		    }
		    $.post("/submit", cur_data, success);
		}}
		cur_cell.onclick = ClickHandler(table, task, name, cur_cell);
	    }
	}
    }
}

window.onload = addTableHandlers; // Запускаем после загрузки (дубируется в html)
