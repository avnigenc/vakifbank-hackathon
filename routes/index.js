var express = require('express');
var router = express.Router();
var request = require("request");
const child_process = require('child_process'); 



var PDFDocument, doc;
var fs = require('fs');
PDFDocument = require('pdfkit');
doc = new PDFDocument;
doc.pipe(fs.createWriteStream('output.pdf'));


var LocalStorage = require('node-localstorage').LocalStorage,
localstorage = new LocalStorage('./scratch');

var endpoint = 'https://api.dev.strike.acinq.co';
var api_key = 'sk_test_EUgDixzTVLttfsqNaaTYWw1d';

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  var options = {
    method: 'POST',
    url: endpoint + '/api/v1/charges',
    headers: {
      'cache-control': 'no-cache',
      'Content-Type': 'application/json' },
    body: {
      amount: Number(req.body.price),
      description: JSON.stringify({ name: req.body.name, price: req.body.price }),
      currency: 'btc'
    },
    json: true,
    auth: {
      user: api_key,
      pass: '',
    }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
    res.send(body);
  });

});

router.post('/order', function(req, res, next) {
  console.log(req.body);
  localstorage.setItem(req.body.data.id, JSON.stringify(req.body.data.id));
});

router.get('/order/:id', function(req, res, next) {
  console.log('bodyyy:',req.body);
  let id = req.params.id;
  console.log('id: ', id);
  localstorage.getItem(id);


  var options = {
    method: 'GET',
    url: endpoint + '/api/v1/charges/' + id,
    headers: {
      'cache-control': 'no-cache',
      'Content-Type': 'application/json' },
    json: true,
    auth: {
      user: api_key,
      pass: '',
    }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log('body: ', body);
    res.send(body);
  });
});

router.post('/save', function(req, res, next) {
  console.log(req.body.base64);

  require("fs").writeFile("out.png", req.body.base64, 'base64', function(err) {
    console.log(err);
  });

    doc.image('out.png', 50, 150, {width: 300});

  child_process.exec("lp output.pdf");
  res.send('body');
  
});

module.exports = router;
