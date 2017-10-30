import json

def add_contest(new_data):
    with open("app/data.json", "r") as f:
        raw_data = f.read();
    data = json.loads(raw_data)
#    new_data_enc = json.loads(new_data)
    data.append(new_data)
    new_raw_data = json.dumps(data)
    with open("app/data.json", "w") as f:
        f.write(new_raw_data)        

def new_submission(cont, name, task):
    with open("app/data.json", "r") as f:
        raw_data = f.read();
    data = json.loads(raw_data)
#    print(data)
    contest = data[cont]
    taskno = 0
    response = 0
    for ctask in contest['tasks']:
        if ctask is task: break
        taskno += 1
    for person in contest['team']:
        if person['name'] == name:
            if person['done'][taskno] is 0:
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
    with open("app/data.json", "r") as f:
        raw_data = f.read();
        data = json.loads(raw_data)
        return data
