const { infoService } = require('../clients/index');
const listService = require('../services/list');
const usersAdapter = require('./adapters/users');
const userAdapter = require('./adapters/user');
const teamsAdapter = require('./adapters/teams');
const membersAdapter = require('./adapters/members');
const topicsAdapter = require('./adapters/topics');
const unitsAdapter = require('./adapters/units')

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
            adapter: topicsAdapter
        },
        UNITS: {
            client: 'INFO',
            endpoint: '/unit',
            type: listService.types.DYNAMIC,
            adapter: unitsAdapter
        }
    },
    clients: {
        INFO: infoService
    }
};
