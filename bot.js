console.log('Ola!');

var Twit = require('twit'); 
var fs = require('fs');
var config = require('./config');
var T = new Twit(config);


setInterval(retweetRecycle, 1000*60*60*24);
setInterval(tweetIt, 1000*60);

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

// find latest tweet according the query 'q' in params
function retweetRecycle() {
    var params = {
        q: '#recycle',  // REQUIRED
        result_type: 'popular',
        lan: 'en',
        count: 5
    }

    T.get('search/tweets', params, function(err, data) {
      	if(data.statuses[0] === undefined) console.log('Nenhum tweet encontrado');
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
	                    console.log('Hmmm, tweet duplicado?');
	                }
	                else if (response) {
	                    console.log('Retweeted!!!');
	                }
	            });
	            sleep(1000*60*5);
	        }
        }
        // if unable to Search a tweet
        else {
          console.log('Algo deu errado com a busca');
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
				if(!err) console.log("Funcionou!");
				else console.log("Nao deu certo");
				tweetCount++;
			}
    	}
	})
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
	        if(!err) console.log("Funcionou");
	        else console.log("Nao deu certo");
	      })
	    }
	  })
	})
}
