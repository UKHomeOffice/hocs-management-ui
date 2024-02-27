import Error, { ErrorContent } from '../../layouts/error';
import Dashboard from '../../pages/dashboard/dashboard';
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
import ManageNominatedContacts from '../../pages/team/manageNominatedContacts/manageNominatedContacts';
import SelectCaseType from '../../pages/template/selectCaseType';
import CaseTypeView from '../../pages/template/caseTypeView';
import UserSearch from '../../pages/user/userSearch/userSearch';
import UserView from '../../pages/user/userView/userView';
import AddUser from '../../pages/user/userAdd/addUser';
import AmendUser from '../../pages/user/userAmend/amendUser';
import AddTeamToUser from '../../pages/user/addTeamToUser/addTeamToUser';
import ArchiveCase from '../../pages/case/archiveCase';
import WithdrawCase from '../../pages/case/withdrawCase';
import ExGratiaView from '../../pages/list/exGratiaBusinessReps/exgratiaBusRepsView';
import ChooseBusinessArea from '../../pages/list/mpamBusinessUnits/selectBusinessArea';
import ChooseCompUKVIBusinessArea from '../../pages/list/compUKVIBusinessAreas/selectCompUKVIBusinessArea';
import ComplaintsBusinessAreaView from '../../pages/list/compUKVIBusinessAreas/compBusinessAreaView';
import AddCompBusinessArea from '../../pages/list/compUKVIBusinessAreas/addCompBusinessArea';
import AmendCompBusinessArea from '../../pages/list/compUKVIBusinessAreas/amendCompBusinessArea';
import AddBusinessRep from '../../pages/list/exGratiaBusinessReps/addBusinessRep';
import AddTeam from '../../pages/team/addTeam/addTeam';
import EditTeam from '../../pages/team/editTeam/editTeam';
import ReactivateTeam from '../../pages/team/reactivateTeam/reactivateTeam';
import DeactivateTeam from '../../pages/team/deactivateTeam/deactivateTeam';
import BusinessAreaView from '../../pages/list/mpamBusinessUnits/businessAreaView';
import AddBusinessUnit from '../../pages/list/mpamBusinessUnits/addBusinessUnit';
import SelectBusinessArea from '../../pages/list/mpamBusinessUnits/selectBusinessArea';
import AmendBusinessUnit from '../../pages/list/mpamBusinessUnits/amendBusinessUnit';
import SelectEnquirySubject from '../../pages/list/mpamEnquiryReasons/selectEnquirySubject';
import EnquirySubjectView from '../../pages/list/mpamEnquiryReasons/enquirySubjectView';
import AddEnquiryReason from '../../pages/list/mpamEnquiryReasons/addEnquiryReason';
import AmendEnquiryReason from '../../pages/list/mpamEnquiryReasons/amendEnquiryReason';
import EntityListView from '../../pages/list/entityList/entityListView';
import AmendEntity from '../../pages/list/entityList/amendEntity';
import AddEntity from '../../pages/list/entityList/addEntity';
import foiAccountManager from '../../pages/list/entityList/entityDefinitions/foiAccountManager/foiAccountManager';
import mpamCampaign from '../../pages/list/entityList/entityDefinitions/mpamCampaign/mpamCampaign';
import foiInterestedParty from '../../pages/list/entityList/entityDefinitions/foiExternalInterest/foiInterestedParty';
import trofCampaign from '../../pages/list/entityList/entityDefinitions/trofCampaign/trofCampaign';
import trofRecipient from '../../pages/list/entityList/entityDefinitions/trofRecipient/trofRecipient';
import ukviEnquiryReason from '../../pages/list/entityList/entityDefinitions/ukviEnquiryReason/ukviEnquiryReason';

export interface Route {
    requiredRole: string,
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
        title: 'User search'
    },
    {
        path: '/user-view/:userId',
        exact: true,
        component: UserView,
        title: 'Manage user'
    },
    {
        path: '/add-user',
        exact: true,
        component: AddUser,
        title: 'Add a user'
    },
    {
        path: '/user/:userUUID/amend',
        exact: true,
        component: AmendUser,
        title: 'Amend user details'
    },
    {
        path: '/user/:userId/add-teams',
        exact: true,
        component: AddTeamToUser,
        title: 'Add teams'
    },
    {
        path: '/team-search',
        exact: true,
        component: TeamSearch,
        title: 'Team search'
    },
    {
        path: '/add-team',
        exact: true,
        component: AddTeam,
        title: 'Create a DCU drafting team'
    },
    {
        path: '/team-view/:teamId',
        exact: true,
        component: TeamView,
        title: 'Manage team'
    },
    {
        path: '/team/:teamId/add-users',
        exact: true,
        component: AddUsersToTeam,
        title: 'Add users to team'
    },
    {
        path: '/team/:teamId/edit',
        exact: true,
        component: EditTeam,
        title: 'Edit team'
    },
    {
        path: '/team/:teamId/reactivate',
        exact: true,
        component: ReactivateTeam,
        title: 'Reactivate Team',
        requiredRole: 'ACTIVATE_TEAM'
    },
    {
        path: '/team/:teamId/deactivate',
        exact: true,
        component: DeactivateTeam,
        title: 'Deactivate team',
        requiredRole: 'DEACTIVATE_TEAM'
    },
    {
        path: '/add-unit',
        exact: true,
        component: AddUnit,
        title: 'Add unit'
    },
    {
        path: '/topic-to-team',
        exact: true,
        component: TopicSearch,
        title: 'Topic search'
    },
    {
        path: '/topic/:topicId',
        exact: true,
        component: TopicView,
        title: 'Topic view'
    },
    {
        path: '/topic/:topicValue/private-minister/:privateMinisterValue/draft-qa/:draftQaValue',
        exact: true,
        component: AddTeamsToTopic,
        title: 'Add teams to topic'
    },
    {
        path: '/add-child-topic',
        exact: true,
        component: AddChildTopic,
        title: 'Add child topic'
    },
    {
        path: '/add-parent-topic',
        exact: true,
        component: AddParentTopic,
        title: 'Add parent topic'
    },
    {
        path: '/manage-standard-lines',
        exact: true,
        component: StandardLinesView,
        title: 'Manage standard lines'
    },
    {
        path: '/add-standard-line',
        exact: true,
        component: AddStandardLine,
        title: 'Add standard line'
    },
    {
        path: '/manage-standard-lines/:standardLineUUID/amend',
        exact: true,
        component: AmendStandardLine,
        title: 'Amend standard line'
    },
    {
        path: '/unit-search',
        exact: true,
        component: UnitSearch,
        title: 'Units'
    },
    {
        path: '/team/:teamId/manage-nominated-contacts',
        exact: true,
        component: ManageNominatedContacts,
        title: 'Manage nominated contacts'
    },
    {
        path: '/case-types',
        exact: true,
        component: SelectCaseType,
        title: 'Select a case type'
    },
    {
        path: '/case-type/:type',
        exact: true,
        component: CaseTypeView,
        title: 'View case type'
    },
    {
        path: '/case-type/:type/add-template',
        exact: true,
        component: AddTemplate,
        title: 'Add template'
    },
    {
        path: '/case-archive',
        exact: true,
        component: ArchiveCase,
        title: 'Archive a case',
        label: 'Archive',
        deleted: true,
        requiredRole: 'MUI_CASE_ARCHIVING'
    },
    {
        path: '/case-unarchive',
        exact: true,
        component: ArchiveCase,
        title: 'Unarchive a case',
        label: 'Unarchive',
        deleted: false,
        requiredRole: 'MUI_CASE_ARCHIVING'
    },
    {
        path: '/case-withdraw',
        exact: true,
        component: WithdrawCase,
        title: 'Withdraw a case'
    },
    {
        path: '/manage-foi-account-managers',
        exact: true,
        component: EntityListView(foiAccountManager),
        title: 'Manage FOI account managers'
    },
    {
        path: '/manage-foi-account-managers/add',
        exact: true,
        component: AddEntity(foiAccountManager),
        title: 'Add account manager'
    },
    {
        path: '/manage-foi-account-managers/:itemUUID/amend',
        exact: true,
        component: AmendEntity(foiAccountManager),
        title: 'Amend account manager'
    },
    {
        path: '/manage-foi-interested-parties',
        exact: true,
        component: EntityListView(foiInterestedParty),
        title: 'Manage FOI interested parties'
    },
    {
        path: '/manage-foi-interested-parties/add',
        exact: true,
        component: AddEntity(foiInterestedParty),
        title: 'Add interested party'
    },
    {
        path: '/manage-foi-interested-parties/:itemUUID/amend',
        exact: true,
        component: AmendEntity(foiInterestedParty),
        title: 'Amend interested party'
    },
    {
        path: '/manage-mpam-campaigns',
        exact: true,
        component: EntityListView(mpamCampaign),
        title: 'Manage MPAM campaigns'
    },
    {
        path: '/manage-mpam-campaigns/add',
        exact: true,
        component: AddEntity(mpamCampaign),
        title: 'Add campaign'
    },
    {
        path: '/manage-ukvi-enquiry-reasons',
        exact: true,
        component: EntityListView(ukviEnquiryReason),
        title: 'Manage UKVI enquiry reasons',
        requiredRole: 'UKVI'
    },
    {
        path: '/manage-ukvi-enquiry-reasons/add',
        exact: true,
        component: AddEntity(ukviEnquiryReason),
        title: 'Add UKVI enquiry reason',
        requiredRole: 'UKVI'
    },
    {
        path: '/manage-ukvi-enquiry-reasons/:itemUUID/amend',
        exact: true,
        component: AmendEntity(ukviEnquiryReason),
        title: 'Amend UKVI enquiry reason',
        requiredRole: 'UKVI'
    },
    {
        path: '/manage-trof-campaigns',
        exact: true,
        component: EntityListView(trofCampaign),
        title: 'Manage Treat Official campaigns'
    },
    {
        path: '/manage-trof-campaigns/add',
        exact: true,
        component: AddEntity(trofCampaign),
        title: 'Add campaign'
    },
    {
        path: '/manage-exgratia-reps',
        exact: true,
        component: ExGratiaView,
        title: 'Manage ex-gratia business representatives'
    },
    {
        path: '/manage-exgratia-reps/add',
        exact: true,
        component: AddBusinessRep,
        title: 'Add ex-gratia business representatives'
    },
    {
        path: '/manage-mpam-campaigns/:itemUUID/amend',
        exact: true,
        component: AmendEntity(mpamCampaign),
        title: 'Amend campaign'
    },
    {
        path: '/manage-trof-campaigns/:itemUUID/amend',
        exact: true,
        component: AmendEntity(trofCampaign),
        title: 'Amend campaign'
    },
    {
        path: '/manage-trof-recipient',
        exact: true,
        component: EntityListView(trofRecipient),
        title: 'Manage Treat Official recipient'
    },
    {
        path: '/manage-trof-recipient/add',
        exact: true,
        component: AddEntity(trofRecipient),
        title: 'Add recipient'
    },
    {
        path: '/manage-trof-recipient/:itemUUID/amend',
        exact: true,
        component: AmendEntity(trofRecipient),
        title: 'Amend recipient'
    },
    {
        path: '/manage-mpam-business-units',
        exact: true,
        component: ChooseBusinessArea,
        title: 'Manage MPAM business units'
    },
    {
        path: '/manage-comp-ukvi-bus-area',
        exact: true,
        component: ChooseCompUKVIBusinessArea,
        title: 'Manage complaints UKVI business areas',
        requiredRole: 'UKVI'
    },
    {
        path: '/comp-business-area/:type',
        exact: true,
        component: ComplaintsBusinessAreaView,
        title: 'View complaints business area',
        requiredRole: 'UKVI'
    },
    {
        path: '/add-comp-business-area/:type',
        exact: true,
        component: AddCompBusinessArea,
        title: 'Add complaint business area',
        requiredRole: 'UKVI'
    },
    {
        path: '/amend-comp-business-area/:type/:itemUUID/',
        exact: true,
        component: AmendCompBusinessArea,
        title: 'Amend complaint business area',
        requiredRole: 'UKVI'
    },
    {
        path: '/business-area/:type',
        exact: true,
        component: BusinessAreaView,
        title: 'View business area'
    },
    {
        path: '/add-business-unit/:type',
        exact: true,
        component: AddBusinessUnit,
        title: 'Add business unit'
    },
    {
        path: '/select-business-area',
        exact: true,
        component: SelectBusinessArea,
        title: 'Select business area'
    },
    {
        path: '/amend-business-unit/:type/:itemUUID/',
        exact: true,
        component: AmendBusinessUnit,
        title: 'Amend business unit'
    },
    {
        path: '/manage-mpam-enquiry-reasons',
        exact: true,
        component: SelectEnquirySubject,
        title: 'Select enquiry subject'
    },
    {
        path: '/enquiry-subject/:subject',
        exact: true,
        component: EnquirySubjectView,
        title: 'View enquiry subject'
    },
    {
        path: '/add-enquiry-reason/:subject',
        exact: true,
        component: AddEnquiryReason,
        title: 'Add enquiry reason'
    },
    {
        path: '/amend-enquiry-reason/:subject/:itemUUID/',
        exact: true,
        component: AmendEnquiryReason,
        title: 'Amend enquiry reason'
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
