//Cole Grigsby 2016/10/140

const DEFAULT_AD_POSITION = "top-right";
const DEFAULT_SCROLLER_POSITION = "bottom";

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
            //cb();
          }
          else {
            Program.create({
              programID: program.showID,
              programName: program.showName,
              channel: program.channelNumber,
              startTime: new Date(program.listDateTime),
              duration: program.duration,
              description: program.description,
              carrier: program.network,
              extra: program,
              lineup: lineupID
            })
              .then(function (newProgram) {
                //sails.log.verbose(program.showName + " has been initialized");
                return BestPosition.findOrCreate({
                  type: "series",
                  seriesID: program.seriesID
                })
                  .then( function (bpProgram) {
                    if (bpProgram.adPosition && bpProgram.crawlerPosition) {
                      newProgram.bestPosition = bpProgram.id;
                      return newProgram.save();
                    }
                    else {
                      return BestPosition.findOrCreate({
                        type: "channel",
                        channel: program.channelNumber
                      })
                        .then( function (bpChannel) {
                          // set ad and crawler position, either from the channel best position, or as defaults
                          bpChannel.adPosition = bpProgram.adPosition = bpChannel.adPosition || DEFAULT_AD_POSITION;
                          bpChannel.crawlerPosition = bpProgram.crawlerPosition = bpProgram.crawlerPosition || DEFAULT_SCROLLER_POSITION;
                          newProgram.bestPosition = bpProgram.id;
                          return newProgram.save()
                            .then( function () {
                              return bpProgram.save();
                            })
                            .then( function () {
                              return bpChannel.save();
                            })
                        })
                    }
                  })
              })
              .then( function () {
                cb();
              })
              .catch(function (err) {
                sails.log.error(err);
                return cb(err)
              })
          }
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
