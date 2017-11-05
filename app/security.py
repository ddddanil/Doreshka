from hashlib import sha1
import json

def get_val(value):
    with open("app/security.json", 'r') as f:
        vals = json.loads(f.read())
        if value in vals:
            return vals[value]
        else:
            return ''

def get_password():
    passwd = get_val('password')
    hashpswd = sha1(passwd.encode('utf-8')).hexdigest()
    return hashpswd
