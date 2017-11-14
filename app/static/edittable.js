var table;
var standing;
var edit = -1;
window.onload = function() {
    table = document.getElementById('the-table');
    standing = new tableClass();
    if(edit != -1)
	standing.initialize(edit.toString());
    setSidebar();
}

function submitClickHandler(row, col) // Функция которая подготавливает хендлеры для задач
{
    return function() {
	var rown = 0;
	for(; table.rows[rown].cells[0].innerHTML !== row; ++rown) ;
	var coln = 0;
	for(; table.rows[0].cells[coln].innerHTML !== col; ++coln) ;
	console.info("Person ", row, " Task ", col, " at ", rown, " : ", coln);
	rown--;
	coln--;
	if(standing.done[rown][coln] === 1)
	    standing.done[rown][coln] = 0;
	else
	    standing.done[rown][coln] = 1;
	this.className = "table-done" + standing.done[rown][coln];
    }
}

function nameClickHandler(num) // Функция делает хендлеры для удаления участников
{
    return function() {
	standing.delete_person(num);
    }
}

function taskClickHandler(num) // Функция делает хендлеры для удаления задач
{
    return function() {
	standing.delete_task(num);
    }
}

function create_cell(cell, text, style) // Заполняем новую ячейку как надо
{
    var text = document.createTextNode(text);
    cell.appendChild(text);
    cell.setAttribute('class', style);
    return cell;
}    

function tableClass()
{
    this.name = '';
    this.url = '';
    this.tasks = [];
    this.team = [];
    this.done = [];
    this.edit = -1;
    
    this.set_name = function() // Обновляем название
    {
	var new_name = document.forms['set_name']['cont_name'].value;
	var sub_button = document.forms['set_name']['set']
	if(new_name !== '')
	    this.name = new_name;
	if(standing.name !== '')
	    sub_button.className += " button-done";
    };
    
    this.set_url = function() // обновляем url. Можно еще сделать доп проверку доступности/валидности через requests.head
    {
	var new_url = document.forms['set_url']['cont_url'].value;
	var sub_button = document.forms['set_url']['set'];
	//    urlExistsButton(new_url, sub_button);  //
	if(new_url !== '')
	    standing.url = new_url;
	if(standing.url !== '')
	    sub_button.className += " button-done";
    };
    
    this.add_person = function() // Достраиваем новую строку
    {
	var pers_name = document.forms['add_person']['pers_name'].value;
	document.forms['add_person']['pers_name'].value = '';
	document.forms['add_person']['pers_name'].focus();     // Для удобности вводa
	if(pers_name === '')
	    return;
	var row = table.insertRow(table.rows.length);
	this.team.push(pers_name);
	this.done.push([])
	for (i = 0; i < table.rows[0].cells.length; i++) {
	    if(i === 0)
	    {
		var cur_cell = create_cell(row.insertCell(i), pers_name, 'table-name');
		cur_cell.onclick = nameClickHandler(pers_name);
	    }
	    else
	    {
		var cur_cell = create_cell(row.insertCell(i), '', 'table-done0');
		cur_cell.onclick = submitClickHandler(pers_name, table.rows[0].cells[i].innerHTML);
		this.done[standing.done.length - 1].push(0);
	    }
	}
    };
    
    this.delete_person = function(name)
    {
	document.forms['add_person']['pers_name'].focus();     // Для удобности вводa
	var number = 0;
	for(; table.rows[number].cells[0].innerHTML !== name; ++number) ;
	console.info("Delete Person: ", name, " number: ", number);
	table.deleteRow(number);
	var new_team = standing.team;
	var before_team = new_team.slice(0, number - 1);
	var after_team = new_team.slice(number, new_team.length)
	this.team = before_team.concat(after_team); // Жс не может нормально по индексу вырезать (((
	var new_done = standing.done;
	var before_done = new_done.slice(0, number - 1);
	var after_done = new_done.slice(number, new_done.length)
	this.done = before_done.concat(after_done);
    };
    
    this.delete_task = function(name)
    {
	document.forms['add_person']['pers_name'].focus();     // Для удобности вводa
	var number = 0;
	for(; table.rows[0].cells[number].innerHTML !== name; ++number) ;
	console.info("Delete Task: ", name, " number: ", number);
	var new_task = standing.tasks;
	var before_task = new_task.slice(0, number - 1);
	var after_task = new_task.slice(number, new_task.length)
	this.tasks = before_task.concat(after_task);
	var rows = table.rows;
	for(row = 0; row < rows.length; ++row)
	{
	    rows[row].deleteCell(number);
	    if(row !== 0)
	    {
		var new_done_row = this.done[row - 1];
		var before_done = new_done_row.slice(0, number - 1);
		var after_done = new_done_row.slice(number, new_done_row.length)
		this.done[row - 1] = before_done.concat(after_done);
	    }
	}
    };
    
    this.add_task = function() // вставляем ячейку в каждую строку (беееееее)
    {
	var task_name = document.forms['add_task']['task_name'].value;
	document.forms['add_task']['task_name'].value = '';
	document.forms['add_task']['task_name'].focus();  // Для удобности ввода
	if(task_name === '')
	    return;
	this.tasks.push(task_name);
	for (i = 0; i < table.rows.length; i++) {
	    var cur_row = table.rows[i];
	    if(i === 0)
	    {
		var cur_cell = create_cell(cur_row.insertCell(cur_row.cells.length), task_name, 'table-task');
		cur_cell.onclick = taskClickHandler(task_name);
	    }
	    else
	    {
		var cur_cell = create_cell(table.rows[i].insertCell(table.rows[i].cells.length), '', 'table-done0');
		cur_cell.onclick = submitClickHandler(table.rows[i].cells[0].innerHTML, task_name);
		this.done[i - 1].push(0);
	    }
	}
    };

    this.initialize = function(number)
    {
	function init(servtable, standing)
	{
	    standing.name = servtable.name;
	    standing.url = servtable.url;
	    standing.tasks = servtable.tasks;
	    standing.team = servtable.team;
	    standing.done = servtable.done;
	    standing.edit = number;
	    document.forms['set_name']['cont_name'].value = standing.name;
	    document.forms['set_url']['cont_url'].value = standing.url;
	    document.forms['set_name']['set'].className += " button-done";
	    document.forms['set_url']['set'].className += " button-done";
	    for(person = 0; person <= standing.team.length; person++) // every row
	    {
		if(person === 0)  // task row
		{
		    //		var fir_cell = create_cell(cur_row.insertCell(cur_row.cells.length), '', '');  // origin cell (not needed)
		    var cur_row = table.rows[0];
		    for(task = 0; task < standing.tasks.length; ++task)
		    {
			var cur_cell = create_cell(cur_row.insertCell(cur_row.cells.lenght), standing.tasks[task], 'table-task');
			cur_cell.onclick = taskClickHandler(standing.tasks[task]);
		    }
		}
		else  // person row
		{
		    var cur_row = table.insertRow(table.rows.length);
		    var fir_cell = create_cell(cur_row.insertCell(cur_row.cells.length), standing.team[person - 1], 'table-name');  //  Name cell
		    fir_cell.onclick = nameClickHandler(standing.team[person - 1]);
		    for(task = 0; task < standing.done[person - 1].length; ++task) // completed tasks
		    {
			var cur_cell = create_cell(cur_row.insertCell(cur_row.cells.length), '', 'table-done' + standing.done[person - 1][task]);
			cur_cell.onclick = submitClickHandler(standing.team[person - 1], standing.tasks[task]);
		    }
		}
	    }
	}
	$.ajax({
	    type: 'POST',
	    url: '/gettable',
	    contentType: 'application/json; charset=utf-8',
	    dataType: 'json',
	    data: '{"table": ' + number + '}',
	    success: function(data, status, xhr) {
		console.log(data, "->", standing);
		init(data, standing);
	    },
	    error: post_error
	});
    };
    
    this.submit = function() // проверяем (говняно) и отправляем (тоже говняно) таблицу
    {
	if(this.name === '' || this.url === '' || this.team.length !== this.done.length || this.tasks.length !== this.done[0].length)
	{
	    alert("Invalid table");
	    return;
	}
	/*var post_team = [] // Даня забыл структуру сохраненного контеста, 
	for(i = 0; i < standing.team.length; ++i)  // лень было переписывать сверху, поэтому 
	    post_team.push({name: standing.team[i], done: standing.done[i]}); 
	var post_obj = { // переделываем обьект перед отправкой
	    name: standing.name, // Даня оборался. Кузнецов(с)
	    url: standing.url,
	    tasks: standing.tasks,
	    team: post_team
	}
	var stringified = JSON.stringify(post_obj);*/
	var stringified = JSON.stringify(this);
	$.ajax({ // Обычный $.post() не катит (((  (говно какое то у него)
	    type: 'POST',
	    url: '/submittable',
	    contentType: 'application/json; charset=utf-8',
	    dataType: 'json',
	    data: stringified,
	    success: function(data, status, xhr) {
		console.log("Success!!! ", status);
		window.location.replace("/index");
		window.loaction.reload(true)
	    },
	    complete: function(xhr, status) {
		console.log("Complete ", status);
	    },
	    error: post_error
	});
    };
}
