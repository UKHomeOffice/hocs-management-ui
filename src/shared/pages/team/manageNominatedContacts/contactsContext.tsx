import React, { Dispatch, Reducer } from 'react';
import { State } from './state';
import { Action } from './actions';
import { reducer } from './reducer';
import { initialState } from './initialState';

const ContactsContext = React.createContext<{state: State, dispatch: Dispatch<Action>; }>({ state: initialState, dispatch: () => {} });

interface Props {
    children: React.ReactNode;
}

const ContactsProvider: React.FC<Props> = ({ children }) => {
    const [ state, dispatch ] = React.useReducer<Reducer<State, Action>>(reducer, initialState);

    return (
        <ContactsContext.Provider value={{ state, dispatch }}>
            {children}
        </ContactsContext.Provider>
    );
};

export { ContactsContext, ContactsProvider };
