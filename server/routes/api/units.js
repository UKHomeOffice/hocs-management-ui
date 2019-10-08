const router = require('express').Router();
const { addUnit, getUnits, returnUnitsAsJson } = require('../../middleware/unit')

router.post('', addUnit);
router.get('', getUnits, returnUnitsAsJson);

module.exports = router;
