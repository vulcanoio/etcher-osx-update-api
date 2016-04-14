var express = require('express');
var app = express();
var upToDate = require('./upToDate');

var BASE_URL = "https://resin-production-downloads.s3.amazonaws.com"

app.get('/api/update/:product', function (req, res) {
  upToDate(BASE_URL, req.params.product, req.query.v, function(data){
    res.status(data.statusCode).send(data.content);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
