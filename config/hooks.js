
//cgrigsby 10/10/2016

module.exports.hooks = {

  lineupFetch: {
    hookEnabled: false,
    delay: (1000 * 60 * 60 * 24 * 1), // one day
  },

  activeZip: {
    hookEnabled: false,
    delay: (1000 * 60 * 2),//*60 * 24 * 1) ,
    beatWithin: 7,
  },

  cacheLineups: {
    hookEnabled: true,
    delay: (1000 * 60 * 60), // one hour
  }

}
