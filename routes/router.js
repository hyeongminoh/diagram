module.exports = function(app){

   const http = require('http');
   const db = require('../db');
   const sha256 = require('sha256');
   const url = require('url');
   const multer = require('multer');
   const _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
   })
   const upload = multer({ storage: _storage })
  var fs = require('fs');

  app.get('/', function(req, res, next) {
    res.render('index');
  });

  app.get('/about', function(req, res, next) {
    res.render('about');
  });

  app.get('/contact', function(req, res, next) {
    res.render('contact');
  });

  app.get('/post', function(req, res, next) {
    res.render('post');
  });

}
