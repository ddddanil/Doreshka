from app import app
from flask import render_template, request, redirect
from app.data import *

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
    jsdata = request.form
    contest = jsdata['cont']
    try:
        contest = int(contest)
        delete_contest(contest)
    except ValueError:
        delete_contest(contest)
    return '', 200

@app.route('/submit', methods = ['POST', 'HEAD'])
def get_submit():
    '''Recieves submitions'''
    jsdata = request.form
    return new_submission(int(jsdata['cont']), jsdata['name'], jsdata['task'])

@app.route('/submittable', methods = ['POST', 'HEAD'])
def get_table():
    '''Recieves new tables'''
    jsdata = request.get_json()
    if jsdata:
        add_contest(jsdata)
        return '', 200
    else:
        return '', 422
