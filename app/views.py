from app import app
from flask import render_template, request, redirect
from app.data import *

def getLinks():
    return [
        {'name': 'Index', 'url': '/index', 'active': False},
        {'name': 'Add Contest', 'url': '/addtable', 'active': False},
        {'name': 'Manual', 'url': '/manual', 'active': False}
    ]
    
def setActive(active):
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
    contests = get_data()
    return render_template("index.html", data = contests, navigation = setActive('Index'))

@app.route('/manual')
@app.route('/manual.html')
def manual():
    return render_template("manual.html", navigation = setActive('Manual'))

@app.route('/addtable')
@app.route('/addtable.html')
def addTable():
    return render_template("add_table.html", navigation = setActive('Add Contest'));

@app.route('/submit', methods = ['POST'])
def get_submit():
    jsdata = request.form
    return new_submission(int(jsdata['cont']), jsdata['name'], jsdata['task'])

@app.route('/submittable', methods = ['POST'])
def get_table():
    jsdata = request.get_json()
    if jsdata:
        add_contest(jsdata)
        return '', 200
    else:
        return '', 422
