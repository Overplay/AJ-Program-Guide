//Cole Grigsby 2016/10/140


module.exports = {

  parse: function (listings, lineupID) {
    //TODO parse a lineup by programs and save the programs
    sails.log.info("Parsing lineup " + lineupID);
    return new Promise(function (resolve, reject) {
      async.eachSeries(listings, function (program, cb) {
          Program.findOne({
              programID: program.showID,
              programName: program.showName,
              channel: program.channelNumber,
              carrier: program.network
              //TODO might have to deal with start time
            })
            .then(function (p) {
              if (p) {
                //sails.log.verbose(program.showName + " already exists in database for lineup " + lineupID);
                cb()
                return null;
              }
              else {
                return Program.create({
                    programID: program.showID,
                    programName: program.showName, //TODO deal with movies
                    channel: program.channelNumber,
                    startTime: new Date(program.listDateTime),
                    duration: program.duration,
                    description: program.description,
                    carrier: program.network,
                    //extra: program,
                    lineupID: lineupID
                  })
                  .then(function () {
                    //sails.log.verbose(program.showName + " has been initialized");
                    cb()
                    return null;
                  })

              }
            })
            .catch(function (err) {
              sails.log.error(err);
              cb(err)
            })
        }

        , function (err) {
          if (err) {
            sails.log.debug(err)
            return reject({error: err})
          }
          return resolve();
        })

    })
  }



//for each program, set the appropriate data, save and move down the lineup
//probably good to do this async so its quicker than one by one


}
