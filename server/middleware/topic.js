const { infoService } = require('../clients/index');
const User = require('../models/user');

async function getTopic(req, res, next) {
    const { topicId } = req.params;

    try {
        const response = await infoService.get(`/topic/${topicId}`, { headers: User.createHeaders(req.user) });
        res.locals.topic = response.data;
        next();
    } catch (error) {
        next(error);
    }
}

async function getTopics(req, res, next) {
    try {
        const response = await infoService.get('/topics/active', { headers: User.createHeaders(req.user) });
        res.locals.topics = response.data;
        next();
    } catch (error) {
        next(error);
    }
}

async function addTopic(req, res, next) {
    const { parentTopicId } = req.params;
    try {
        await infoService.post(`/topic/parent/${parentTopicId}`, req.body, { headers: User.createHeaders(req.user) });
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

async function addParentTopic(req, res, next) {
    try {
        await infoService.post('/topic/parent', req.body, { headers: User.createHeaders(req.user) });
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

function addDCUTeamsToTopic(req, res, next) {
    const { topicValue, privateMinisterTeam, draftQaTeam } = req.body;

    const TeamstoStageTypes = [
        { 'caseType': 'MIN', 'stageType': 'DCU_MIN_INITIAL_DRAFT', 'team': draftQaTeam },
        { 'caseType': 'MIN', 'stageType': 'DCU_MIN_QA_RESPONSE', 'team': draftQaTeam },
        { 'caseType': 'MIN', 'stageType': 'DCU_MIN_PRIVATE_OFFICE', 'team': privateMinisterTeam },
        { 'caseType': 'MIN', 'stageType': 'DCU_MIN_MINISTER_SIGN_OFF', 'team': privateMinisterTeam },
        { 'caseType': 'TRO', 'stageType': 'DCU_TRO_INITIAL_DRAFT', 'team': draftQaTeam },
        { 'caseType': 'TRO', 'stageType': 'DCU_TRO_QA_RESPONSE', 'team': draftQaTeam },
        { 'caseType': 'DTEN', 'stageType': 'DCU_DTEN_INITIAL_DRAFT', 'team': draftQaTeam },
        { 'caseType': 'DTEN', 'stageType': 'DCU_DTEN_QA_RESPONSE', 'team': draftQaTeam },
        { 'caseType': 'DTEN', 'stageType': 'DCU_DTEN_PRIVATE_OFFICE', 'team': privateMinisterTeam },
    ];

    Promise.all(TeamstoStageTypes.map(team => {
        infoService.post(`/topic/${topicValue}/team/${team.team}`, {
            'case_type': team.caseType,
            'stage_type': team.stageType
        }, { headers: User.createHeaders(req.user) })
            .then(() => {
            })
            .catch(error => {
                next(error);
            });
    }))
        .then(res.sendStatus(200))
        .catch(error => {
            next(error);
        });
}

async function getParentTopics(req, res, next) {
    try {
        const response = await infoService.get('/topic/parents', { headers: User.createHeaders(req.user) });
        res.locals.parentTopics = response.data;
        next();
    } catch (error) {
        next(error);
    }
}

async function returnTopicJson(_, res) {
    const { locals: { topic } } = res;
    await res.json(topic);
}

async function returnTopicsJson(_, res) {
    const { locals: { topics } } = res;
    await res.json(topics);
}

async function returnParentTopicsJson(_, res) {
    const { locals: { parentTopics } } = res;
    await res.json(parentTopics);
}

module.exports = {
    getTopic,
    getTopics,
    returnTopicJson,
    returnTopicsJson,
    addTopic,
    addParentTopic,
    getParentTopics,
    returnParentTopicsJson,
    addDCUTeamsToTopic
};
