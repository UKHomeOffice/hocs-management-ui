import React, { useEffect, Reducer, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import TypeAhead from '../../../common/components/typeAhead';
import { History } from 'history';
import { State } from './state';
import { Action } from './actions';
import { reducer } from './reducer';
import { initialState } from './initialState';
import useError from '../../../hooks/useError';
import ErrorSummary from '../../../common/components/errorSummary';
import {
    GENERAL_ERROR_TITLE,
    LOAD_TEAMS_ERROR_DESCRIPTION,
    LOAD_TOPIC_ERROR_DESCRIPTION,
    VALIDATION_ERROR_TITLE
} from '../../../models/constants';
import { getTopic } from '../../../services/topicsService';
import ErrorMessage from '../../../models/errorMessage';
import Item from '../../../models/item';
import { Link } from 'react-router-dom';
import Submit from '../../../common/components/forms/submit';
import { getTeams } from '../../../services/teamsService';
import { validate } from '../../../validation';
import { object } from 'yup';

interface MatchParams {
    topicId: string;
}

interface TeamViewProps extends RouteComponentProps<MatchParams> {
    csrfToken?: string;
    history: History;
}

const validationSchema = object({
    draftQATeam: object()
        .required()
        .label('team for Initial Draft and QA response stages'),
    privateMinisterTeam: object()
        .required()
        .label('team for Private Office and Minister sign off stages')
});

const TopicView: React.FC<TeamViewProps> = ({ csrfToken, history, match }) => {

    const [pageError, addFormError, clearErrors , setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);

    const { params: { topicId } } = match;

    useEffect(() => {
        getTopic(topicId)
            .then((topic: Item) => { dispatch({ type: 'SetTopic', payload: topic }); })
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_TOPIC_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
    }, []);

    const getTeamsForTypeahead = useCallback(() => new Promise<Item[]>((resolve) => {
        getTeams()
            .then((teams: Item[]) => {
                resolve(teams);
            })
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_TEAMS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                resolve([]);
            });
    }), []);

    const onSelectedPrivateMinisterChange = (selectedTeamAssignment: Item) => {
        dispatch({ type: 'SetPrivateMinisterTeam', payload: selectedTeamAssignment });
    };

    const onSelectedDraftQAChange = (selectedTeamAssignment: Item) => {
        dispatch({ type: 'SetDraftQATeam', payload: selectedTeamAssignment });
    };

    const handleOnSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, state, addFormError)) {
            if (state.privateMinisterTeam && state.draftQATeam) {
                history.push(`/topic/${state.topic.value}/private-minister/${state.privateMinisterTeam.value}/draft-qa/${state.draftQATeam.value}`);
            }
        }
    };

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to="/topic-to-team" className="govuk-back-link">Back</Link>
                    <ErrorSummary pageError={pageError} />
                    <h1 className="govuk-heading-xl">
                        Topic View
                    </h1>
                    <h2 className="govuk-heading-l">
                        {`Topic: ${state.topic.label}`}
                    </h2>
                </div>
            </div>
            <div className="govuk-form-group">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-one-half-from-desktop">
                        <form method="POST" onSubmit={handleOnSubmit}>
                            <input type="hidden" name="_csrf" value={csrfToken} />
                            <TypeAhead
                                clearable={true}
                                disabled={false}
                                getOptions={getTeamsForTypeahead}
                                label={'Select team assignment for Initial Draft and QA response stages'}
                                name={'draft-qa'}
                                onSelectedItemChange={onSelectedDraftQAChange}
                            />
                            <TypeAhead
                                clearable={true}
                                disabled={false}
                                getOptions={getTeamsForTypeahead}
                                label={'Select team assignment for Private Office and Minister sign off stages'}
                                name={'private-minister'}
                                onSelectedItemChange={onSelectedPrivateMinisterChange}
                            />
                            <Submit />
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TopicView;
