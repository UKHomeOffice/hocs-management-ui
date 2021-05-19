const router = require('express').Router();
const {
    getTeam, getTeams, getUnitForTeam, getTeamMembers, getTeamsForUser,
    returnTeamJson, returnTeamsJson, returnTeamMembersJson,
    addTeam, patchTeam
} = require('../../middleware/team');
const { returnUnitAsJson } = require('../../middleware/unit');

const { protect } = require('../../middleware/auth');

router.get('', getTeams, returnTeamsJson);

router.get('/:teamId', getTeam, returnTeamJson);

router.get('/:teamId/unit', getUnitForTeam, returnUnitAsJson);

router.get('/:teamId/members', getTeamMembers, returnTeamMembersJson);

router.get('/:userId/teams', getTeamsForUser, returnTeamsJson);

router.post('/unit/:unitUUID',
    protect('DCU'),
    addTeam);

router.patch('/:teamId',
    patchTeam);

module.exports = router;
