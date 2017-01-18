/**
 * Created by ryanhartzell on 10/26/16.
 */

var request = require('superagent-bluebird-promise');
var moment = require('moment');
var fs = require('fs');

module.exports = function cacheLineupsHook(sails) {

  var config;
  var cronDelay;

  return {

    configure: function () {
      if (!sails.config.hooks.cacheLineups || !sails.config.hooks.cacheLineups.hookEnabled)
        sails.log.warn("There's no config file for device or its hook is disabled... ");

      config = sails.config.hooks.cacheLineups;
    },

    initialize: function (cb) {
      if (!config || !config.hookEnabled) {
        sails.log.warn("There's no config file for device or its hook is disabled... ");
        return cb();
      }

      cronDelay = config.delay || (1000 * 60 * 60); // one hour

      setTimeout(sails.hooks.cachelineupshook.cache, 60000);

      return cb();
    },

    cache: function () {

      sails.log.info("Caching lineups");

      Lineup.find({})
        .then( function (lineups) {

          async.eachSeries(lineups, function (lineup, cb) {
            var startTime = moment().subtract(30, 'minutes').toISOString();

            request
              .get(sails.config.tvmedia.url + '/lineups/' + lineup.lineupID + '/listings/grid')
              .query({lineupID: lineup.lineupID, api_key: sails.config.tvmedia.api_key, start: startTime, timezone: sails.config.tvmedia.timezone})
              .then( function (res) {
                fs.writeFile("./.cache/" + lineup.lineupID, JSON.stringify(res.body), function (err) {
                  if (err) {
                    return cb(err);
                  }
                  sails.log.debug('Lineup ' + lineup.lineupID + " cached");
                  return cb();
                })
              })
              .catch( function (err) {
                sails.log.debug("Error fetching lineup data");
                return cb(err);
              })
          }, function (err) {
            if (err) {
              sails.log.debug("Lineup not updated" + err.message);
              setTimeout(sails.hooks.cachelineupshook.catch, 1000 * 60 * 5) // retry in five minutes
            }
            else {
              sails.log.debug("Lineups cached");
            }
          })
        });

      setTimeout(sails.hooks.cachelineupshook.cache, cronDelay);

    }
  }


}
