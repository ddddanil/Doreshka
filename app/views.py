# -*- coding: utf-8 -*-
from app import app
from flask import render_template, request, redirect, make_response
from functools import wraps
from hashlib import sha1
from app.data import *
from app.security import get_password

def get_links():
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
             ничего не выделяет если None
    '''
    links = get_links()
    if active != None:
        for link in links:
            if link['name'] == active:
                link['active'] = True
                break
    return links

def require_pass(func): # можно использовать как декоратор к любой view функции
    @wraps(func)  #  официально магия
    def new_function(*args, **kwargs):
        passwd = request.cookies.get('Access')
        if not passwd or passwd != get_password():  # сикурити
            if request.method == 'POST':
                return '{"Access": "denied"}', 403
            else:
                return render_template("403error.html")
        return func(*args, **kwargs)
    return new_function

@app.route('/')
@app.route('/index')
def index():
    '''Renders index page'''
    contests = get_data(None)
    return render_template("index.html", data = contests, navigation = setActive('Index'))

@app.route('/manual')
def manual():
    '''Renders page for manual'''
    return render_template("manual.html", navigation = setActive('Manual'))

@app.route('/addtable')
def addTable():
    '''Renders edit table page with empty table'''
    return render_template("edittable.html", navigation = setActive('Add Contest'), edit_table = -1);

@app.route('/deletetable', methods = ['POST', 'HEAD'])
@require_pass
def delete_table():
    '''Deletes contest'''
    jsdata = request.form
    contest = jsdata['cont']
    try:
        contest = int(contest)  # можешь инт - делай
        delete_contest(contest)
    except ValueError:
        delete_contest(contest)  # не можешь - и стринг норм
    return '', 200

@app.route('/edit')
def edit_page():
    '''Renders edit table page with initialized table'''
    edittable = request.args['id']
    return render_template("edittable.html", navigation = setActive(None), edit_table = edittable)

@app.route('/submit', methods = ['POST', 'HEAD'])
@require_pass
def get_submit():
    '''Recieves submitions'''
    jsdata = request.form
    resp = new_submission(jsdata['cont'], jsdata['name'], jsdata['task'])
    if not resp:
        return '{"done": 0}', 422
    else:
        return resp

@app.route('/submittable', methods = ['POST', 'HEAD'])
@require_pass
def submit_table():
    '''Recieves new tables'''
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

@app.route('/gettable', methods = ['POST', 'HEAD'])
def get_table():
    '''Responds with a table with specified id'''
    jsdata = request.get_json()
    jsform = request.form
    table = -1
    if jsdata == None:
        if jsform == None:
            return '{"done": 0}', 422
        else:
            table = jsform['table']
    else:
        table = jsdata['table']
    resp = get_data(table)
    if not resp:
        return "{'done': 0}", 422
    else:
        return resp

@app.errorhandler(404)
def error404(e):
    '''Render 404 page'''
    return render_template("404error.html"), 404
