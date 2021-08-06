const router = require('express').Router();
const { getEntityList, returnEntityListJson, addEntityListItem, getEntity, returnEntityJson, updateEntityListItem, deleteEntityListItem } = require('../../middleware/entityList');

router.get('/list/:listName', getEntityList, returnEntityListJson);
router.get('/:itemUUID', getEntity, returnEntityJson);
router.post('/list/update/:listName', updateEntityListItem);
router.post('/list/:listName', addEntityListItem);
router.delete('/list/:listName', deleteEntityListItem);

module.exports = router;
