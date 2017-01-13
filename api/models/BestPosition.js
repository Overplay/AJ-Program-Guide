/**
 * BestPosition.js
 *
 * @description :: Best position model which attaches to a program.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    type: {
      type: 'string',
      enum: ['network', 'series']
    },

    seriesID: {
      type: 'integer'
    },

    seriesName: {
      type: 'string'
    },

    seriesNetworks: {
      type: 'array',
      defaultsTo: []
    },

    channels: {
      collection: 'channel',
      via: 'bestPosition'
    },

    network: {
      type: 'string'
    },

    stationID: {
      type: 'integer'
    },

    crawlerPosition: {
      type: 'integer',
      defaultsTo: 1
    },

    widgetPosition: {
      type: 'integer',
      defaultsTo: 0
    },

    //programs: {
    //  collection: 'program',
    //  via: 'bestPosition'
    //}
  }
};

//absolute match
//close match
