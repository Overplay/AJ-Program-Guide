/**
 * Program.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    programID: {
      type: 'integer'
    },

    programName: {
      type: 'text'
    },

    episodeName: {
      type: 'text'
    },

    channel: {
      type: 'integer'
    },

    startTime: {
      type: 'datetime'
    },

    // duration in minutes
    duration: {
      type: 'integer'
    },

    description: {
      type: 'text'
    },

    carrier: {
      type: 'text'
    },

    bestPosition: {
      model: 'BestPosition'
    },

    lineupID: {
      type: 'string' //lineupID
    },
    //_______________________________
    stationID: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    callsign: {
      type: 'string'
    },
    network:{
      type: 'string'
    },
    logoFilename: {
      type: 'string'
    },
     showType: {
       type: 'string'
     },
    showTypeID: {
      type: 'string'
    },
    league: {
      type: 'string'
    },
    team1ID:{
      type: 'string'
    },
    team1: {
      type: 'string'
    },
    team2ID:{
      type: 'string'
    },
    team2: {
      type: 'string'
    },
    hd: {
      type: 'boolean'
    },
    event: {
      type: 'string'
    },
    location: {
      type: 'string'
    },
    showPicture: {
      type: 'string'
    },
    artwork: {
      type: 'array'
    }


  }

};

