const router = require('express').Router();
const { archiveCase, withdrawCase } = require('../../middleware/case');
const { protect } = require('../../middleware/auth');

router.use('/archive', protect('MUI_CASE_ARCHIVING'), archiveCase);
router.use('/withdraw', withdrawCase);

module.exports = router;
