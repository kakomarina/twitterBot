console.log('Ola!');

require('dotenv').config()
var Twit = require('twit'); 
var fs = require('fs');
var parser = require('./utils.js');
var config = {
	consumer_key: 		process.env.CONSUMER_KEY,
  	consumer_secret:      process.env.CONSUMER_SECRET,
  	access_token:         process.env.ACCESS_TOKEN,
  	access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
 	timeout_ms:           60*1000,  //optional HTTP request timeout to apply to all requests.
} 
var T = new Twit(config);


tweetLyrics();
setInterval(tweetLyrics, 60*60*1000);

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

// find latest tweet according the query 'q' in params
function retweet() {
    var params = {
        q: '#recycle',  // REQUIRED
        result_type: 'popular',
        lan: 'en',
        count: 5
    }

    T.get('search/tweets', params, function(err, data) {
      	if(data.statuses[0] === undefined) console.log('No tweet found');
      	// if there no errors
        else if (!err) {
	        for(var i = 0; i < 5; i++){  	
	          	// grab ID of tweet to retweet
	            var retweetId = data.statuses[i].id_str;
	            // Tell TWITTER to retweet
	            T.post('statuses/retweet/:id', {
	                id: retweetId
	            }, function(err, response) {
	                if (err) {
	                    console.log('Error retweeting: ' + err);
	                }
	                else if (response) {
	                    console.log('Retweeted!');
	                }
	            });
	            sleep(1000*60*5);
	        }
        }
        // if unable to Search a tweet
        else {
          console.log('Something went wrong with the search: ' + err);
        }
    });
}


var tweetCount = 0; 

function tweetIt(){
	fs.readFile('tweets.json', (err, data) => {
    	if (err)
      		console.log(err);
    	else {
      		var json = JSON.parse(data);
			var tweet = {
				status: json.status[tweetCount%5],
			}
			console.log(tweet.status);
			T.post('statuses/update', tweet, tweeted);

			function tweeted(err, data, response){
				if(!err) console.log("Tweet posted");
				else console.log("Something went wrong: " + err);
				tweetCount++;
			}
    	}
	})
}


async function tweetLyrics() {
	// choosing random lyric file
	filename = 'lyrics2/lyrics' + Math.floor((Math.random() * 100000) % 504 + 1)
	const lyrics = await parser.parseLyrics(filename);
	// random lyric verse 
	var rand = (Math.random() * 1000) % lyrics.length; 

	var tweet = {
		status: lyrics[Math.floor(rand)]
	}
	console.log(tweet.status)
	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
		if(!err) console.log("Tweet posted");
		else console.log("Something went wrong: " + err);
	}

}

//testing how to tweet media, still incoporating it to the bot
function tweetMedia(){
	var image = fs.readFileSync('meme.jpg', { encoding: 'base64' })
	// posting the media to twitter
	T.post('media/upload', { media_data: image }, function (err, data, response) {
	  // assingning alttext to media (accessability)
	  var mediaIdStr = data.media_id_string;
	  var altText = "Me explaining to my mom meme";
	  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };
	 
	  T.post('media/metadata/create', meta_params, function (err, data, response) {
	    if (!err) {
	      // reference the media and post a tweet
	      var params = { status: 'me explaining to my friends that reusing is important', media_ids: [mediaIdStr] }
	 
	      T.post('statuses/update', params, function (err, data, response) {
	        if(!err) console.log("Tweet posted");
	        else console.log("Something went wrong: " + err);
	      })
	    }
	  })
	})
}
