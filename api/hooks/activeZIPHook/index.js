/**
 * Created by cgrigsby on 10/10/16.
 */


var request = require('superagent-bluebird-promise');
var moment = require('moment');

module.exports = function checkZIP(sails) {

  var activeZip;
  var cronDelay;


  return {

    configure: function () {
      if (!sails.config.hooks.activeZip || !sails.config.hooks.activeZip.hookEnabled) {
        sails.log.warn("There's no config file for device or its hook is disabled... ");
      }

      activeZip = sails.config.hooks.activeZip;
    },

    initialize: function (cb) {
      if (!activeZip || !activeZip.hookEnabled) {
        sails.log.warn("There's no config file for device or its hook is disabled... ");
        return cb();
      }
      //timeout = (1000 * 60);
      cronDelay = activeZip.delay || (1000 * 60 * 60 * 12);
      //cronDelay = 10000;
      sails.log.debug('Device cleaner will clean with this period: ' + cronDelay / 1000 + 's');

      setTimeout(sails.hooks.checkZip.check, cronDelay);


      return cb();

    },

    check: function () {
      //step through devices and delete ones that aren't registered after the timeout


      // get venues, group by address: {zip: }
      request
        .get(sails.config.deploymentUrl + '/api/v1/venue') //TODO policies
        .end(function (err, venues) {
          if (err) {
            sails.log.debug(err)
          }
          else {
            sails.log.debug(venues)

            var byZip = _.groupBy(venues, function (v) {
              return v.address.zip;
            })

//TODO NEEDS TESTING
            _.forEach(byZip, function (val, key) {
              var recent = null
              _.forEach(val, function(v){
                //go through the venues devices, comparing most recent heartbeat
                _.forEach(v.devices, function(d){
                  request
                    .get(sails.config.deploymentUrl + '/device/deviceHeartbeat') //TODO policies
                    .end(function (err, beats) {
                      sails.log.debug(beats)
                      if (!recent)
                        recent = beats[0]
                      if(moment(recent).isBefore(beats[0]))
                        recent = beats[0]
                    })
                })

              })
             //if recent is not within range, change that zips lineups to inactive
              //check zip, set inactive if need be
            })
//TODO multiple reqs could get funky, might need to async some shit
          }
        })


      //get all devices for each group of venues

      //find the most recent heartbeat for each zip

      //check it to be within the time frame

      //set active to T or F


      //TODO deal with the provider eventually lol

      setTimeout(sails.hooks.checkZip.check, cronDelay);

    }


  }


};
