/**
 * BestPosition.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */


var uuid = require('node-uuid')
module.exports = {

  attributes: {

    id: {
      type: 'string',
      primaryKey: true,
      defaultsTo: uuid.v4(),
      unique: true
    },
    programID: {
      type: 'string'
    },
    crawlerTop: {
      type: 'integer'
    },

    crawlerBottom: {
      type: 'integer'
    },

    adTopLeft: {
      type: 'integer'
    },

    adTopRight: {
      type: 'integer'
    },

    adBottomLeft: {
      type: 'integer'
    },

    adBottomRight: {
      type: 'integer'
    },

    programs: {
      collection: 'program',
      via: 'bestPosition'
    }
  }
};

//absolute match
//close match
