import json

def add_contest(new_data):
    '''
    Эта функция записывает новый контест в конец data.json
    new_data : словарь со значениями контеста
    '''
    with open("app/data.json", "r") as f:
        raw_data = f.read();
    data = json.loads(raw_data)
#    new_data_enc = json.loads(new_data)
    data.append(new_data)
    new_raw_data = json.dumps(data)
    with open("app/data.json", "w") as f:
        f.write(new_raw_data)        

def delete_contest(cont):
    '''
    Эта функция удаляет контест из data.json по идентификатору cont
    cont : str - название контеста
           int - номер контеста
    '''
    with open("app/data.json", "r") as f:
        raw_data = f.read();
    data = json.loads(raw_data)
    if type(cont) == int:    # Попа работает по индексу - классно
        data.pop(cont)
    else:
        data = [d for d in data if d['name'] != cont]  # А это из-за магии питона работает не медленно
    new_raw_data = json.dumps(data)
    with open("app/data.json", "w") as f:
        f.write(new_raw_data)

def new_submission(cont, name, task):
    '''
    Эта функция обновляет задачу как дорешивание.
    cont : номер контеста по порядку. Основывается на том что браузер получил список контестов в том же порядке (возможна бага)
    name : имя сдающего. Неналичие данного в data.json -> contest ведет в никуда (возможна бага)
    task : название сданного таска. Опять же не проверяется. (возможно бага)
    '''
    with open("app/data.json", "r") as f:
        raw_data = f.read();
    data = json.loads(raw_data)
#    print(data)
    contest = data[cont]
    taskno = 0
    response = 0
    for ctask in contest['tasks']:   # Таск имеет название, но номер мы не храним
        if ctask is task: break
        taskno += 1
    for person in contest['team']:
        if person['name'] == name:
            if person['done'][taskno] is 0:  # меняем решил/дорешал, "начальное" решение не трогаем
                person['done'][taskno] = 2
                response = 2
            elif person['done'][taskno] is 2:
                person['done'][taskno] = 0
                response = 0
            else:
                response = 1
            break
    new_raw_data = json.dumps(data)
    with open("app/data.json", "w") as f:
        f.write(new_raw_data)
    return str(response)

def get_data():
    '''
    Эта функция отдает распарсенный data.json
    '''
    with open("app/data.json", "r") as f:
        raw_data = f.read();
        data = json.loads(raw_data)
        return data
