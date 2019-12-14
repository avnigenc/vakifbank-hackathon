var express = require('express');
var router = express.Router();
var request = require("request");

var LocalStorage = require('node-localstorage').LocalStorage,
localstorage = new LocalStorage('./scratch');

var endpoint = 'https://api.dev.strike.acinq.co';
var api_key = 'sk_test_EUgDixzTVLttfsqNaaTYWw1d';


router.get('/', function(req, res, next) {
  
  var options = {
    method: 'GET',
    url: endpoint + '/api/v1/charges/',
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
    res.render('dashboard', { body });
  });

});

module.exports = router;
