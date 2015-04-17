
'use strict';

var _ = require('lodash');
var Comparison = require('./comparison.model');
var wdiff = require('../../components/wdiff');
var jf = require('jsonfile');
var fs = require('fs');



//return the comparison given an id, if it exsits
exports.showComparison = function showComparison(req, res) {
  //generate a filename
  var filename = fnComparison(req.params.id);

  //check if that file exists
  fs.exists(filename, function (exists) {
    //if the file does not exist, return a 404
    if (!exists)  return res.send(404);

    //otherwise, read the file as JSON
    jf.readFile(filename, function(err, comparison) {
      if(err) { return handleError(res, err); }

      //and return
      return res.json(comparison);
    });
  });
}

//return a markdown wdiff for the comparison given an id, if it exsits
exports.wdiffMarkdownComparison = function wdiffMarkdownComparison(req, res) {
  //generate a filename
  var filename = fnComparison(req.params.id);

  //check if that file exists
  fs.exists(filename, function (exists) {
    //if the file does not exist, return a 404
    if (!exists)  return res.send(404);

    //otherwise, read the file as JSON
    jf.readFile(filename, function(err, comparison) {
      if(err) { return handleError(res, err); }

      //now perform a wdiff on the result
      wdiff(comparison.a,comparison.b, true, function(err, result) {
        if (err)
          return handleError(res, err);

        _.merge(result, comparison)
        return res.json(result);
      });
    });
  });
}

// Creates a new comparison
exports.create = function create(req, res) {
  var a = req.body.a;
  var b = req.body.b;

  //create the comparison
  var comparison = new Comparison(a,b);

  //look up its filename
  var filename = fnComparison(comparison._id);

  //and write it to the filesystem
  jf.writeFile(filename, comparison, function(err) {
    if(err) { return handleError(res, err); }

    //if successful, return the comparison object
    return res.json(201, comparison);
  });
};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}


// returns a filename for the given comparison
function fnComparison (id) {
  return "./data/" + "comp-" + id + ".json";
}
