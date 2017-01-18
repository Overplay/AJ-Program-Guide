/**
 * Channel.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    number: {
      type: "text"
    },

    channelNumber: {
      type: "integer"
    },

    subChannelNumber: {
      type: "integer"
    },

    stationID: {
      type: "integer"
    },

    name: {
      type: "text"
    },

    callsign: {
      type: "text"
    },

    network: {
      type: "text"
    },

    stationType: {
      type: "text"
    },

    NTSC_TSID: {
      type: "integer"
    },

    DTV_TSID: {
      type: "integer"
    },

    webLink: {
      type: "text"
    },

    logoFilename: {
      type: "text"
    },

    stationHD: {
      type: "boolean"
    },

    Twitter: {
      type: "text"
    },

    lineupID: {
      type: "text"
    },

    bestPosition: {
      model: 'bestposition'
    }
  }

};

