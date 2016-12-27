"use strict"

const fs = require('fs');

exports.getAllPhotos = function(callback) {
    //readdir是从根目录开始的
    fs.readdir('./uploads', function(err, files) {
        if (err) {
            //callback(err,null);
            callback("没有找到uploads文件", null);
        }
        let allPhotos = [];
        (function iterator(i) {
            if (i == files.length) {
                //return allPhotos;  //这样router接受不到allPhotos
                return callback(null, allPhotos);
            }

            fs.stat("./uploads/" + files[i], function(err, stats) {
                if (err) {
                    console.log(err);
                }
                if (stats.isDirectory()) {
                    allPhotos.push(files[i]);
                }
                iterator(i + 1); //这个放fs.stat()外面不行
            });


        })(0);
    });

}