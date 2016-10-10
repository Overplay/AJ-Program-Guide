//Cole Grigsby 2016/10/140


module.exports = {

  parse: function(listings, lineupID) {
    //TODO parse a lineup by programs and save the programs

    async.each(listings, function (program) {
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
    });


    //for each program, set the appropriate data, save and move down the lineup
    //probably good to do this async so its quicker than one by one

  }


}
