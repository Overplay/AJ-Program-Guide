//Cole Grigsby 2016/10/140

const DEFAULT_AD_POSITION = "top-right";
const DEFAULT_SCROLLER_POSITION = "bottom";

module.exports = {

  parse: function (listings, lineupID) {
    //TODO parse a lineup by programs and save the programs
    sails.log.info("Parsing lineup " + lineupID);
    return new Promise(function (resolve, reject) {
      async.eachSeries(listings, function (program, cb) {
        Program.findOrCreate({
          programID: program.showID,
          programName: program.showName,
          episodeName: program.episodeTitle,
          channel: program.channelNumber,
          description: program.description,
          duration: program.duration,
          startTime: new Date(program.listDateTime),
          carrier: (program.network || program.name),
          lineupID: lineupID
        })
          .then(function (newProgram) {
            //sails.log.verbose(program.showName + " has been initialized");

            if (newProgram.bestPosition) {
              return null;
            }

            return BestPosition.findOrCreate({
              type: "series",
              seriesName: program.showName,
              seriesID: program.seriesID
            })
              .then(function (bpProgram) {
                // add network to series networks
                if (_.indexOf(bpProgram.seriesNetworks, program.callsign, 0) === -1)
                  bpProgram.seriesNetworks.push(program.callsign);

                if (bpProgram.adPosition && bpProgram.crawlerPosition) {
                  newProgram.bestPosition = bpProgram.id;
                  return newProgram.save()
                    .then( function () {
                      return bpProgram.save();
                    });
                }
                else {
                  return BestPosition.findOrCreate({
                      type: "network",
                      network: program.callsign
                    })
                    .then(function (bpChannel) {
                      // set ad and crawler position, either from the channel best position, or as defaults
                      bpChannel.adPosition = bpProgram.adPosition = bpChannel.adPosition || DEFAULT_AD_POSITION;
                      bpChannel.crawlerPosition = bpProgram.crawlerPosition = bpProgram.crawlerPosition || DEFAULT_SCROLLER_POSITION;

                      newProgram.bestPosition = bpProgram.id;
                      return newProgram.save()
                        .then(function () {
                          return bpProgram.save();
                        })
                        .then(function () {
                          return bpChannel.save();
                        })
                    })
                }
              })
          })
          .then(function () {
            //sails.log.verbose(program.showName + " has been initialized");
            cb();
            return null;
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
      }
    )
  }



//for each program, set the appropriate data, save and move down the lineup
//probably good to do this async so its quicker than one by one


}
