const router = require('express').Router();
const bodyParser = require('body-parser');
const apiStandardLineRouter = require('./standardLines');
const apiTeamRouter = require('./teams');
const apiTopicsRouter = require('./topics');
const apiUnitRouter = require('./units');
const apiUserRouter = require('./users');
const apiTemplateRouter = require('./templates');
const apiCaseTypeRouter = require('./caseTypes');
const apiNominatedContactRouter = require('./nominatedContact');
const apiKeepaliveRouter = require('./keepalive');

const { apiErrorMiddleware } = require('../../middleware/request');

router.post('*', bodyParser.json(), bodyParser.urlencoded());
router.delete('*', bodyParser.json(), bodyParser.urlencoded());
router.use('/standard-lines', apiStandardLineRouter);
router.use('/teams', apiTeamRouter);
router.use('/topics', apiTopicsRouter);
router.use('/units', apiUnitRouter);
router.use('/users', apiUserRouter);
router.use('/templates', apiTemplateRouter);
router.use('/case-types', apiCaseTypeRouter);
router.use('/nominated-contact', apiNominatedContactRouter);
router.use('/keepalive', apiKeepaliveRouter);
router.use('*', apiErrorMiddleware);

module.exports = router;
