const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');

const app = express()

const comparisonRouter = require('./comparison')


app.use(express.static('dist'))
app.use('bower_components/*', express.static('bower_components'))


app.use(bodyParser.json())
app.use('/api/compare', comparisonRouter);


app.route('/*')
  .get(function(req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
  });



app.listen(8080, function () {
  console.log('Server listening on port 8080.')
})







//router.get('/', controller.index);
