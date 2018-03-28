/*jslint node:true, -W110*/
'use strict';
const Twitter = require('twit'),
  async = require('async');

// Get these at apps.twitter.com
const twitterConsumerKey = "";
const twitterConsumerSecret = "";
const twitterAccessToken = "";
const twitterAccessSecret = "";

// Setup twitter api access
const twitterApi = new Twitter({
  consumer_key: twitterConsumerKey,
  consumer_secret: twitterConsumerSecret,
  access_token: twitterAccessToken,
  access_token_secret: twitterAccessSecret
});


function getFavesAndDelete() {
  twitterApi.get('favorites/list', {
    count: 200
  }, function (err, data, response) {
    if (err) {
      console.log(err);
      return;
    }
    if (data.length === 0) {
      console.log('No more faves found');
      return;
    }
    var ops = [];
    data.forEach(function (tweet) {
      ops.push(function (callback) {
        console.log('Deleting ' + tweet.id + ', ' + tweet.text);
        twitterApi.post("favorites/destroy", {
          id: tweet.id_str
        }, callback);
      });
    });

    async.parallel(ops, function (err) {
      if (err) {
        console.log(err);
      }
      console.log('Fetching more in 10 seconds');
      setTimeout(getFavesAndDelete, 10000);
    });
  });
}

getFavesAndDelete();