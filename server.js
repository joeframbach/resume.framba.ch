var app = require('connect')();
app.use(require('serve-static')('static'));
app.use(function(req, res) {
  var parts = require('url').parse(req.url, true);
  if (parts.pathname == '/contact' && req.method == 'GET') {
    require('request').post(
      'https://www.google.com/recaptcha/api/siteverify',
      {form: {
        secret: require('./secret'),
        response: parts.query['g-recaptcha-response']
      }},
      function(err, gres, body) {
        if (!err && JSON.parse(body).success) {
          res.end(JSON.stringify({
            success: true,
            html: require('fs').readFileSync('address.html', {encoding:'utf8'})
          }));
        }
      }
    );
  }
});

require('http').createServer(app).listen(3000);
