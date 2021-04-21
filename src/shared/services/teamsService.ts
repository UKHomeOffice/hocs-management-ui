import axios from 'axios';
import Item from '../models/item';
import Team from '../models/team';

export const getTeam = (teamId: string) => new Promise<Team>((resolve, reject) =>
    axios.get(`/api/teams/${teamId}`)
        .then(response => resolve(response.data))
        .catch(error => reject(error))
);

export const getTeams = () => new Promise<[Item]>((resolve, reject) =>
    axios.get('/api/teams')
        .then(response => resolve(response.data))
        .catch(error => reject(error))
);

export const getTeamMembers = (teamId: string) => new Promise((resolve, reject) => axios
    .get(`/api/teams/${teamId}/members`)
    .then(response => resolve(response.data))
    .catch(reason => reject(reason))
);

export const getTeamsForUser = (userId: string) => new Promise<[Item]>((resolve, reject) => axios
    .get(`/api/teams/${userId}/teams`)
    .then(response => resolve(response.data))
    .catch(reason => reject(reason))
);

export const addTeam = (team: Team) => new Promise((resolve, reject) => axios
    .post(`/api/teams/unit/${team.unitUUID}`, team)
    .then(response => resolve(response.data))
    .catch(reason => reject(reason))
);

export const updateTeamName = (teamId: string, newDisplayName: string) => new Promise((resolve, reject) => axios
    .put(`/api/teams/${teamId}`, { displayName: newDisplayName })
    .then(response => resolve(response.data))
    .catch(reason => reject(reason))
);
