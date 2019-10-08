import Error, { ErrorContent } from '../../layouts/error';
import Dashboard from '../../pages/dashboard';
import TeamSearch from '../../pages/team/teamSearch/teamSearch';
import TeamView from '../../pages/team/teamView/teamView';
import AddUsersToTeam from '../../pages/team/addToTeam/addToTeam';
import AddUnit from '../../pages/unit/addUnit';
import UnitSearch from '../../pages/unit/unitSearch/unitSearch';

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
        path: '/unit-search',
        exact: true,
        component: UnitSearch,
        title: 'UnitSearch'
    },
    {
        component: Error,
        error: {
            location: {
                pathname: ''
            },
            message: '',
            stack: '',
            status: 401,
            title: ''
        }
    }
];

export default routes;
