import json

def loadData():
    with open("app/data.json", "r") as f:
        raw_data = f.read();
    return json.loads(raw_data)

def writeData(data):
    raw_data = json.dumps(data)
    with open("app/data.json", "w") as f:
        f.write(raw_data)

def check_table(table):  # Проверяю таблицу аккуратно и ЗВЕРСКИ
    burl = False
    bname = False
    bteam = True
    btask = False
    taskcnt = 0
    if 'url' in table.keys():
        burl = table['url'] != ''
    if 'name' in table.keys():
        bname = table['name'] != ''
    if 'tasks' in table.keys():
        if type(table['tasks']) == list:
            btask = True
            taskcnt = len(table['tasks'])
    if 'team' in table.keys():
        if type(table['team']) == list:
            for person in table['team']:
                if type(person) == dict:
                    if 'name' in person.keys():
                        if not person['name']:
                            bteam = False
                            break
                    else:
                        bteam = False
                        break
                    if 'done' in person.keys():
                        if type(person['done']) == list:
                            if len(person['done']) == taskcnt:
                                for ts in person['done']:
                                    if type(ts) == int:
                                        if ts >= 0 and ts < 3:
                                            bteam = True
                                        else:
                                            bteam = False
                                            break
                                    else:
                                        bteam = False
                                        break
                            else:
                                bteam = False
                                break
                        else:
                            bteam = False
                            break
                    else:
                        bteam = False
                        break
                else:
                    bteam = False
                    break
    ans = burl and bname and btask and bteam
    return ans
            

def add_contest(new_data):
    '''
    Эта функция записывает новый контест в конец data.json
    new_data : словарь со значениями контеста
    '''
    data = loadData()
#    new_data_enc = json.loads(new_data)
    if check_table(new_data):
        data.append(new_data)
        writeData(data)    

def delete_contest(cont):
    '''
    Эта функция удаляет контест из data.json по идентификатору cont
    cont : str - название контеста
           int - номер контеста
    '''
    data = loadData()
    if type(cont) == int:    # Попа работает по индексу - классно
        data.pop(cont)
    else:
        data = [d for d in data if d['name'] != cont]  # А это из-за магии питона работает не медленно
    writeData(data)

def new_submission(cont, name, task):
    '''
    Эта функция обновляет задачу как дорешивание.
    cont : номер контеста по порядку. Основывается на том что браузер получил список контестов в том же порядке (возможна бага)
    name : имя сдающего.
    task : название сданного таска.
    '''
    data = loadData()
    bcont = cont < len(data)
    if not bcont: return
    bname = len([d for d in data[cont]['team'] if d['name'] == name])
    if not bname: return
    btask = task in data[cont]['tasks']
    if not btask: return
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
    writeData(data)
    return str(response)

def get_data():
    '''
    Эта функция отдает распарсенный data.json
    '''
    return loadData()
