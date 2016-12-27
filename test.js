"use strict"

const express = require('express');
const app = express();
const fs = require('fs');

fs.readdir('./uploads', function(err, files) {
    console.log(files); //['小猫','小狗','小猪','文件.txt']
    console.log(files.length); //4

});


app.listen(3000);