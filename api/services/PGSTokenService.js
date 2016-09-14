//Cole Grigsby 2016/09/14


module.exports = {

  getToken: function (req) {
    var token = null;
    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        var scheme = parts[0];
        var credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        }
      }
    } 
    return token;
  }


}
