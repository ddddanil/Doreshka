var standing = { // текущее состояние таблицы
    name: '',
    url: '',
    tasks: [],
    team: [],
    done: []
}

var table
window.onload = function() {
    table = document.getElementById('the-table');
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
	delete_person(num);
    }
}

function taskClickHandler(num) // Функция делает хендлеры для удаления задач
{
    return function() {
	delete_task(num);
    }
}

/*
function urlExistsButton(url, button)
{
    $.ajax({
	type: "HEAD",
	url: url,
	success: function() {
	    button.className = "button-done";
	},
	error: function() {
	    button.className = "button-fail";
	}
    });
}
*/

function set_new_name() // Обновляем название
{
    var new_name = document.forms['set_name']['cont_name'].value;
    var sub_button = document.forms['set_name']['set']
    if(new_name !== '')
	standing.name = new_name;
    if(standing.name !== '')
	sub_button.className = "button-done";
}

function set_new_url() // обновляем url. Можно еще сделать доп проверку доступности/валидности через requests.head
{
    var new_url = document.forms['set_url']['cont_url'].value;
    var sub_button = document.forms['set_url']['set'];
    //    urlExistsButton(new_url, sub_button);  //
    if(new_url !== '')
	standing.url = new_url;
    if(standing.url !== '')
	sub_button.className = "button-done";
}

function add_new_person() // Достраиваем новую строку
{
    var pers_name = document.forms['add_person']['pers_name'].value;
    document.forms['add_person']['pers_name'].value = '';
    document.forms['add_person']['pers_name'].focus();     // Для удобности вводa
    if(pers_name === '')
	return;
    var row = table.insertRow(table.rows.length);
    standing.team.push(pers_name);
    standing.done.push([])
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
	    standing.done[standing.done.length - 1].push(0);
	}
    }
}

function delete_person(name)
{
    document.forms['add_person']['pers_name'].focus();     // Для удобности вводa
    var number = 0;
    for(; table.rows[number].cells[0].innerHTML !== name; ++number) ;
    console.info("Delete Person: ", name, " number: ", number);
    table.deleteRow(number);
    var new_team = standing.team;
    var before_team = new_team.slice(0, number - 1);
    var after_team = new_team.slice(number, new_team.length)
    standing.team = before_team.concat(after_team); // Жс не может нормально по индексу вырезать (((
    var new_done = standing.done;
    var before_done = new_done.slice(0, number - 1);
    var after_done = new_done.slice(number, new_done.length)
    standing.done = before_done.concat(after_done);
}

function delete_task(name)
{
    document.forms['add_person']['pers_name'].focus();     // Для удобности вводa
    var number = 0;
    for(; table.rows[0].cells[number].innerHTML !== name; ++number) ;
    console.info("Delete Task: ", name, " number: ", number);
    var new_task = standing.tasks;
    var before_task = new_task.slice(0, number - 1);
    var after_task = new_task.slice(number, new_task.length)
    standing.tasks = before_task.concat(after_task);    var rows = table.rows;
    for(row = 0; row < rows.length; ++row)
    {
	rows[row].deleteCell(number);
	if(row !== 0)
	{
	    var new_done_row = standing.done[row - 1];
	    var before_done = new_done_row.slice(0, number - 1);
	    var after_done = new_done_row.slice(number, new_done_row.length)
	    standing.done[row - 1] = before_done.concat(after_done);
	}
    }
}

function add_new_task() // вставляем ячейку в каждую строку (беееееее)
{
    var task_name = document.forms['add_task']['task_name'].value;
    document.forms['add_task']['task_name'].value = '';
    document.forms['add_task']['task_name'].focus();  // Для удобности ввода
    if(task_name === '')
	return;
    standing.tasks.push(task_name);
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
	    standing.done[i - 1].push(0);
	}
    }
}
 
function create_cell(cell, text, style) // Заполняем новую ячейку как надо
{
    var text = document.createTextNode(text);
    cell.appendChild(text);
    cell.setAttribute('class', style);
    return cell;
}

function submit_table_post() // проверяем (говняно) и отправляем (тоже говняно) таблицу
{
    if(standing.name === '' || standing.url === '' || standing.team.length !== standing.done.length || standing.tasks.length !== standing.done[0].length)
    {
	alert("Invalid table");
	return;
    }
    var post_team = [] // Даня забыл структуру сохраненного контеста, 
    for(i = 0; i < standing.team.length; ++i)  // лень было переписывать сверху, поэтому 
	post_team.push({name: standing.team[i], done: standing.done[i]}); 
    var post_obj = { // переделываем обьект перед отправкой
	name: standing.name, // Даня оборался. Кузнецов(с)
	url: standing.url,
	tasks: standing.tasks,
	team: post_team
    }
    var stringified = JSON.stringify(post_obj);
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
	error: function(xhr, status, error) {
	    console.log("Error ( ", status, "  ", error);
	}
    });
}
