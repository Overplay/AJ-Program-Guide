/**
 * ProgramController
 *
 * @description :: Server-side logic for managing programs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var crypto = require("crypto");
var async = require('async')


module.exports = {



  testEndpoint: function(req, res) {
    return res.ok();
  },


  getBestPositions: function(req, res) {

    var params = req.allParams()

    if(!params.stationIDs){
      return res.badRequest({error: "Missing station IDs"})
    }
    if(!params.startTimes){
      return res.badRequest({error: "Missing startTimes"})
    }

    if(params.startTimes.length != params.stationIDs.length){
      return res.badRequest({error: "really? wrong lengths"})
    }

    var hashes = []

    var bestPositions = []



    for (var i =0; i < params.stationIDs.length; i++){
      var id = params.stationIDs[i];
      var st = params.startTimes[i]
      hashes[i] =crypto.createHash("md5").update(id + new Date(st)).digest('hex')
    }

    async.forEach(hashes, function(hash,cb){
      sails.log.debug(hash)
      Program.findOne({hashKey: hash})
        .then(function(p){
          bestPositions[hashes.indexOf(hash)] = p.bestPosition
          cb();
        })
        .catch(function(err){
          cb(err)
        })

    },
    function(err){
      if (err) {
        sails.log.debug(err)
        return res.serverError({error: err})
      }
      else {
        return res.ok(bestPositions)
      }
    })

  },


  bestPositionLineup: function(req,res){
    //take lineup and station ID and find the program from that!
    if(!params.stationIDs){
      return res.badRequest({error: "Missing station IDs"})
    }

    //for each station ID, look up 

  }


};

