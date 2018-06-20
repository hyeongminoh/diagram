module.exports = function(app){

   const http = require('http');
   const db = require('../db');
   const sha256 = require('sha256');
   const url = require('url');
   const multer = require('multer');
   const _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
   })
const upload = multer({ storage: _storage })
   var fs = require('fs');

  app.get('/', function(req, res, next) {
    const sess = req.session;
    let posts = [];
    let users = [];
    db.query('SELECT * FROM post WHERE post_share = ? ORDER BY post_date DESC', [1],  (err, results) => {
        if (err){
          console.log(err);
          res.render('error');
        }
    posts = results;
    db.query('SELECT user_id , user_name FROM user',  (err, results) => {
        if (err){
          console.log(err);
          res.render('error');
      }
      users = results;
      console.log(users);
      res.render('index', {
            'posts' : posts,
            'users': users,
            session : sess
      });
    });
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

  app.get('/write', function(req, res, next) {
    const sess = req.session;
    res.render('write', {
                session : sess
    });
  });

  app.get('/mypage', function(req, res, next) {
    const sess = req.session;
    let posts = [];
    db.query('SELECT * FROM post WHERE user_id = ?', [sess.user_info.user_id],  (err, results) => {
        if (err){
          console.log(err);
          res.render('error');
        }
    posts = results;
      users = results;
      console.log(users);
      res.render('mypage', {
            'posts' : posts,
            'users': users,
            session : sess
      });
   });
  });

  app.get('/mydiary', function(req, res, next) {
    const sess = req.session;
    let posts = [];
    db.query('SELECT * FROM post  WHERE (user_id = ? AND post_share = ? )', [sess.user_info.user_id, 0],  (err, results) => {
        if (err){
          console.log(err);
          res.render('error');
        }
      posts = results;
      console.log(posts);
      users = results;
      console.log(users);
      res.render('mypage', {
            'posts' : posts,
            'users': users,
            session : sess
      });
   });
  });

  app.get('/userpage', function(req, res, next) {
    const sess = req.session;
    let user_id = req.query.user_id;
    let posts = [];
    let users = [];
    db.query('SELECT * FROM post  WHERE (user_id = ? AND post_share = ? )', [user_id, 1],  (err, results) => {
        if (err){
          console.log(err);
          res.render('error');
        }
        posts = results;
        console.log(posts);
    db.query('SELECT * FROM user  WHERE user_id = ? ', [user_id],  (err, results) => {
      if (err){
        console.log(err);
        res.render('error');
      }
      users = results;
      console.log(users);
      res.render('userpage', {
            'posts' : posts,
            'user': users[0],
            session : sess
      });
   });
 });
});

  app.get('/signup', function(req, res, next) {
    const sess = req.session;
    res.render('signup', {
                session : sess
    });
  });

  app.get('/signin', function(req, res, next) {
    res.render('signin');
  });

  app.get('/post', function(req, res, next) {
    const sess = req.session;
    let post_id = req.query.post_id;
    let posts = [];
    db.query('SELECT * FROM post WHERE post_id = ?', [post_id],  (err, results) => {
        if (err){
          console.log(err);
          res.render('error');
        }
      posts = results;
    db.query('SELECT * FROM user WHERE user_id = ?', [posts[0].user_id],  (err, results) => {
      //users = results;
      //console.log(users);
      console.log(posts);
      res.render('post', {
            'post' : posts[0],
            'user': results[0],
            session : sess
      });
   });
    });
  });

  //로그아웃 코드
  app.get('/logout', (req, res) => {
      req.session.destroy(function (err) {
      if (err) throw err;
      res.redirect(url.format({
             pathname: '/',
             query: {
                   'success': true,
                   'message': 'logout'
             }
    }));
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

    //게시글작성하기
    app.post("/do_wirte_post", upload.single('userfile'), function (req,res){

          const sess = req.session;
          if (!sess.user_info) {
                   res.redirect('/');
          }
          console.log("do_wirte_post connect");
          var body = req.body;
          var content = body.content;
          var sharetype = body.shareType;
          var title = body.title;
          console.log(req.file);
          db.query('INSERT INTO post(user_id, post_title, post_content, post_share, post_image) VALUES(?,?,?,?,?) ',
          [sess.user_info.user_id, title, content, sharetype, req.file.originalname], function(error,result){
             if(error) throw error;
             console.log('post 추가 완료. result');
             res.redirect(url.format({
                      pathname: '/',
                      query: {
                            'success': true,
                            'message': 'Post success'
                      }
             }));
          });
     });

     app.post("/modify_post", function (req,res){
            console.log("user_registration connect");
            let post_id = req.query.post_id;
            var body = req.body;
            var sharetype = body.shareType;
            //console.log("new_share_type: ", new_share_type);
           db.query('UPDATE post SET post_share = ? WHERE post_id = ?',
           [ sharetype, post_id ], function(error,result){
              if(error) throw error;
              console.log('변경 완료.');
              res.redirect(url.format({
                       pathname: '/mypage',
                       query: {
                             'success': true,
                             'message': 'Modify success'
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
                           // res.redirect(url.format({
                           //       pathname: '/',
                           //       query: {
                           //             'success': true,
                           //             'message': 'Login success'
                           //       }
                           // }));
                     }
               }
         });
   });
}
