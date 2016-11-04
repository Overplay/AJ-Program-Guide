/**
 * BestPositionController
 *
 * @description :: Server-side logic for managing Bestpositions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  //Update position endpoint?

  //push new positions to boxes somehow...

  findAll: function (req, res) {
    BestPosition.find({})
      .then( function (data) {
        res.ok(data);
      })
      .catch( function (err) {
        res.serverError({ "error" : err });
      })
  }

};

