const fs = require('fs'), Twitter = require('twit');

// Get these at apps.twitter.com
const twitterConsumerKey = "";
const twitterConsumerSecret = "";
const twitterAccessToken = "";
const twitterAccessSecret = "";

// Setup twitter api access
const twitterApi = new Twitter({
	consumer_key:         twitterConsumerKey,
	consumer_secret:      twitterConsumerSecret,
	access_token:         twitterAccessToken,
	access_token_secret:  twitterAccessSecret
});

// Name of the .csv file from the archive.
const archiveFile = "tweets.csv";

// Temporary array with the IDs of the tweets to delete.
var toDelete = [];

// Delete one tweet at a time.
function deleteThis() {
	// Ask the twitter api to delete the last item in the toDelete array.
	twitterApi.post("statuses/destroy", {id: toDelete[toDelete.length - 1].toString()}, function(err, data, response) {
		if(err != "undefined") // Make sure there's no errors
			console.log("Tweet #" + toDelete[toDelete.length - 1] + " was deleted successfully.");
		else
			console.log(err);

		// Remvoe the tweet we just deleted from his list.
		toDelete.splice(toDelete.length - 1, 1);
		console.log(toDelete.length + " Tweets left.");
		if(toDelete.length != 0) // Rerun that code if there's tweets left to delete.
			deleteThis();
	});

}

// Read the Twitter archive .csv file.
fs.readFileSync(archiveFile, "utf-8").toString().split("\n").forEach(function(l) {
	var tweetId = l.split(",")[0]; // The first item in that array will ALWAYS be the id
	if(tweetId[0] == '"' && tweetId[1] != '"') { // Sometimes words get on separated lines, it just makes sure that they won't be loaded as IDs
		toDelete.push((tweetId.replace(tweetId[0], "")).replace(tweetId[tweetId.length - 1], ""));
	}
});

deleteThis();