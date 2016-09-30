/**
 * Lineup.js
 *
 * @description :: Program lineups provided by the TVMedia.ca api
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {

        lineupID: {
            type: 'string'
        },

        lineupName: {
            type: 'string'
        },

        lineupType: {
            type: 'string'
        },

        providerID: {
            type: 'string'
        },

        providerName: {
            type: 'string'
        },

        serviceArea: {
            type: 'string'
        },

        zip: {
            type: 'array',
            defaultsTo: []
        },

        listings: {
            collection: 'program',
            via: 'lineup'
        }
    }
};
