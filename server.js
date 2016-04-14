var express = require('express');
var app = express();
var upToDate = require('./upToDate');

var BASE_URL = "https://resin-production-downloads.s3.amazonaws.com"

app.get('/api/update/:product', function (req, res) {
  version = req.query.v || req.query.version
  upToDate(BASE_URL, req.params.product, version, function(data){
    res.status(data.statusCode).send(data.content);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
