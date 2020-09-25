import Error, { ErrorContent } from '../../layouts/error';
import Dashboard from '../../pages/dashboard';
import TeamSearch from '../../pages/team/teamSearch/teamSearch';
import TeamView from '../../pages/team/teamView/teamView';
import AddUsersToTeam from '../../pages/team/addToTeam/addToTeam';
import AddUnit from '../../pages/unit/addUnit';
import TopicView from '../../pages/topic/topicView/topicView';
import TopicSearch from '../../pages/topic/topicSearch/topicSearch';
import AddChildTopic from '../../pages/topic/addChildTopic/addChildTopic';
import AddParentTopic from '../../pages/topic/addParentTopic/addParentTopic';
import AddTeamsToTopic from '../../pages/topic/addTeamsToTopic/addTeamsToTopic';
import UnitSearch from '../../pages/unit/unitSearch/unitSearch';
import AddStandardLine from '../../pages/standardLineAdd/addStandardLine';
import AmendStandardLine from '../../pages/standardLineAmend/amendStandardLine';
import StandardLinesView from '../../pages/standardLineManage/standardLinesView';
import AddTemplate from '../../pages/template/addTemplate';
import AddNominatedContact from '../../pages/team/addNominatedContact/addNominatedContact';
import SelectCaseType from '../../pages/template/selectCaseType';
import CaseTypeView from '../../pages/template/caseTypeView';
import UserSearch from '../../pages/user/userSearch/userSearch';
import UserView from '../../pages/user/userView/userView';
import AddTeamToUser from '../../pages/user/addTeamToUser/addTeamToUser';
import WithdrawCase from '../../pages/case/withdrawCase';
import CampaignsView from '../../pages/list/mpamCampaign/campaignsView';
import AddCampaign from '../../pages/list/mpamCampaign/addCampaign';
import AmendCampaign from '../../pages/list/mpamCampaign/amendCampaign';

export interface Route {
    component: React.FunctionComponent | Error;
    error?: ErrorContent;
    exact: boolean;
    path: string;
    title: string;
}
const routes = [
    {
        path: '/',
        exact: true,
        component: Dashboard,
        title: 'Dashboard'
    },
    {
        path: '/user-search',
        exact: true,
        component: UserSearch,
        title: 'UserSearch'
    },
    {
        path: '/user-view/:userId',
        exact: true,
        component: UserView,
        title: 'UserView'
    },
    {
        path: '/user/:userId/add-teams',
        exact: true,
        component: AddTeamToUser,
        title: 'AddTeamToUser'
    },
    {
        path: '/team-search',
        exact: true,
        component: TeamSearch,
        title: 'TeamSearch'
    },
    {
        path: '/team-view/:teamId',
        exact: true,
        component: TeamView,
        title: 'TeamView'
    },
    {
        path: '/team/:teamId/add-users',
        exact: true,
        component: AddUsersToTeam,
        title: 'AddUsersToTeam'
    },
    {
        path: '/add-unit',
        exact: true,
        component: AddUnit,
        title: 'Add Unit'
    },
    {
        path: '/topic-to-team',
        exact: true,
        component: TopicSearch,
        title: 'TopicSearch'
    },
    {
        path: '/topic/:topicId',
        exact: true,
        component: TopicView,
        title: 'TopicView'
    },
    {
        path: '/topic/:topicValue/private-minister/:privateMinisterValue/draft-qa/:draftQaValue',
        exact: true,
        component: AddTeamsToTopic,
        title: 'AddTeamsToTopic'
    },
    {
        path: '/add-child-topic',
        exact: true,
        component: AddChildTopic,
        title: 'Add Child Topic'
    },
    {
        path: '/add-parent-topic',
        exact: true,
        component: AddParentTopic,
        title: 'Add Parent Topic'
    },
    {
        path: '/manage-standard-lines',
        exact: true,
        component: StandardLinesView,
        title: 'Manage Standard Lines'
    },
    {
        path: '/add-standard-line',
        exact: true,
        component: AddStandardLine,
        title: 'Add Standard Line'
    },
    {
        path: '/manage-standard-lines/:standardLineUUID/amend',
        exact: true,
        component: AmendStandardLine,
        title: 'Amend Standard Line'
    },
    {
        path: '/unit-search',
        exact: true,
        component: UnitSearch,
        title: 'UnitSearch'
    },
    {
        path: '/team/:teamId/add-nominated-contact',
        exact: true,
        component: AddNominatedContact,
        title: 'Add Nominated Contact'
    },
    {
        path: '/case-types',
        exact: true,
        component: SelectCaseType,
        title: 'Select a Case Type'
    },
    {
        path: '/case-type/:type',
        exact: true,
        component: CaseTypeView,
        title: 'View Case Type'
    },
    {
        path: '/case-type/:type/add-template',
        exact: true,
        component: AddTemplate,
        title: 'Add Template'
    },
    {
        path: '/case-withdraw',
        exact: true,
        component: WithdrawCase,
        title: 'Withdraw a case'
    },
    {
        path: '/manage-mpam-campaigns',
        exact: true,
        component: CampaignsView,
        title: 'Manage MPAM campaigns'
    },
    {
        path: '/manage-mpam-campaigns/add',
        exact: true,
        component: AddCampaign,
        title: 'Add Campaign'
    },
    {
        path: '/manage-mpam-campaigns/:itemUUID/amend',
        exact: true,
        component: AmendCampaign,
        title: 'Amend Campaign'
    },
    {
        component: Error,
        error: {
            location: {
                pathname: ''
            },
            message: '',
            stack: '',
            status: 404,
            title: ''
        }
    }
];

export default routes;
