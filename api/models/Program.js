/**
 * Program.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    channelID: {
      type: 'text'
    },

    listingID: {
      type: 'integer'
    },

    listDateTime: {
      type: 'text'
    },

    duration: {
      type: 'integer'
    },

    showID: {
      type: 'integer'
    },

    seriesID: {
      type: 'integer'
    },

    showName: {
      type: 'text'
    },

    episodeTitle: {
      type: 'text'
    },

    episodeNumber: {
      type: 'text'
    },

    parts: {
      type: 'integer'
    },

    partNum: {
      type: 'integer'
    },

    seriesPremiere: {
      type: 'boolean'
    },

    seasonPremiere: {
      type: 'boolean'
    },

    seriesFinale: {
      type: 'boolean'
    },

    seasonFinale: {
      type: 'boolean'
    },

    repeat: {
      type: 'boolean'
    },

    new: {
      type: 'boolean'
    },

    rating: {
      type: 'text'
    },

    captioned: {
      type: 'boolean'
    },

    educational: {
      type: 'boolean'
    },

    blackWhite: {
      type: 'boolean'
    },

    subtitled: {
      type: 'boolean'
    },

    live: {
      type: 'boolean'
    },

    hd: {
      type: 'boolean'
    },

    descriptiveVideo: {
      type: 'boolean'
    },

    inProgress: {
      type: 'boolean'
    },

    showTypeID: {
      type: 'text'
    },

    breakoutLevel: {
      type: 'integer'
    },

    showType: {
      type: 'text'
    },

    year: {
      type: 'text'
    },

    guest: {
      type: 'text'
    },

    cast: {
      type: 'text'
    },

    director: {
      type: 'text'
    },

    starRating: {
      type: 'integer'
    },

    description: {
      type: 'text'
    },

    league: {
      type: 'text'
    },

    team1ID: {
      type: 'integer'
    },

    team2ID: {
      type: 'integer'
    },

    team1: {
      type: 'text'
    },

    team2: {
      type: 'text'
    },

    event: {
      type: 'text'
    },

    location: {
      type: 'text'
    },

    showPicture: {
      type: 'text'
    },

    artwork: {
      type: 'array'
    },

    showHost: {
      type: 'text'
    },

    hashKey: {
      type: 'text'
    }


  }

};

