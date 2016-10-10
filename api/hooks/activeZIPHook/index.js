/**
 * Created by cgrigsby on 10/10/16.
 */


//TODO this is for checking all lineups  and their devices most recent activity to see if lineups for their zips should be active. 

/*
get zip for each lineup, 
get all devices for each zip, 
check latest heartbeat data from each device 
if within configured time, stay active, if not, set false for lineup. 
 */
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

      //group devices by zip - get that lineup, check the most recent 
      
      
      
      
      
      //TODO deal with the provider eventually lol 
      
      setTimeout(sails.hooks.checkZip.check, cronDelay);

    }


  }


};
