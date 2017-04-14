var express = require('express');
var fs = require('fs');
var parser = require('body-parser');
var app = express();
app.use(parser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/www'));

app.listen(8800, function () {
    console.log('server started');
});
