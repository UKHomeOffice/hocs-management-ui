const router = require('express').Router();
const {
    getTeam, getTeams, getTeamMembers, getTeamsForUser,
    returnTeamJson, returnTeamsJson, returnTeamMembersJson,
    addTeam, updateTeamName
} = require('../../middleware/team');
const { protect } = require('../../middleware/auth');

router.get('', getTeams, returnTeamsJson);

router.get('/:teamId', getTeam, returnTeamJson);

router.get('/:teamId/members', getTeamMembers, returnTeamMembersJson);

router.get('/:userId/teams', getTeamsForUser, returnTeamsJson);

router.post('/unit/:unitUUID',
    protect('DCU'),
    addTeam);

router.put('/:teamId',
    protect('RENAME_TEAM'),
    updateTeamName);

module.exports = router;
