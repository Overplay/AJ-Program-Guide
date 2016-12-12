/**
 * Channel.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    number: {
      type: "string"
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
      type: "string"
    },

    callsign: {
      type: "string"
    },

    network: {
      type: "string"
    },

    stationType: {
      type: "string"
    },

    NTSC_TSID: {
      type: "integer"
    },

    DTV_TSID: {
      type: "integer"
    },

    webLink: {
      type: "string"
    },

    logoFilename: {
      type: "string"
    },

    stationHD: {
      type: "string"
    },

    lineupID: {
      type: "string"
    }
  }

};

