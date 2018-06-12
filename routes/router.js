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
    const sess = req.session;
    res.render('index', {
                session : sess
    });
  });

  app.get('/about', function(req, res, next) {
    const sess = req.session;
    res.render('about', {
                session : sess
    });
  });

  app.get('/contact', function(req, res, next) {
    const sess = req.session;
    res.render('contact', {
                session : sess
    });
  });

  app.get('/post', function(req, res, next) {
    const sess = req.session;
    res.render('post', {
                session : sess
    });
  });

  app.get('/signup', function(req, res, next) {
    res.render('signup');
  });

  app.get('/signin', function(req, res, next) {
    res.render('signin');
  });

  //로그아웃 코드
  app.get('/logout', (req, res) => {
      req.session.destroy(function (err) {
      if (err) throw err;
          res.redirect('/');
      });
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

    //로그인 코드
      app.post('/do_signin',  function (req,res){
         const body = req.body;
         const email = req.body.email;
         var pass = sha256(req.body.pass);
         console.log(body);
         var flag = false;
         var id = 0;
         //유저 찾기
         db.query('SELECT * FROM `user` WHERE `user_email` = ? LIMIT 1', [email], (err, result) => {
               if (err) throw err;
               console.log(result);

               if (result.length === 0) {
                     console.log('없음');
                     // res.json({success: false});
                     res.redirect(url.format({
                           pathname: '/signin',
                           query: {
                                 'success': false,
                                 'message': 'Login failed: ID does not exist'
                           }
                     }));
               } else {
                     if (pass != result[0].user_pw) {
                           console.log('비밀번호 불일치');
                           res.redirect(url.format({
                                 pathname: '/signin',
                                 query: {
                                       'success': false,
                                       'message': 'Login failed: Password Incorrect'
                                 }
                           }));
                     } else {
                           console.log('로그인 성공');

                           //세션에 유저 정보 저장
                           req.session.user_info = result[0];
                           flag = true;
                           id = result[0].user_id;
                           res.redirect('/');
                           // db.query('select * from `cart` where `user_id` = ?', [id], (err, result1) => {
                           //       if (err){
                           //          console.log(err);
                           //          res.render('error');
                           //       }
                           //
                           //       req.session.cartnum = result1.length;
                           //    });
                           //    db.query('select * from `favorite` where `user_id` = ?', [id], (err, result2) => {
                           //       if (err){
                           //          console.log(err);
                           //          res.render('error');
                           //       }
                           //       req.session.wishnum = result2.length;
                           //       res.redirect('/');
                           //    });
                     }
               }
         });
   });
}
