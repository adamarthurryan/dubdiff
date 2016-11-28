var express = require('express')
var path = require('path')

var app = express()


app.use(express.static('dist'))
app.use('bower_components/*', express.static('bower_components'))
app.route('/*')
  .get(function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });

app.listen(8080, function () {
  console.log('Server listening on port 8080.')
})
