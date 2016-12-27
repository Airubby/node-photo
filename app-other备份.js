/*
var express=require('express');
var app=express();
//var router=require("./controller/router.js"); //不用这样写，在controller下面写个package.json文件，写上入口文件为router就行了
var router=require("./controller");

app.set("view engine","ejs");

//路由中间件
//静态页面
//app.use(express.static("./public"));  //这样写 下面的  /admin  访问不到
//防止静态页面中的文件夹名把外面其他的占用了，给它加个文件夹比如static，只有在这文件夹下面的才静态，所以
//http://127.0.0.1:3000/admin 能 输出下面的           admin
app.use("/static",express.static("./public"));

//首页
app.get("/",router.showIndex); //这个地方不需要将showIndex(req,res)req,res带过去，这里就是函数的引用
//就相当于  app.get("/",function(req,res){res.send("我是首页");})

//下面这个admin就被静态文件中的占用了，就显示不了了	
//解决办法  将app.use(express.static("./public"));
app.get("/admin",function(req,res){
	res.send("admin");
});
//这个只是测试讲价，public下面的admin文件和1.txt是测试文件

app.listen(3000);

*/


var express = require('express');
var app = express();
var router = require("./controller");

app.set("view engine", "ejs");

//路由中间件
//静态页面
//app.use("/static",express.static("./public"));
//如果加上/static则把静态文件模板的资源比如css，images文件这些放到public下面就访问不到了，所以不用/static
app.use(express.static("./public"));
app.use(express.static("./uploads"));

//首页
app.get("/", router.showIndex); //这个地方不需要将showIndex(req,res)req,res带过去，这里就是函数的引用
app.get("/:albumName", router.showAlbum);
app.get("/:up", router.showUp);
app.post("/:up", router.doPost);

//404
app.use(function(req, res) {
    res.render('err');
    //res.status(404).send("没有这个页面！");
});

app.listen(4000);