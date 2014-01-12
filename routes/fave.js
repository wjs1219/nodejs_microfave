var mysqltime = require('../utils/mysqltime');

exports.post_fave = function(database) {
  return function (req, res) {
    var text = req.body.text;
    var item = req.body.item;
    var category = req.body.category;
    
    var mysqldate = '';
    mysqltime.datetime(function (time) {
      mysqldate = time;
    });

    var post = {
        user_id: req.session.user.id,
        item: item,
        category: category,
        fave: text,
        created_at: mysqldate
    }

    if (text) {
      if (text.length <= 260) {
        database.query('insert into post set ?', post, function(error) {
          if (error) {
            console.log(error);
            return res.redirect('/');
          }

          return res.redirect('/home');
        });
      } else {
        res.render('home/index', { message : 'input is too long!' });
      }
    } else {
      res.render('home/index', { message : 'All 3 fields are required!' });
    }
  }
}
