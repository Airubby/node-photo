"use strict"
const files = require('./files.js');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const sd = require('silly-datetime');


exports.showIndex = function(req, res) {
    res.render('index', {
        'albums': ['aa', 'bb', 'cc']
    });
}