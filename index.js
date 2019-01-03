'use strict';

const csv = require('csvtojson');
const rp = require('request-promise');
const Promise = require('bluebird');
const uuidv4 = require('uuid/v4');
const csvFilePath = './cards.csv';
const requestOptions = {
  method: 'POST',
  resolveWithFullResponse: true,
  json: true,
  simple: false,
  headers: {
    'x-auth-token': process.env.AUTH_TOKEN,
    'user-agent': 'request-promise'
  }
};

let reqResMap = {};

csv({
  noheader: true,
  output: 'line'
})
  .fromFile(csvFilePath)
  .then(cardNumbers => {
    let options = {};

    return Promise.all(cardNumbers.map(number => {
      options = Object.assign({}, requestOptions);
      options.body = {
        number: number
      };
      options.uri = process.env.ADD_CARD_URL;
      options.headers['x-request-id'] = uuidv4();

      reqResMap[options.headers['x-request-id']] = {
        addCardRequest: options.body
      };

      return rp(options);
    }));
  })
  .then(responses => {
    return responses.filter(response => {
      reqResMap[response.headers['x-request-id']]
        .addCardResponse = response.statusCode;

      return (response.statusCode === 200 || response.statusCode === 201);
    });
  })
  .then(responses => {
    let options = {};

    return Promise.all(responses.map(response => {
      options = Object.assign({}, requestOptions);
      options.body = {
        hash: response.body.hash,
        enabled: 0
      };
      options.uri = process.env.SET_ENABLED_URL;
      options.headers['x-request-id'] = response.headers['x-request-id'];

      reqResMap[response.headers['x-request-id']]
        .setEnabledRequest = options.body;

      return rp(options);
    }));
  })
  .then(responses => {
    return responses.map(response => {
      reqResMap[response.headers['x-request-id']]
        .setEnabledResponse = response.statusCode;
    });
  })
  .then(responses => {
    console.log(reqResMap);
  })
  .catch(error => {
    console.error(error);
  });
