var mysqltime = require('../utils/mysqltime');

exports.post_text = function(database) {
  return function (req, res) {
    var item = req.body.item;
    var category = req.body.category;
    var text = req.body.text;
    
    var mysqldate = '';
    mysqltime.datetime(function (time) {
      mysqldate = time;
    });

    var post = {
        user_id: req.session.user.id,
        item: item,
        category: category,
        text: text,
        created_at: mysqldate
    }

    if (text) {

    } else {
      res.render('home/index', { message : 'complete all fields' });
    }
  }
}
