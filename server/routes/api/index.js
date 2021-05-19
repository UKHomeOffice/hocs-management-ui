const router = require('express').Router();
const bodyParser = require('body-parser');
const apiStandardLineRouter = require('./standardLines');
const apiTeamRouter = require('./teams');
const apiTopicsRouter = require('./topics');
const apiUnitRouter = require('./units');
const apiCaseRouter = require('./case');
const apiEntityListRouter = require('./entityList.js');
const apiUserRouter = require('./users');
const apiTemplateRouter = require('./templates');
const apiCaseTypeRouter = require('./caseTypes');
const apiNominatedContactRouter = require('./nominatedContact');
const apiKeepaliveRouter = require('./keepalive');

const { apiErrorMiddleware } = require('../../middleware/request');

router.post('*', bodyParser.json(), bodyParser.urlencoded({ extended: true }));
router.patch('*', bodyParser.json(), bodyParser.urlencoded({ extended: true }));
router.put('*', bodyParser.json(), bodyParser.urlencoded({ extended: true }));
router.delete('*', bodyParser.json(), bodyParser.urlencoded({ extended: true }));
router.use('/standard-lines', apiStandardLineRouter);
router.use('/teams', apiTeamRouter);
router.use('/topics', apiTopicsRouter);
router.use('/units', apiUnitRouter);
router.use('/case/withdraw', apiCaseRouter);
router.use('/entity', apiEntityListRouter);
router.use('/users', apiUserRouter);
router.use('/templates', apiTemplateRouter);
router.use('/case-types', apiCaseTypeRouter);
router.use('/nominated-contact', apiNominatedContactRouter);
router.use('/keepalive', apiKeepaliveRouter);
router.use('*', apiErrorMiddleware);

module.exports = router;
