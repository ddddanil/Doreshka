# -*- coding: utf-8 -*-
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
    teamcnt = 0
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
            teamcnt = len(table['team'])
            for person in table['team']:
                if type(person) == str:
                    if not person:
                        bteam = False
                        break
                else:
                    bteam = False
                    break
    if 'done' in table.keys():
        if type(table['done']) == list:
            if len(table['done']) == teamcnt:
                for person in table['done']:
                    if type(person) == list:
                        if len(person) == taskcnt:
                            for ts in person:
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
        else:
            bteam = False
    else:
        bteam = False
    ans = burl and bname and btask and bteam
    return ans
            

def add_contest(new_data):
    '''
    Эта функция записывает новый контест в конец data.json
    new_data : словарь со значениями контеста
               в нем (int) edit означает создать новый (-1)
               или обновить старый (по id)
    '''
    data = loadData()
#    new_data_enc = json.loads(new_data)
    if check_table(new_data):
        edit = new_data['edit']
#        print("Ask for", type(edit), edit)
        new_data['id'] = str(new_data.pop("edit"))
        if edit == -1:
#            print("New", len(data))
            maxid = 0
            for cont in data:
#                print("at", cont['id'])
                if int(cont['id']) > maxid:
#                    print(int(cont['id']), ">", maxid)
                    maxid = int(cont['id'])
            new_id = maxid + 1
#            print("Max", maxid, "new id", new_id)
            new_data['id'] = str(new_id)
            data.append(new_data)
        else:
#            print("Update")
            change = 0
            for cont in range(len(data)):
                if data[cont]['id'] == str(edit):
#                    print("No", cont, "id", data[cont]['id'])
                    change = cont
                    break
            data[change] = new_data
            
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
#    print("Find", cont, name, task)
    contno = -1
    for i in range(len(data)):
#        print("Cmp", data[i]['id'], type(data[i]['id']), cont, type(cont))
        if data[i]['id'] == cont:
#            print("Found cont on", i)
            contno = i
            break
    if contno == -1: return
#    print("Fount cont", data[contno])
#    print("Find", name, "in", data[contno]['team'])
    bname = name in data[contno]['team']
    if not bname: return
#    print("Found name")
    btask = task in data[contno]['tasks']
    if not btask: return
#    print("Found task")
    contest = data[contno]
    taskno = 0
    persno = 0
    response = 0
    for ctask in contest['tasks']:   # Таск имеет название, но номер мы не храним
        if ctask == task: break
        taskno += 1
    for person in contest['team']:
        if person == name: break
        persno += 1
#    print("Noms", persno, taskno)
    if contest['done'][persno][taskno] is 0:  # меняем решил/дорешал, "начальное" решение не трогаем
        contest['done'][persno][taskno] = 2
        response = 2
    elif contest['done'][persno][taskno] is 2:
        contest['done'][persno][taskno] = 0
        response = 0
    else:
        response = 1
    data[contno] = contest
    writeData(data)
    return str(response)

def get_data(table):
    '''
    Эта функция отдает распарсенный data.json
        Если table = None то весь
        Иначе таблицу с данным id
    '''
    if table is None:
        return loadData()
    else:
        data = loadData()
        for cont in data:
            if int(cont['id']) == int(table):
                ans = cont
                break
        else:
            return
        return json.dumps(ans)
