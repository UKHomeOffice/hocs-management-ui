import axios from 'axios';
import Item from '../models/item';
import Team from '../models/team';
import Unit from '../models/unit';
import { TeamPatch } from '../pages/team/editTeam/TeamPatch';

export const getTeam = (teamId: string) => new Promise<Team>((resolve, reject) =>
    axios.get(`/api/teams/${teamId}`)
        .then(response => resolve(response.data))
        .catch(error => reject(error))
);


export const getUnitForTeam = (teamId: string) => new Promise<Unit>((resolve, reject) =>
    axios.get(`/api/teams/${teamId}/unit`)
        .then(response => resolve(response.data))
        .catch(error => reject(error))
);

export const getTeams = () => new Promise<[Item]>((resolve, reject) =>
    axios.get('/api/teams')
        .then(response => resolve(response.data))
        .catch(error => reject(error))
);

export const getAllTeams = () => new Promise<[Item]>((resolve, reject) =>
    axios.get('/api/teams/all')
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

export const updateTeam = (teamId: string, patch: TeamPatch) => new Promise((resolve, reject) => axios
    .patch(`/api/teams/${teamId}`, patch)
    .then(response => resolve(response.data))
    .catch(reason => reject(reason))
);
