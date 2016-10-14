/**
 * Lineup.js
 *
 * @description :: Program lineups provided by the TVMedia.ca api
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {

        lineupID: {
            type: 'string',
            primaryKey: true //set this to the primary key to keep it in line with tvmedia db and for program associations
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
        },

        lastAccessed: {
            type: 'datetime',
            defaultsTo: Date.now()
        },

        active: {
            type: 'boolean',
            defaultsTo: true
        },

        toJSON: function () {
            var obj = this.toObject();

            if (!sails.config.policies.wideOpen) {
                delete obj.active;
                delete obj.lineupID;
                delete obj.providerID;
            }

            return obj;
        }
    }
};
