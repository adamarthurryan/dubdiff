
'use strict';

var _ = require('lodash');
var Comparison = require('./comparison.model');
var wdiff = require('../../components/wdiff');
var mongoose = require('mongoose');


//return the comparison given an id, if it exsits
exports.showComparison = function showComparison(req, res) {
  Comparison.findById(req.params.id).exec(function (err, comparison) {
    if(err) { return handleError(res, err); }
    if(!comparison) { return res.send(404); }
    return res.json(comparison);
  });
}

//return a markdown wdiff for the comparison given an id, if it exsits
exports.wdiffMarkdownComparison = function wdiffMarkdownComparison(req, res) {
  Comparison.findById(req.params.id).exec(function (err, comparison) {
    if(err) { return handleError(res, err); }
    if(!comparison) { return res.send(404); }

    wdiff(comparison.a,comparison.b, true, function(err, result) {
      if (err)
        return handleError(res, err);

      _.merge(result, comparison._doc)
      return res.json(result);
    });
  });
}

// Creates a new comparison
exports.create = function(req, res) {
  //we do not allow the api client to change the id willy-nilly!
  if (req.body._id) { delete req.body._id; }

  var comparison = req.body;


  //and add to the db
  Comparison.create(comparison, function(err, comparison) {
    if(err) { return handleError(res, err); }

    //save the document and return
    comparison.save(function (err, comparison) {
      if(err) { return handleError(res, err); }
        return res.json(201, comparison);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
