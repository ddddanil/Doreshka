# -*- coding: utf-8 -*-
logfiles = {
    "INFO": "app/log/info.log",
    "ERROR": "app/log/error.log"
}

def writeInfo(text):
    with open(logfiles['INFO'], 'a') as f:
        f.write(text)

def writeError(text):
    with open(logfiles['ERROR'], 'a') as f:
        f.write(text)

