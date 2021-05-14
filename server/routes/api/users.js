const router = require('express').Router();
const { addToTeam, getAllUsers, getUser, addUser, amendUser, removeFromTeam, returnUsersJson, returnUserJson } = require('../../middleware/user');
const { getTeams, returnTeamsJson } = require('../../middleware/team');
const { fileMiddleware } = require('../../middleware/file');

router.post('/team/:teamId', addToTeam, getTeams, returnTeamsJson);

router.delete('/:userId/team/:teamId', removeFromTeam, getTeams, returnTeamsJson);

router.get('', getAllUsers, returnUsersJson);

router.get('/:userId', getUser, returnUserJson);

router.post('', fileMiddleware.any(), addUser);

router.put('/:userId', amendUser);

module.exports = router;
