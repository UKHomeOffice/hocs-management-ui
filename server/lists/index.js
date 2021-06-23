const { infoService } = require('../clients/index');
const listService = require('../services/list');
const usersAdapter = require('./adapters/users');
const userAdapter = require('./adapters/user');
const teamsAdapter = require('./adapters/teams');
const membersAdapter = require('./adapters/members');
const unitsAdapter = require('./adapters/units');
const contactsAdapter = require('./adapters/contacts');

module.exports = {
    lists: {
        USERS_IN_TEAM: {
            client: 'INFO',
            endpoint: '/teams/${teamId}/members',
            adapter: usersAdapter
        },
        TEAMS_FOR_USER: {
            client: 'INFO',
            type: listService.types.DYNAMIC,
            endpoint: '/user/${userId}/teams',
            adapter: teamsAdapter
        },
        MEMBER_LIST: {
            client: 'INFO',
            endpoint: '/member',
            adapter: membersAdapter
        },
        TEAMS: {
            client: 'INFO',
            endpoint: '/team',
            type: listService.types.DYNAMIC,
            adapter: teamsAdapter
        },
        ALL_TEAMS: {
            client: 'INFO',
            endpoint: '/team/all',
            type: listService.types.DYNAMIC,
            adapter: teamsAdapter
        },
        USER: {
            client: 'INFO',
            endpoint: '/user/${userId}',
            type: listService.types.DYNAMIC,
            adapter: userAdapter
        },
        USERS: {
            client: 'INFO',
            endpoint: '/users',
            type: listService.types.DYNAMIC,
            adapter: usersAdapter
        },
        TOPICS: {
            client: 'INFO',
            endpoint: '/topics',
            type: listService.types.DYNAMIC,
        },
        DCU_POLICY_TEAM_FOR_TOPIC: {
            client: 'INFO',
            endpoint: '/team/topic/stage/DCU_DTEN_INITIAL_DRAFT',
            type: listService.types.DYNAMIC,
        },
        UNITS: {
            client: 'INFO',
            endpoint: '/unit',
            type: listService.types.DYNAMIC,
            adapter: unitsAdapter
        },
        CONTACTS_FOR_TEAM: {
            client: 'INFO',
            endpoint: '/team/${teamId}/contact',
            type: listService.types.DYNAMIC,
            adapter: contactsAdapter
        }
    },
    clients: {
        INFO: infoService
    }
};
