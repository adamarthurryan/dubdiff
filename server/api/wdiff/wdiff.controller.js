

'use strict';

var _ = require('lodash'),
    temp = require('temp'),
    fs   = require('fs'),
    exec = require('child_process').exec,
    wdiff = require('../../components/wdiff');

// Automatically track and cleanup files at exit
temp.track();

exports.compare = function(req, res) {
  doCompare(req, res, false);
};

exports.compareMarkdown = function(req, res) {
  doCompare(req, res, true);
};

// Perform a comparison
// The request should be a json object with two string fields: 'a' and 'b'
 function doCompare(req, res, asMarkdown) {

  //check for properly formatted request
  if (req.headers["content-type"].toLowerCase() != "application/json")
    return handleError(res, {error: "Content-type must be 'application/json'"});

  if (!req.body.a || !req.body.b)
    return handleError(res, {error: "Request data should be of the form {a:'text a', b:'text b'}"});

  var a = req.body.a;
  var b = req.body.b;

  wdiff(a,b,asMarkdown, function(err, result){
    if (err)
      return handleError(res, err);

    res.json(result);
  });
}


function handleError(res, err) {
  return res.send(500, err);
}