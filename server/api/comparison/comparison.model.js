'use strict';

// Load Chance
var Chance = require('chance');

// Instantiate Chance so it can be used
var chance = new Chance();


var Comparison = function Comparison(a,b) {
  return {
    created: Date.now(),
    a: a,
    b: b,
    _id: chance.hash()
  };
};

module.exports = Comparison;
