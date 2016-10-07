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

  var job = new CronJob('0 48 17 * * *', function () {

    sails.log.info('Begin updating lineups');

    Lineup.find({active: true})
      .then( function (lineups) {

        var chain = Promise.resolve();
        _.forEach(lineups, function (lineup) {
          var last = moment(lineup.lastAccessed);
          if (last.diff(moment(), 'days') > 7) {
            lineup.active = false;
            chain = chain.then( function () { return lineup.save() });
          }
          else {
            sails.log.debug('Accessing api');
            chain = chain.then(function () {
              return request
                .get(sails.config.tvmedia.url + '/lineups/' + lineup.lineupID + "/listings")
                .query({lineupID: lineup.lineupID, api_key: sails.config.tvmedia.api_key})
                .then(function (res) {
                  lineup.listings = res.text;
                  return lineup.save();
                })
                .catch(function (err) {
                  sails.log.debug(err);
                })
            })
          }
        });

        return chain;
      })
      .then( function () {
        sails.log.info("Lineups updated")
      })
  }, function () {}, true);


  cb();
};
