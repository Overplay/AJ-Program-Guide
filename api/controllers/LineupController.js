/**
 * LineupController
 *
 * @description :: Server-side logic for managing Lineups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('superagent-bluebird-promise');

module.exports = {

    searchByZip: function (req, res) {
        if (!req.allParams().zip)
            return res.badRequest({ "error" : "No ZIP Code provided" });

        var zip = req.allParams().zip;
        var extended = req.allParams().extended;

        return Lineup.find({})
            .then( function (all) {
                var lineups = _.filter(all, function (o) { return _.indexOf(o.zip, zip) != -1 });
                if (lineups && !extended)
                    return lineups;
                else {
                    return request
                        .get(sails.tvmedia.url + '/lineups')
                        .query({ zip: zip, api_key: sails.tvmedia.api_key }) // get api key
                        .then( function (res) {
                            return res.data;
                        })
                }
            })
            .catch( function (err) {
                return res.serverError({ "error" : err.message });
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
