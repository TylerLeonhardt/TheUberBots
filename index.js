// web.js
var express = require("express"),
    logfmt = require("logfmt"),
    app = express();

app.use(logfmt.requestLogger());

app.get('/', function (req, res) {
    res.send('Tyler Loves Isabella!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function () {
    console.log("Listening on " + port);
});

var twitter = require('ntwitter');

var twit = new twitter({
  consumer_key: '3qh7f8nrRL722Ij71A8Qbgy3m',
  consumer_secret: 'mgpJNZfwfe96NyPh4kt0kxVBu929aa6eYHoOTuFXOv7WAfobcp',
  access_token_key: '2571622638-ZcwPHGZfgqq9C0YxLD3NXX1osSJwRALPJR4CCYK',
  access_token_secret: 've3flKS441AJagYJ4vIqiJyn9Fbtels8j5LHLasYPM6XD'
});

twit.stream('statuses/filter', {'track':'#testingsomething123'}, function(stream) {
  stream.on('data', function (data) {
    console.log(data.name + "\n" + data.text);
  });
});