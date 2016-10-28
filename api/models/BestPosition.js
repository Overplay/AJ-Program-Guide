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
      enum: ['channel', 'series']
    },

    seriesID: {
      type: 'string'
    },

    channel: {
      type: 'integer'
    },

    crawlerPosition: {
      type: 'string',
      enum: ['top', 'bottom']
    },

    adPosition: {
      type: 'string',
      enum: ['top-right', 'top-left', 'bottom-right', 'bottom-left']
    },

    programs: {
      collection: 'program',
      via: 'bestPosition'
    }
  }
};

//absolute match
//close match
