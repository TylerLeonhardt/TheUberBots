/****************************************************/
/*                     DISPLAY                      */
/****************************************************/

var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

app.get('/', function (req, res) {
    res.send('Utility Bots are working hard!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function () {
    console.log("Listening on " + port);
});

/****************************************************/
/*                     TWITTER                      */
/****************************************************/

var newrelic = require('newrelic'); //require for pinging
var twit = require('twit'); //Twitter require

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

var Client = require('node-wolfram'); //Wolfram require
var wolfram = new Client('4QQH9G-K8A2R2WAL3'); //Wolfram Access

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
/*                   EXCHANGE                       */
/****************************************************/

var oxr = require('open-exchange-rates'),
    fx = require('money');

oxr.set({
    app_id: '2cf0f9d440da44708475396524c2d6da'
});

var exchangeStr = "";

var exchangeStream = twitter.stream('statuses/filter', {
    'track': '#UBExchange'
});

exchangeStream.on('tweet', function (tweet) {

    exchangeStr = "" + tweet.text;
    if (exchangeStr.charAt(0) === '$')
        exchangeStr = exchangeStr.slice(1, exchangeStr.length);

    var exchangeArr = exchangeStr.split(" ");


    oxr.latest(function (error) {
        if (error) {
            // `error` will contain debug info if something went wrong:
            console.log('ERROR loading rates from API! Error was:')
            console.log(error.toString());

            // You could use hard-coded rates if error (see readme)
            return false;
        }

        // Apply exchange rates and base rate to `fx` library object:
        fx.rates = oxr.rates;
        fx.base = oxr.base;

        if (!isNaN(exchangeArr[0])) {
            try {
                exchangeStr = "" + fx(parseInt(exchangeArr[0])).from(exchangeArr[1]).to(exchangeArr[2]);
                exchangeStr = "@" + tweet.user.screen_name + ", " + exchangeArr[0] + " " + exchangeArr[1] + " -> " + exchangeStr + " " +
                    exchangeArr[2] + "!";
            } catch (err) {
                exchangeStr = "@" + tweet.user.screen_name + ", Invalid Currency! The available currencies are available at: \n https://openexchangerates.org/currencies";
            }
        } else {
            exchangeStr = "@" + tweet.user.screen_name + ", Please use the format:\n [Number ex: 100] [Currency From ex: USD] [Currency To ex: GBP]";
        }

        twitter.post('statuses/update', {
            status: exchangeStr
        }, function (err, data, response) {
            console.log(data);
        });
    });
});