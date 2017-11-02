from app import app
from flask import render_template, request, redirect, make_response
from app.data import *
from hashlib import sha1

def getLinks():
    '''
    Карта сайта для навигации. Не забывать обновлять.
    '''
    return [
        {'name': 'Index', 'url': '/index', 'active': False},
        {'name': 'Add Contest', 'url': '/addtable', 'active': False},
        {'name': 'Manual', 'url': '/manual', 'active': False}
    ]
    
def setActive(active):
    '''
    Отдает карту с помеченой активной ссылкойю
    active : название ссылки которую надо пометить.
    '''
    links = getLinks()
    for link in links:
        if link['name'] == active:
            link['active'] = True
            break
    return links

def password():
    passwd = 'binbashrules'
    hashpswd = sha1(passwd.encode('utf-8')).hexdigest()
    return hashpswd

@app.route('/')
@app.route('/index')
@app.route('/index.html')
def index():
    '''Renders index page'''
    contests = get_data()
    return render_template("index.html", data = contests, navigation = setActive('Index'))

@app.route('/manual')
@app.route('/manual.html')
def manual():
    '''Renders page for manual'''
    return render_template("manual.html", navigation = setActive('Manual'))

@app.route('/addtable')
@app.route('/addtable.html')
def addTable():
    '''Renders add_table page'''
    return render_template("add_table.html", navigation = setActive('Add Contest'));

@app.route('/deletetable', methods = ['POST', 'HEAD'])
def delete_table():
    '''Deletes contest'''
    passwd = request.cookies.get('Access')   # Надо бы сделать проверку поизящнее, а то в каждой функции проверяю
    if not passwd or passwd != password():  # сикурити
        return '{"Access": "denied"}', 403
    jsdata = request.form
    contest = jsdata['cont']
    try:
        contest = int(contest)  # можешь итн - делай
        delete_contest(contest)
    except ValueError:
        delete_contest(contest)  # не можешь - и стринг норм
    return '', 200

@app.route('/submit', methods = ['POST', 'HEAD'])
def get_submit():
    '''Recieves submitions'''
    passwd = request.cookies.get('Access')   # Надо бы сделать проверку поизящнее, а то в каждой функции проверяю
    if not passwd or passwd != password():  # сикурити
        return '{"Access": "denied"}', 403
    jsdata = request.form
    return new_submission(int(jsdata['cont']), jsdata['name'], jsdata['task'])

@app.route('/submittable', methods = ['POST', 'HEAD'])
def get_table():
    '''Recieves new tables'''
    passwd = request.cookies.get('Access')   # Надо бы сделать проверку поизящнее, а то в каждой функции проверяю
    if not passwd or passwd != password():  # сикурити
        return '{"Access": "denied"}', 403
    jsdata = request.get_json()
    if jsdata:
        add_contest(jsdata)
        return '{"done": 1}', 200
    else:
        return '{"done": 0}', 422

@app.route('/getpass', methods = ['POST', 'HEAD'])
def get_pass():
    '''Checks a password to give change access'''
    jsdata = request.form
    response = make_response('{"done":1}', 200)
    passwd = jsdata['password']
    hashpswd = sha1(passwd.encode('utf-8')).hexdigest()
    response.set_cookie('Access', hashpswd)
    return response
