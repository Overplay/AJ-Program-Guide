/**
 * Program.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var uuid = require('node-uuid')

module.exports = {

    attributes: {
        programID: {
            type: 'string',
          primaryKey: true
        },

        programName: {
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

        extra: {
            type: 'json',
            defaultsTo: {}
        },

        bestPosition: {
            model: 'BestPosition'
        },

        lineup: {
            model: 'lineup'
        },

      /*id: {
        type: 'string',
        primaryKey: true,
        defaultsTo: uuid.v4(),
        unique: true
      },*/
    }

};

