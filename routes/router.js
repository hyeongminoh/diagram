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

  app.get('/signup', function(req, res, next) {
    res.render('signup');
  });

  app.get('/signin', function(req, res, next) {
    res.render('signin');
  });


  //회원 가입 진행 코드
   app.post("/user_registration", function (req,res){
          console.log("user_registration connect");
          var body = req.body;
          var email = body.email;
          var name = body.name;
          var passwd = sha256(body.password);
          var nickname = body.nickname;
         console.log(email, name);

         db.query('INSERT INTO user(user_email, user_pw, user_name, user_nickname, user_image) VALUES(?,?,?,?,?) ',
         [email, passwd, name, nickname, 'image'], function(error,result){
            if(error) throw error;
            console.log('추가 완료. result: ',email, passwd, name, nickname);
            // alert("회원 가입이 완료되었습니다.");
            res.redirect(url.format({
                     pathname: '/signin',
                     query: {
                           'success': true,
                           'message': 'Sign up success'
                     }
            }));
         });
       });
}
