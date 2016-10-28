
//cgrigsby 10/10/2016

module.exports.hooks = {

  lineupFetch: {
    hookEnabled: true,
    delay: (1000 * 60 *60 * 24 * 1), // one day
  },

  activeZip: {
    hookEnabled: false,
    delay: (1000 * 60 * 2),//*60 * 24 * 1) ,
    beatWithin: 7,
  },

  programClean: {
    hookEnabled: true,
    delay: (1000 * 60 * 60 * 24), // one day,
    days: 1 // the number of days old a program can be without being deleted
  }

}
