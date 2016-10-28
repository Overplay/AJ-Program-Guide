/**
 * Created by cgrigsby on 10/10/16.
 */
var request = require('superagent-bluebird-promise');
var moment = require('moment');

module.exports = function lineupFetchHook(sails) {

  var fetchConfig;
  var cronDelay;


  return {

    configure: function () {
      if (!sails.config.hooks.lineupFetch || !sails.config.hooks.lineupFetch.hookEnabled) {
        sails.log.warn("There's no config file for device or its hook is disabled... ");
      }

      fetchConfig = sails.config.hooks.lineupFetch;
    },

    initialize: function (cb) {
      if (!fetchConfig || !fetchConfig.hookEnabled) {
        sails.log.warn("There's no config file for device or its hook is disabled... ");
        return cb();
      }
      //timeout = (1000 * 60);
      cronDelay = fetchConfig.delay || (1000 * 60 * 60 * 12);
      //cronDelay = 10000;
      sails.log.debug('Lineup Fetches every: ' + cronDelay / 1000 + 's');

      setTimeout(sails.hooks.lineupfetchhook.fetch, 60000);//TODO


      return cb();

    },

    fetch: function () {
      //step through devices and delete ones that aren't registered after the timeout

      sails.log.info('Begin updating lineups');

      Lineup.find({active: true})
        .then(function (lineups) {
          /*
           var chain = Promise.resolve();
           _.forEach(lineups, function (lineup) {
           var last = moment(lineup.lastAccessed);
           if (last.diff(moment(), 'days') > 7) {
           lineup.active = false;
           chain = chain.then( function () { return lineup.save() });
           }
           else {
           sails.log.debug('Accessing api');
           var endTime = moment().add(14, 'days').subtract(1, 'millisecond').toISOString();

           chain = chain.then(function () {
           return request
           .get(sails.config.tvmedia.url + '/lineups/' + lineup.lineupID + "/listings")
           .query({lineupID: lineup.lineupID, api_key: sails.config.tvmedia.api_key, end: endTime})
           .then(function (res) {
           LineupParsingService.parse(res.body, lineup.id);
           return lineup.save();
           })
           })
           }
           });*/
          async.eachSeries(lineups, function (lineup, cb) {
            //save the lineup THEN retrieve and parse listings
            sails.log.debug(lineup)

            var endTime = moment().add(14, 'days').subtract(1, 'millisecond').toISOString();

            request
              .get(sails.config.tvmedia.url + '/lineups/' + lineup.lineupID + "/listings")
              .query({lineupID: lineup.lineupID, api_key: sails.config.tvmedia.api_key, end: endTime})
              .then(function (res) {
                 return LineupParsingService.parse(res.body, lineup.lineupID);
              })
              .then(function(){
                sails.log.debug("callback")
                return cb()
              })
              .catch(function(err){
                return cb(err)
              })


          }, function(err){
            if (err) sails.log.debug(err)
            sails.log.info("Lineups updated")
            setTimeout(sails.hooks.lineupfetchhook.fetch, cronDelay);


          })


        })


    }


  }


};
