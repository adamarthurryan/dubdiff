'use strict';

var express = require('express');
var controller = require('./document.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/owner/:userid', controller.indexForUser);

router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
//router.put('/:id', auth.isAuthenticated(), controller.update);
//router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

router.get('/:id/revisions', controller.indexRevisionsForDocument);
router.get('/:id/revisions/:revisionid', controller.showRevision);


router.post('/:id/revisions', auth.isAuthenticated(), controller.createRevision);
/*
router.put('/:id/revisions/:revisionid', auth.isAuthenticated(), controller.updateRevision);
router.patch('/:id/revisions/:revisionid', auth.isAuthenticated(), ontroller.updateRevision);
router.delete('/:id/revisions/:revisionid', auth.isAuthenticated(), controller.destroyRevision);
*/
router.get('/wdiff/:revisionida/:revisionidb', controller.wdiff);

module.exports = router;
