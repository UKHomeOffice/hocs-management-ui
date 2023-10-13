const router = require('express').Router();
const { archiveCase, withdrawCase } = require('../../middleware/case');

router.use('/archive', archiveCase);
router.use('/withdraw', withdrawCase);

module.exports = router;
