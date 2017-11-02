function addTableHandlers() // Просто бегаем по всем таблицам вешаем клик хендлеры
{
    var tables = document.getElementsByClassName("standings");
    for(table = 0; table < tables.length; ++table)
    {
//	console.log("At table ", table, tables[table]);
	var rows = tables[table].rows;
	var tasks = rows[0].cells;
//	console.log("tasks: ", tasks);
	for(row = 1; row < rows.length; ++row)
	{
//	    console.log("  At row ", row, rows[row]);
	    var cells = rows[row].cells;
	    var name = cells[0].innerHTML;
	    for(cell = 1; cell < cells.length; ++cell)
	    {
//		console.log("      At cell ", cell, cells[cell]);
		var cur_cell = cells[cell];
		var task = tasks[cell].innerHTML;
		var ClickHandler = function(table, task, name) { return function() {
		    cur_data = {cont: table, task: task, name: name};
		    //$.post("/submit", {data: cur_data});
		    //		    console.log(cur_data);
		    cur_cell = this;
		    var success = function(data) {
			cur_cell.className = "table-done" + data;
		    }
		    $.post("/submit", cur_data, success)
			.fail(post_error);
		}}
		cur_cell.onclick = ClickHandler(table, task, name);
	    }
	}
    }
}

function delete_table(number) // Удалить контест
{
    var suc = function() {
	window.location.reload(true);
    }
    if(confirm("Delete Contest?"))  // Спросить - обязательно
    {
	$.post("/deletetable", {cont: number - 1}, suc)  // jinja считает форики с 1 (((
	    .fail(post_error);
    }
}

function onLoad()
{
    addTableHandlers();
    setSidebar();
}

window.onload = onLoad; // Запускаем после загрузки (дубируется в html)
