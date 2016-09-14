/**
 * validateRequest
 *
 * @module      :: Policy
 * @description :: checks the validity of a token in the Authentication Header against AJ
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
var request = require('superagent')

module.exports = function (req, res, next) {

  var token = PGSTokenService.getToken(req);

  if (!token)
    return req.badRequest({error: "No token provided"});

  else {
    request
      .get(sails.config.deploymentUrl + '/device/validateRequest')
      .send({token: token})
      .end(function(err, resolve){
        if (err){
          return res.forbidden({error: err})
        }
        next()
      })
  }


};
