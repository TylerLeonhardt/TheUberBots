/****************************************************/
/*                     DISPLAY                      */
/****************************************************/

var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.send('Utility Bots are working hard!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

/****************************************************/
/*                     TWITTER                      */
/****************************************************/

var newrelic = require('newrelic');  //require for pinging
var twit = require('twit');          //Twitter require

//Twitter Access
var twitter = new twit({
    consumer_key: 'Df9w73YbAhP3NFz1dVYDWIig9',
    consumer_secret: 'kjU5dWLkxhwNw6AtHP2gNHuPus67mCuOaI1j8SFmZVFm0hMWox',
    access_token: '2571622638-J4LLmwJMScRzaU8ztUakG92ZPS49i6FTqXgGQMJ',
    access_token_secret: 'KjOyamQSfW75fygc89EGrU1JBiZYqIuhplCOxy3Zu8vQ4'
});

/****************************************************/
/*                     WOLFRAM                      */
/****************************************************/

var Client = require('node-wolfram');   //Wolfram require
var wolfram = new Client('4QQH9G-K8A2R2WAL3');  //Wolfram Access

var wolframStr = ""; //String to be tweeted

//Twitter Steam for Wolfram tracking #UBCompute
var wolframStream = twitter.stream('statuses/filter', {
    'track': '#UBCompute'
});
//The Twitter Stream
wolframStream.on('tweet', function (tweet) {
    
    wolframStr = "" + tweet.text; //text unfiltered (still contains hashtag)
    
    //loop that reads up until the # then stops
    var temp = "";
    for (var i = 0; i < wolframStr.length; i++) {
        if (wolframStr.charAt(i) === "#") break;
        temp = temp + wolframStr.charAt(i);
    }
    
    wolframStr = temp; //stores filtered text into the str to be printed out

    //Query Wolfram Alpha call
    wolfram.query(wolframStr, function (err, result) {
        if (err)
            console.log(err);
        else {

            wolframStr = result.queryresult.pod[1].subpod[0].plaintext[0]; //stores the result in the str to be printed out
//            console.log(wolframStr);
            wolframStr = "@" + tweet.user.screen_name + ", Computed Result: " + wolframStr;
            twitter.post('statuses/update', {
                status: wolframStr
            }, function (err, data, response) {
                console.log(data);
            });

        }
    });
});

/****************************************************/
/*                                                  */
/****************************************************/