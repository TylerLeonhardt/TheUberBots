// web.js
var express = require("express"),
    logfmt = require("logfmt"),
    app = express(),
    str = "1+1 ",
    Client = require('node-wolfram'),
    Wolfram = new Client('4QQH9G-K8A2R2WAL3');

//var twitter = require('ntwitter');
var twitter = require('twit');

var twit = new twitter({
    consumer_key: 'Df9w73YbAhP3NFz1dVYDWIig9',
    consumer_secret: 'kjU5dWLkxhwNw6AtHP2gNHuPus67mCuOaI1j8SFmZVFm0hMWox',
    access_token: '2571622638-J4LLmwJMScRzaU8ztUakG92ZPS49i6FTqXgGQMJ',
    access_token_secret: 'KjOyamQSfW75fygc89EGrU1JBiZYqIuhplCOxy3Zu8vQ4'
});

app.set("tweet", str);

//twit.stream('statuses/filter', {
//        'track': '#testingsomething123'
//    }, function (stream) {
//        stream.on('tweet', function (tweet) {
//            console.log(data.user.name + "\n" + data.text);
//            //str = data.user.name + "\n" + data.text;
//            str = "" + data.text;
//            var temp = "";
//            for(var i = 0; i < str.length; i++){
//                if(str.charAt(i) === "#") break;
//                temp = temp + str.charAt(i);
//            }
//            str = temp;
//            console.log("before query " + str);
//            Wolfram.query(str, function(err, result) {
//                if(err)
//                    console.log(err);
//                else
//                {        
//                    console.log("before store " + str);
//                    str = result.queryresult.pod[1].subpod[0].plaintext[0];
//                    console.log(str);
//                    
//                }
//            });
//        });
//    });

var stream = twit.stream('statuses/filter', {
    'track': '#testingsomething123'
});
stream.on('tweet', function (tweet) {
    str = "" + tweet.text;
    var temp = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charAt(i) === "#") break;
        temp = temp + str.charAt(i);
    }
    str = temp;
    console.log("before query " + str);
    Wolfram.query(str, function (err, result) {
        if (err)
            console.log(err);
        else {
            console.log("before store " + str);
            str = result.queryresult.pod[1].subpod[0].plaintext[0];
            console.log(str);
            str = str + " @" + tweet.user.screen_name;
            twit.post('statuses/update', {
                status: str
            }, function (err, data, response) {
                console.log(data);
                console.log("did it work?");
            });

        }
    });
    //    str = str + " @" + tweet.user.name;
    //    twit.post('statuses/update', { status: 'Hello World?'}, function(err, data, response) {
    //        console.log(data);
    //        console.log("did it work?");
    //    });

});

//twit.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//  console.log(data)
//});

app.use(logfmt.requestLogger());



app.all('/', function (req, res) {
    res.send("Output"str);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function () {
    console.log("Listening on " + port);
});