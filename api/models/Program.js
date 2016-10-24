/**
 * Program.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        programID: {
            type: 'string',
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

        lineupID: {
            type: 'string' //lineupID
        },


    }

};

