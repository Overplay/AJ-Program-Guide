/**
 * Created by ryanhartzell on 10/26/16.
 */


var moment = require('moment');

module.exports = function programCleanHook(sails) {

  var cronDelay;
  var activeClean;

  return {

    configure: function () {
      if (!sails.config.hooks.programClean || !sails.config.hooks.programClean.hookEnabled)
        sails.log.warn("There's no config file for device or its hook is disabled... ");

      activeClean = sails.config.hooks.programClean;
    },

    initialize: function (cb) {
      if (!activeClean || !activeClean.hookEnabled) {
        sails.log.warn("There's no config file for device or its hook is disabled... ");
        return cb();
      }

      cronDelay = activeClean.delay || (1000 * 60 * 60 * 24);
      days = activeClean.days || 1;

      setTimeout(sails.hooks.programcleanhook.clean, 60000);

      return cb();
    },

    clean: function () {

      sails.log.info("Begin cleaning programs");

      Program.find({})
        .then( function (programs) {
          var chain = Promise.resolve();
          var cutoff = moment().subtract(activeClean.days, 'day').toDate();

          programs = _.filter(programs, function (o) { return o.startTime <= cutoff });

          _.forEach(programs, function (program) {
            chain = chain.then( function () {
              return Program.destroy({ id: program.id })
            })
          })

          return chain;
        })
        .then( function () {
          sails.log.info("Programs cleaned");
        })
        .catch( function (err) {
          sails.log.error(err);
        })

      setTimeout(sails.hooks.programcleanhook.clean, cronDelay);

    }
  }


}
