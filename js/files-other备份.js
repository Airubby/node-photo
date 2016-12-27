/*
//对应router中    引用models了A
exports.getAllAlbums=function(){
	return ['小猫','小狗'];
}
*/
/*
//由于异步，return allAlbums;不行   下面解决
var fs=require('fs');
exports.getAllAlbums=function(){
	//readdir是从根目录开始的
	fs.readdir("./uploads",function(err,files){
		var allAlbums=[];
		console.log(files);
		(function iterator(i){
			if(i==files.length){
				//遍历结束
				console.log(allAlbums);
				return allAlbums;
			}
			fs.stat("./uploads/"+files[i],function(err,stats){
				if(stats.isDirectory()){
					allAlbums.push(files[i]);
				}
				iterator(i+1);
			});
		})(0);
	});
	return ['xixi','haha'];
}
*/
/*
//对应router中  用models了B
var fs=require('fs');
exports.getAllAlbums=function(callback){
	//readdir是从根目录开始的
	fs.readdir("./uploads",function(err,files){
		var allAlbums=[];
		(function iterator(i){
			if(i==files.length){
				//return allAlbums;
				callback(allAlbums);
				return;  //要return，不然函数接受不了
			}
			fs.stat("./uploads/"+files[i],function(err,stats){
				if(stats.isDirectory()){
					allAlbums.push(files[i]);
				}
				iterator(i+1);
			});
		})(0);
	});
}
*/

//对应router中  用models了C
var fs = require('fs');
//这个函数中的callback中含有两个参数，一个err，一个是存放所有文件夹的名字的array
exports.getAllAlbums = function(callback) {
    //readdir是从根目录开始的
    fs.readdir("./uploads", function(err, files) {
        if (err) {
            //callback(err,null);
            callback("没有找到uploads文件", null);
        }
        var allAlbums = [];
        (function iterator(i) {
            if (i == files.length) {
                //return allAlbums;
                callback(null, allAlbums);
                return; //要return，不然函数接受不了
            }
            fs.stat("./uploads/" + files[i], function(err, stats) {
                if (err) {
                    callback("找不到文件" + files[i], null);
                }
                if (stats.isDirectory()) {
                    allAlbums.push(files[i]);
                }
                iterator(i + 1);
            });
        })(0);
    });
}

//通过文件名得到所有图片 对应router中  用models AA
exports.getAllImagesByAlbumName = function(albumName, callback) {
    fs.readdir("./uploads/" + albumName, function(err, files) {
        if (err) {
            //callback(err,null);
            callback("没有找到uploads文件", null);
            return;
        }
        var allImages = [];
        (function iterator(i) {
            if (i == files.length) {
                callback(null, allImages);
                return; //要return，不然函数接受不了
            }
            fs.stat("./uploads/" + albumName + "/" + files[i], function(err, stats) {
                if (err) {
                    callback("找不到文件" + files[i], null);
                    return;
                }
                if (stats.isFile()) {
                    allImages.push(files[i]);
                }
                iterator(i + 1);
            });
        })(0);
    });
}