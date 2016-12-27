"use strict"
const files = require('./files.js');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const sd = require('silly-datetime');


exports.showIndex = function(req, res, next) {
    // res.render('index', { //得用回掉函数才行
    //     'photos': ['aa', 'bb', 'cc']
    // });

    // res.render('index', { //得用回掉函数才行
    //     'photos': files.getAllPhotos() //files 为const files = require('./files.js');
    // });

    //内层函数不是return回来东西， 而是调用高层函数提供的回掉函数， 把数据当作回掉函数的参数来使用
    files.getAllPhotos(function(err, allPhotos) {
        if (err) {
            //res.send(err);   //错误信息显示给用户看
            next(); //交给下面适合它的中间件
            return;
        }
        res.render('index', {
            'photos': allPhotos
        })
    });
}

exports.showPhoto = function(req, res) {

    //res.send("相册" + req.params.photoName);
    let photoName = req.params.photoName;
    res.render('photo', {
        'photoName': photoName,
        "images": ["1.jpg", "2.jpg", "3.jpg"]
    });
}

// exports.showUp = function(req, res) {
//     res.render('up', {
//         'photos': ['aa', 'bb', 'cc']
//     })
// }