//Cole Grigsby 2016/10/140

const DEFAULT_WIDGET_POSITION = 0; //NW position
const DEFAULT_SCROLLER_POSITION = 1; //bottom position

var crypto = require("crypto");

module.exports = {


  //TODO handle "Movie", "Video on Demand", "Off Air" - the titling is weird
  //channel name? station ID could be across carriers

  parse: function (listings, lineupID) {
    //TODO parse a lineup by programs and save the programs
    sails.log.info("Parsing lineup " + lineupID);

    return new Promise(function (resolve, reject) {
      async.eachSeries(listings, function (channel, cb) {

        // var hash = crypto.createHash("md5").update(programObj.stationID + programObj.startTime).digest('hex')
        //TODO maybe go to hash to individualize things
        channel.channel.lineupID = lineupID;

        Channel.findOrCreate(channel.channel)
          .then(function(c){
            return Program.destroy({channelID: c.id})
              .then( function () {
                async.eachLimit(channel.listings, 20, function (program, cb) {
                  program.channelID = c.id;
                  Program.create(program)
                    .then( function () { cb() })
                })
              })
          })
        /*Program.findOrCreate({
          hashKey: hash

        })
          .then(function (newProgram) {
           // sails.log.verbose(program.showName + " has been initialized");
            //sails.log.debug(newProgram);


           /* if (newProgram.bestPosition) { //EXists
              return null;
            }*

            //update with programObj
            if (!newProgram.bestPosition) {
              programObj.bestPosition = {crawler: DEFAULT_SCROLLER_POSITION, ad: DEFAULT_AD_POSITION}
            }
            //else
              //sails.log.debug("EXISTS")


            //update other fields if nec.
            return Program.update({hashKey: hash}, programObj)
              .then(function(updated){
                //sails.log.debug("UPDATED:" + updated)
                if(updated.length > 1){
                  sails.log.debug(updated)
                  sails.log.debug("FUCK FUCK FUCK UPDATED MORE THAN 1 PROG")
                }
              })


            /*return BestPosition.findOrCreate({ //TODO COULD BE MOVIE TOO
              type: "series",
              seriesName: programName,
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
              })*/
          //})
          .then(function () {
            //sails.log.verbose(program.showName + " has been initialized");
            //sails.log.debug("done")

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
