"use strict"
const files = require('./files.js');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const sd = require('silly-datetime');
const qs = require('querystring');

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

exports.showPhoto = function(req, res, next) {

    //res.send("相册" + req.params.photoName);
    let photoName = req.params.photoName;
    files.getAllImages(photoName, function(err, allImages) {
        if (err) {
            next();
            return;
        }

        res.render('photo', {
            'photoName': photoName,
            "images": allImages
        });

    });


}

exports.showUp = function(req, res, next) {
    files.getAllPhotos(function(err, allPhotos) {
        if (err) {
            next();
            return;
        }
        res.render('up', {
            'photos': allPhotos
        })
    });

}

exports.doUp = function(req, res) {

    let form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../tempup/");

    form.parse(req, function(err, fields, files, next) {

        if (err) {
            next();
            return;
        }

        //console.log(fields) //{wenjianjia:'小狗'}

        let size = files.images.size;
        if (size > (2 * 1024 * 1024)) {
            res.send("图片尺寸应该小于2M");
            //删除图片
            fs.unlink(files.images.path);
            return;
        }

        let wenjianjia = fields.wenjianjia;
        let extname = path.extname(files.images.name);
        let oldPath = files.images.path;

        let ran = parseInt(Math.random() * 89999 + 10000);
        let t = sd.format(new Date(), 'YYYYMMDDHHmmss');

        let newPath = path.normalize(__dirname + "/../uploads/" + wenjianjia + "/" + t + ran + extname);

        fs.rename(oldPath, newPath, function(err) {
            if (err) {
                res.send("上传失败");
                return;
            }
            res.send("上传成功");
        });


    });

}

exports.showAdd = function(req, res) {
    res.render('add');
}

exports.doAdd = function(req, res, next) {



}