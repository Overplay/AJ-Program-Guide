/**
 * LineupController
 *
 * @description :: Server-side logic for managing Lineups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('superagent-bluebird-promise');
var async = require('async')
var moment = require('moment')

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
//TODO provider id for api query


    var chain = Promise.resolve();
    var zip = req.allParams().zip;
    var providerID = req.allParams().providerID;
    sails.log.debug(zip, providerID)
    Lineup.find()
      .then(function (all) {
        var lineups = _.filter(all, function (o) {
          return _.indexOf(o.zip, zip) != -1
        });
        if (lineups.length && !extended) { //TODO provider
          //take lineups and return the listings of all of them
          var listings = []
          _.each(lineups, function (l) {
            listings = _.union(l.listings, listings)
          })
          return res.ok(listings)
        }
        else {
          sails.log.debug("woah")
          return request
            .get(sails.config.tvmedia.url + '/lineups')
            .query({postalCode: zip, providerID: providerID, api_key: sails.config.tvmedia.api_key}) // TODO provider id
            .then(function (r) {
              lineups = r.body;
              sails.log.debug(lineups)
              async.eachSeries(lineups, function (l, cb) {
                //save the lineup THEN retrieve and parse listings
                var line = {
                  lineupID: l.lineupID,
                  lineupName: l.lineupName,
                  lineupType: l.lineupType,
                  providerID: l.providerID,
                  providerName: l.providerName,
                  //zip: [zip]
                }
                sails.log.debug(line)
                Lineup.create(line)
                  .then(function (lineup) {
                    var endTime = moment().add(14, 'days').subtract(1, 'millisecond').toISOString();
                    sails.log.debug(lineup)
                    request
                      .get(sails.config.tvmedia.url + '/lineups/' + lineup.lineupID + "/listings")
                      .query({lineupID: lineup.lineupID, api_key: sails.config.tvmedia.api_key, end: endTime})
                      .then(function (res) {
                        LineupParsingService.parse(res.body, lineup.lineupID)
                          .then(function () {
                            lineup.save(
                              function (err) {
                                if (err) cb(err)
                                else
                                  cb()
                              }
                            );
                          })


                      })

                  }),
                  function (err) {
                    if (err) {
                      sails.log.debug(err)
                      return res.serverError({error: err})
                    }
                  }

              })


            })

          return res.ok();

        }

      })
      .catch(function (err) {
        return res.serverError({"error": err});
      })

  }
};
