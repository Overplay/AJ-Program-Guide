/**
 * Created by cgrigsby on 10/10/16.
 */


var request = require('superagent-bluebird-promise');
var moment = require('moment');

module.exports = function activeZIPHook(sails) {

  var activeZip;
  var cronDelay;
  var within; 


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
      cronDelay = activeZip.delay || (1000 * 60 * 60 * 12);
      within = activeZip.beatWithin || 21; //days 
      sails.log.debug('Device heartbeat will check with this period: ' + cronDelay / 1000 + 's');

      setTimeout(sails.hooks.activeziphook.check, cronDelay);


      return cb();

    },

    check: function () {
      //step through devices and delete ones that aren't registered after the timeout


      // get venues, group by address: {zip: }
      request
        .get(sails.config.AJUrl + '/api/v1/venue') //TODO policies
        .end(function (err, data) {
          if (err) {
            sails.log.debug(err)
          }
          else {
            sails.log.debug(data)
            var venues = data.body
            var byZip = _.groupBy(venues, function (v) {
              return v.address.zip;
            })

            _.forEach(byZip, function (val, key) {
              var recent = null
              _.forEach(val, function(v){
                sails.log.debug(v.devices)
                //go through the venues devices, comparing most recent heartbeat
                async.each(v.devices, function(d, cb){
                  sails.log.debug(d)
                  request
                    .get(sails.config.AJUrl + '/OGLog/deviceHeartbeat/' + d.id) //TODO policies
                    .end(function (err, data) {
                      if (err) cb(err)
                      var beats = data.body
                      sails.log.debug(beats)
                      if (!recent)
                        recent = beats[0].loggedAt
                      if(moment(recent).isBefore(beats[0].loggedAt))
                        recent = beats[0].loggedAt
                      cb();
                    })
                }, function(err){
                  if (err) sails.log.debug(err)
                  sails.log.debug("RECENT ",recent)
                  var zip = key;
                  if (moment(recent).isBefore(moment().subtract(within).days())){
                    Lineup.find()
                      .then( function (all) {
                        var lineups = _.filter(all, function (o) {
                          return _.indexOf(o.zip, zip) != -1
                        });
                        lineups.forEach(function(l){
                          l.active = false;
                          l.save()
                        })
                      })
                  }
                })

              });
              
              

            })
          }
        })
      

      //TODO deal with the provider eventually lol

      setTimeout(sails.hooks.activeziphook.check, cronDelay);

    }


  }


};
