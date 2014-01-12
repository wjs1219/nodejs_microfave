var crypto = require('crypto');
var mysqltime = require('../utils/mysqltime');

exports.post_login = function(database) {
  return function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (email && password) {
      password = crypto.createHash('md5').update(password).digest('hex');

      database.query('select * from user where email=? and password=?', [email, password], function(error, result) {
         if (error) {
          console.log(error);
          return res.redirect('/');
        }
        
        if (result.length == 1) {
          req.session.user = result[0];
          return res.redirect('/home');
         } else {
            return res.redirect('/');
        }
      });
    } else {
        // fields empty
        return res.redirect('/');
    }
  }
}

exports.post_register = function(database) {
  return function (req, res) {
    var email = req.body.email;
    var username = req.body.username;
    var name = req.body.name;
    var location = req.body.location;
    var dob = req.body.dob;
    var password = req.body.password;
    var pw_confirm = req.body.pw_confirm;
 
    if (email && username && password && pw_confirm) {
      if (password == pw_confirm) {
        password = crypto.createHash('md5').update(password).digest('hex');

        // username verification
        database.query('select * from user where username=?',[username], function(error, result) {
          if (error) {
            console.log(error);
            return res.redirect('/');
          }
          if (result.length > 0) {
            return res.render('site/index', { message: 'username exists' });

          } else {
           
            //email verification
            database.query('select * from user where email=?',[email], function(error, result) {
              if (error) {
                console.log(error);
                return res.redirect('/');
              }
  
              if (result.length > 0) {
                return res.render('site/index', { message: 'email exists' });
              } else {
                var mysqldate = '';
                mysqltime.datetime(function (time) {
                  mysqldate = time;
                })    
                var user = {
                  email: email,
                  username: username,
                  name: name,
                  location: location,
                  dob: dob,
                  password: password,
                  created_at: mysqldate
                }
              
                database.query('insert into user set ?', user, function (error) {
                  if (error) {
                    console.log(error);
                    return res.redirect('/');
                  }
                    
                  database.query('select * from user where email=? and password=?', [email, password], function (error, result) {
                    if (error) {
                      console.log(error);
                      return res.redirect('/');
                    }

                    if (result.length == 1) {
                      // auto login
                      req.session.user = result[0];
                      return res.redirect('/home');
                    } 
                    else {
                      return res.redirect('/');
                    }
                  });
                });
              }
            });
          }
        });
      } else {
          return res.render('site/index', { message: 'passwords do not match' });
        }      
    } else {
      return res.render('site/index', { message: 'One or more of the required fields are empty' });
    }
  }
}
