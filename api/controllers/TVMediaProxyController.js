/**
 * TVMediaProxyController
 *
 * @description :: Server-side logic for managing Tvmediaproxies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  fetch: function (req, res) {

    if (req.method !== "GET") {
      return res.badRequest({ error: "Wrong verb" });
    }

    var params = req.allParams();

    if (!params.lineupID) {
      return res.badRequest({ error: "Missing lineupID" });
    }

    Lineup.find({lineupID: params.lineupID})
      .then( function (lineup) {
        if (!lineup)
          return res.notFound({ error: "Lineup " + params.lineupID + " not found"});

        
      })

  }

};

