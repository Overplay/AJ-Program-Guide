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
var moment = require('moment');

module.exports.bootstrap = function(cb) {

  var job = new CronJob('0 30 14 * * *', function () {
    Lineup.find({})
      .then( function (lineups) {
        lineups = _.filter(lineups, function (o) { return o.active; });
        _.forEach(lineups, function (lineup) {
          var last = moment(lineup.lastAccessed);
          if (last.diff(moment(), 'days') > 7) {
            lineup.active = false;
            lineup.save();
          }
          else {
            request
              .get(sails.tvmedia.url + '/lineups/' + lineup.lineupID + "/listings")
              .query({ lineupID: lineup.lineupID , api_key: sails.tvmedia.api_key })
              .then( function (res) {
                lineup.listings = res.data;
                lineup.save();
              })
              .catch( function (err) {
                sails.debug(err);
              })
          }

        })
      })
  }, function () {
    sails.log("Lineups updated")
  }, true);


  cb();
};
