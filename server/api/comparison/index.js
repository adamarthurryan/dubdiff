'use strict';

var express = require('express');
var controller = require('./comparison.controller');

var router = express.Router();

//router.get('/', controller.index);

router.get('/:id', controller.showComparison);
//router.get('/:id/:doc', controller.showComparisonDoc);
router.get('/wdiff/:id', controller.wdiffMarkdownComparison);
//router.get('/wdiff/:id/nomarkdown', controller.wdiffNoMarkdownComparison);

router.post('/', controller.create);


module.exports = router;
