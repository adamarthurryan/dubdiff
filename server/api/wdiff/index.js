'use strict';

var express = require('express');
var controller = require('./wdiff.controller');

var router = express.Router();

router.post('/', controller.compare);
router.post('/markdown', controller.compareMarkdown);


module.exports = router;