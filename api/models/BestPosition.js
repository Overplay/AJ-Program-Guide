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

    network: {
      type: 'string'
    },

    crawlerPosition: {
      type: 'string',
      enum: ['top', 'bottom']
    },

    adPosition: {
      type: 'string',
      enum: ['top-right', 'top-left', 'bottom-right', 'bottom-left']
    },

    //programs: {
    //  collection: 'program',
    //  via: 'bestPosition'
    //}
  }
};

//absolute match
//close match
