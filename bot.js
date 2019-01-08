console.log('Ola!');

var Twit = require('twit'); 

var config = require('./config');
var T = new Twit(config);

setInterval(retweet, 1000*2);

// find latest tweet according the query 'q' in params
function retweet() {
    var params = {
        q: 'cerveja',  // REQUIRED
        result_type: 'recent',
        lan: 'pt',
        count: 1
    }

    T.get('search/tweets', params, function(err, data) {
      	if(data.statuses[0] === undefined) console.log('Nenhum tweet encontrado');
      	// if there no errors
        else if (!err) {
          // grab ID of tweet to retweet
            var retweetId = data.statuses[0].id_str;
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
        }
        // if unable to Search a tweet
        else {
          console.log('Algo deu errado com a busca');
        }
    });
}




//setInterval(tweetIt, 1000*10);


// function tweetIt(){
	 
// 	var tweet = {
// 		status: 'Whatsup',
// 	}

// 	T.post('statuses/update', tweet, tweeted);

// 	function tweeted(err, data, response){
// 		console.log("Funcionou!");
// 	}
// }

 
