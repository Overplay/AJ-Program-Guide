/**
 * LineupController
 *
 * @description :: Server-side logic for managing Lineups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('superagent-bluebird-promise');

module.exports = {


  //this is what devices will use?
    searchByZip: function (req, res) {
        if (!req.allParams().zip)
            return res.badRequest({ "error" : "No ZIP Code provided" });

        var zip = req.allParams().zip;
        var extended = req.allParams().extended;

      sails.log.debug("AH")

        return Lineup.find({})
            .then( function (all) {
                var lineups = _.filter(all, function (o) { return _.indexOf(o.zip, zip) != -1 });
                if (lineups.length && !extended)
                    return res.ok(lineups);
                else {
                  sails.log.debug("woah")
                    return request
                        .get(sails.config.tvmedia.url + '/lineups')
                        .query({ postalCode: zip, api_key: sails.config.tvmedia.api_key }) // get api key
                        .then( function (r) {
                            return res.ok(r.body);
                        })
                }
            })
            .catch( function (err) {
                return res.serverError({ "error" : err });
            })
    },

    fetchListing: function (req, res) {
        if (!req.allParams().id)
            return res.badRequest({ "error" : "No lineup id specified" });

        return Lineup.find(id)
            .populate('listings')
            .then( function (lineup) {
                if (!lineup)
                    return res.notFound({ "error" : "Lineup not found" });
                else {
                    lineup.lastAccessed = Date.now();
                    return lineup.save()
                          .then( function () {
                              return res.toJSON(lineup.listings);
                          })

                }
            })
    }
};
