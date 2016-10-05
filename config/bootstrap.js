/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var CronJob = require('cron').CronJob;
var request = require('superagent-bluebird-promise');

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  var job = new CronJob('0 0 0 * * *', function () {
    Lineup.find({})
      .then( function (lineups) {
        _.forEach(lineups, function (lineup) {
          request
            .get(sails.tvmedia.url + '/lineups/' + lineup.lineupID + "/listings")
            .query({ lineupID: lineup.lineupID , api_key: sails.tvmedia.api_key })
            .then( function (res) {
              lineup.listings = res.data;
              lineup.save();
            })
        })
      })
  }, function () {
    sails.log("Lineups updated")
  }, true);



  cb();
};
