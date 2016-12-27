var file = require("../models/files.js");
var formidable = require('formidable');
var path = require("path");
var fs = require("fs");
var sd = require("silly-datetime");
/*
exports.showIndex=function(req,res){
	//res.send("我是首页");
	//res.render("index");   //渲染这个页面
	
	//index.ejs中 有 albums 调用了
	res.render("index",{
		"albums":["aa","bb","cc"]
	});
}

exports.showAlbum=function(req,res){
	res.send("相册"+req.params.albumName);
}
*/
/*
//引用models了A
var file=require("../models/files.js");
exports.showIndex=function(req,res){
	//res.send("我是首页");
	//res.render("index");   //渲染这个页面
	
	//index.ejs中 有 albums 调用了
	res.render("index",{
		"albums":file.getAllAlbums()
	});
}

exports.showAlbum=function(req,res){
	res.send("相册"+req.params.albumName);
}
*/

/*
//用models了B
var file=require("../models/files.js");
exports.showIndex=function(req,res){
	//res.send("我是首页");
	//res.render("index");   //渲染这个页面
	
	//这样不行，因为files.js中的异步，得用回掉函数的形式
	//res.render("index",{
	//	"albums":file.getAllAlbums()
	//});
	
	
	//内层函数不是return回来东西，而是调用高层函数提供的回掉函数，把数据当作回掉函数的参数来使用
	file.getAllAlbums(function(allAlbums){
		res.render("index",{
			"albums":allAlbums
		})
	});
}

exports.showAlbum=function(req,res){
	res.send("相册"+req.params.albumName);
}
*/

//用models了C
/*var file=require("../models/files.js");
exports.showIndex=function(req,res){
	
	//内层函数不是return回来东西，而是调用高层函数提供的回掉函数，把数据当作回掉函数的参数来使用
	file.getAllAlbums(function(err,allAlbums){
		if(err){
			res.send(err);   //错误信息显示给用户看
			return;
		}
		res.render("index",{
			"albums":allAlbums
		})
	});
}*/
//上面用models了C最后完了升级用中间件
//var file=require("../models/files.js"); //这个放最前面
exports.showIndex = function(req, res, next) {

        //内层函数不是return回来东西，而是调用高层函数提供的回掉函数，把数据当作回掉函数的参数来使用
        file.getAllAlbums(function(err, allAlbums) {
            if (err) {
                //res.send(err);   //错误信息显示给用户看
                next(); //交给下面适合它的中间件
                return;
            }
            res.render("index", {
                "albums": allAlbums
            })
        });
    }
    /*
    exports.showAlbum=function(req,res){
    	res.send("相册"+req.params.albumName);
    }
    //这个一直都有的  上面引用models了ABC都有这个的，下面是对这个的具体详写
    */
    //用models AA
    /*exports.showAlbum=function(req,res){
    	//遍历相册中的所有图片
    	//res.send("相册"+req.params.albumName);
    	var albumName=req.params.albumName;
    	//具体业务交给model
    	
    	//res.render("album",{
    		//"albumname":albumName,
    		//"images":["1.jpg","2.jpg","3.jpg"]
    	//});
    	//上面是用固定的测试
    	file.getAllImagesByAlbumName(albumName,function(err,imagesArray){
    		if(err){
    			//res.send(err);
    			res.render("err");  //err页面
    			return;
    		}
    		res.render("album",{
    			"albumname":albumName,
    			"images":imagesArray
    		});
    	});
    }
    */
exports.showAlbum = function(req, res, next) {
    //遍历相册中的所有图片
    //res.send("相册"+req.params.albumName);
    var albumName = req.params.albumName;
    //具体业务交给model

    //res.render("album",{
    //"albumname":albumName,
    //"images":["1.jpg","2.jpg","3.jpg"]
    //});
    //上面是用固定的测试
    file.getAllImagesByAlbumName(albumName, function(err, imagesArray) {
        if (err) {
            //res.send(err);
            //res.render("err");  //err页面
            next();
            return;
        }
        res.render("album", {
            "albumname": albumName,
            "images": imagesArray
        });
    });
}





//显示上传信息
/*exports.showUp=function(req,res){
	res.render("up",{
		"albums":["哈哈","呵呵"]
	});
}*/

exports.showUp = function(req, res) {
    //命令file模块（我们自己写的函数）调用getAllAlbums函数
    //得到所有文件夹名字之后做的事情，写在回调函数里面
    file.getAllAlbums(function(err, albums) {
        res.render("up", {
            "albums": albums
        });
    });
}



//上传表单
/*exports.doPost=function(req,res){
	var form=new formidable.IncomingForm();
	form.parse(req,function(err,fields,files){
		console.log(fields);
		console.log(files);
	});
	res.send("成功");
	return;
}*/

//var path = require("path");  //头部引用
exports.doPost = function(req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../tempup/");
    form.parse(req, function(err, fields, files, next) {
        //console.log(fields);
        //console.log(files);
        //改名
        if (err) {
            next(); //这个中间件不受理了，往下走
            return;
        }
        //判断文件尺寸
        var size = parseInt(files.tupian.size);
        if (size > (2048 * 1024)) {
            res.send("图片尺寸应该小于2M");
            //删除图片
            fs.unlink(files.tupian.path);
            return;
        }

        var ttt = sd.format(new Date(), "YYYYMMDDHHmmss");
        var ran = parseInt(Math.random() * 89999 + 1000);
        var extname = path.extname(files.tupian.name);

        var wenjianjia = fields.wenjianjia;
        var oldpath = files.tupian.path;
        var newpath = path.normalize(__dirname + "/../uploads/" + wenjianjia + "/" + ttt + ran + extname);
        fs.rename(oldpath, newpath, function(err) {
            if (err) {
                res.send("改名失败");
                return;
            }
            res.send("成功");
        });

    });

    return;
}