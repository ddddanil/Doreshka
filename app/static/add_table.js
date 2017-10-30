var standing = { // текущее состояние таблицы
    name: '',
    url: '',
    tasks: [],
    team: [],
    done: []
}

var ClickHandler = function(row, col, cell) { // Функция которая подготавливает хендлеры
    return function() {
	if(standing.done[row][col] === 1)
	    standing.done[row][col] = 0;
	else
	    standing.done[row][col] = 1;
	cell.className = "table-done" + standing.done[row][col]; // можно передачу cell заменить на this
    }
}

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
    if(new_url !== '')
	standing.url = new_url;
    if(standing.url !== '')
	sub_button.className = "button-done";
}

function add_new_person() // Достраиваем новую строку
{
    var table = document.getElementById('the-table');
    var pers_name = document.forms['add_person']['pers_name'].value;
    document.forms['add_person']['pers_name'].value = '';
    document.forms['add_person']['pers_name'].focus();     // Для удобности ввод
    if(pers_name === '')
	return;
    var row = table.insertRow(table.rows.length);
    standing.team.push(pers_name);
    standing.done.push([])
    for (i = 0; i < table.rows[0].cells.length; i++) {
	if(i === 0)
	    create_cell(row.insertCell(i), pers_name, 'table-name');
	else
	{
            create_cell(row.insertCell(i), '', 'table-done0');
	    var cur_cell = row.cells[row.cells.length - 1];
	    cur_cell.onclick = ClickHandler(table.rows.length - 2, i - 1, cur_cell);
	    standing.done[standing.done.length - 1].push(0);
	}
    }
}
а
function add_new_task() // вставляем ячейку в каждую строку (беееееее)
{
    var table = document.getElementById('the-table');
    var task_name = document.forms['add_task']['task_name'].value;
    document.forms['add_task']['task_name'].value = '';
    document.forms['add_task']['task_name'].focus();  // Для удобности ввода
    if(task_name === '')
	return;
    standing.tasks.push(task_name);
    for (i = 0; i < table.rows.length; i++) {
	var cur_row = table.rows[i];
	if(i === 0)
	    create_cell(cur_row.insertCell(cur_row.cells.length), task_name, 'table-task');
	else
	{
            create_cell(table.rows[i].insertCell(table.rows[i].cells.length), '', 'table-done0');
	    var cur_cell = cur_row.cells[cur_row.cells.length - 1];
	    cur_cell.onclick = ClickHandler(i - 1, cur_row.cells.length - 2, cur_cell);
	    standing.done[i - 1].push(0);
	}
    }
}
 
function create_cell(cell, text, style) // Заполняем новую ячейку как надо
{
    var text = document.createTextNode(text);
    cell.appendChild(text);
    cell.setAttribute('class', style);
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
	    window.location.href = "/index";
	}
    });
}
