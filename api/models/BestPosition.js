/**
 * BestPosition.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */


module.exports = {

  attributes: {


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
