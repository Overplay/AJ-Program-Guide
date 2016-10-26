/**
 * LineupController
 *
 * @description :: Server-side logic for managing Lineups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('superagent-bluebird-promise');
var moment = require("moment")

module.exports = {


  //this is what devices will use?
  searchByZip: function (req, res) {
    if (!req.allParams().zip)
      return res.badRequest({"error": "No ZIP Code provided"});

    var zip = req.allParams().zip;
    var extended = req.allParams().extended;

    sails.log.debug("AH")

    return Lineup.find({})
      .then(function (all) {
        var lineups = _.filter(all, function (o) {
          return _.indexOf(o.zip, zip) != -1
        });
        if (lineups.length && !extended)
          return res.ok(lineups);
        else {
          sails.log.debug("woah")
          return request
            .get(sails.config.tvmedia.url + '/lineups')
            .query({postalCode: zip, api_key: sails.config.tvmedia.api_key}) // get api key
            .then(function (r) {
              return res.ok(r.body);
            })
        }
      })
      .catch(function (err) {
        return res.serverError({"error": err});
      })
  },


  //multiple lineups per zip may be nec.


  // need to handle first time a lineup is being accessed

  fetchListing: function (req, res) {
    if (!req.allParams().id)
      return res.badRequest({"error": "No lineup id specified"});

    var id = req.allParams().id
    return Lineup.find(id) //might have to specify lineup id
      .populate('listings')
      .then(function (lineup) {
        if (!lineup) {
          //get the lineup and save it
          var endTime = moment().add(14, 'days').subtract(1, 'millisecond').toISOString();

          request
            .get(sails.config.tvmedia.url + '/lineups/' + lineup.lineupID + "/listings")
            .query({lineupID: id, api_key: sails.config.tvmedia.api_key, end: endTime})
            .then(function (res) {
              //create lineup

              LineupParsingService.parse(res.body, lineup.id);
              return lineup.save();
            })
        }
        else {
          lineup.lastAccessed = Date.now();
          return lineup.save()
            .then(function () {
              return res.toJSON(lineup.listings);
            })

        }
      })
  },


  //WORK IN PROGRESS / needs testing
  fetchPrograms: function (req, res) {
    if (!req.allParams().zip)
      return res.badRequest({"error": "No ZIP Code provided"});
    if (!req.allParams().providerID)
      return res.badRequest({"error": "No provider Code provided"});
    if (!sails.config.tvmedia.api_key)
      return res.serverError({error: "No API Key in Config"})

    var zip = req.allParams().zip;
    var providerID = req.allParams().providerID;
    Lineup.find({providerID: providerID})
      .then(function (all) {
        var lineups = _.filter(all, function (o) {
          return _.indexOf(o.zip, zip) != -1
        });
        if (lineups.length) { //TODO this would work but too much data
          //take lineups and return the listings of all of them
          var listings = []
          sails.log.debug("LINEUP", lineups)
          Program.find( {lineupID: lineups[0].lineupID } )
            .then(function (p) {
              return res.ok(p)
            })
            .catch(function (err) {
              if (err) return res.serverError({error: err})
            })

        }
        else {
          sails.log.debug("woah")
          return request
            .get(sails.config.tvmedia.url + '/lineups')
            .query({postalCode: zip, providerID: providerID, api_key: sails.config.tvmedia.api_key}) // TODO provider id
            .then(function (r) {
              lineups = r.body;
              async.eachSeries(lineups, function (l) {
                //save the lineup THEN retrieve and parse listings
                sails.log.debug(l)

                var line = {
                  lineupID: l.lineupID,
                  lineupName: l.lineupName,
                  lineupType: l.lineupType,
                  providerID: l.providerID,
                  providerName: l.providerName,
                  zip: [zip]
                }

                return Lineup.create(line)
                  .then(function (lineup) {
                    var endTime = moment().add(1, 'days').subtract(1, 'millisecond').toISOString();

                    return request
                      .get(sails.config.tvmedia.url + '/lineups/' + lineup.lineupID + "/listings")
                      .query({lineupID: lineup.lineupID, api_key: sails.config.tvmedia.api_key, end: endTime})
                      .then(function (res) {
                        LineupParsingService.parse(res.body, lineup.lineupID);
                        return lineup.save();
                      })
                  })
              })


            })
            .catch(function (err) {
              sails.log.debug("Error!" + err)
              return res.serverError({error: err})
            })

          return res.ok(listings);

        }
      })
      .catch(function (err) {
        sails.log.debug("WHTAT HTE AF ")
        return res.serverError({"error": err});
      })

  },

  //TODO delete befoer prod
  removeLineups: function (req, res) {
    Lineup.destroy()
      .then(function () {
        return Program.destroy()
      })
      .then(function () {
        return res.ok()
      })
  },

  initialize: function(req, res) {
    if (!req.allParams().zip)
      return res.badRequest({"error": "No ZIP Code provided"});
    if (!req.allParams().providerID)
      return res.badRequest({"error": "No provider Code provided"});
    if (!sails.config.tvmedia.api_key)
      return res.serverError({error: "No API Key in Config"})

    var zip = req.allParams().zip;
    var providerID = req.allParams().providerID;
    var lineups = []
    request
      .get(sails.config.tvmedia.url + '/lineups')
      .query({postalCode: zip, providerID: providerID, api_key: sails.config.tvmedia.api_key})
      .then(function (r) {
        var body = r.body;
        async.eachSeries(body, function (l, cb) {
            //save the lineup THEN retrieve and parse listings
            sails.log.debug(l)

            var line = {
              lineupID: l.lineupID,
              lineupName: l.lineupName,
              lineupType: l.lineupType,
              providerID: l.providerID,
              providerName: l.providerName,
              zip: [zip]
            };

            Lineup.findOrCreate(line)
              .then(function (lineup) {
                //if it existed, add the zip to zips
                lineups.push(lineup)
                //TODO start populating programs if nec?
                return cb()
              })
              .catch(function (err) {
                return cb(err)
              })
          },
          function (err) {
            if (err) return res.serverError({error: err})
            return res.ok(lineups)
          }
        )
      })

  },

  //TODO getting provider IDs for ZIP


  //assumes lineup has been initialized already, might have to sep by days
  fetchListings: function(req, res) {
    if (!req.allParams().zip)
      return res.badRequest({"error": "No ZIP Code provided"});
    if (!req.allParams().providerID)
      return res.badRequest({"error": "No provider Code provided"});

    var zip = req.allParams().zip;
    var providerID = req.allParams().providerID;
    Lineup.find({providerID: providerID})
      .then(function (all) {
        var lineups = _.filter(all, function (o) {
          return _.indexOf(o.zip, zip) != -1
        });
        //take lineups and return the listings of all of them
        var listings = []
        sails.log.debug("LINEUP", lineups)
        Program.find({lineupID: lineups[0].lineupID })
          .then(function (p) {
            return res.ok(p)
          })
          .catch(function (err) {
            if (err) return res.serverError({error: err})
          })
      })
  }



  //IDEA just add line up then call something else to start building it,
  //get a day at a time
};
