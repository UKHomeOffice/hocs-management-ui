import React, { Reducer } from 'react';
import PageError from '../../models/pageError';
import { Action } from './actions';
import { reducer } from './reducer';
import { FormError } from '../../models/formError';
import ErrorMessage from 'shared/models/errorMessage';

const useError = (formErrorDescription?: string, formErrorTitle?: string)
    : [
        PageError,
        (formError: FormError) => void,
        () => void,
        (error: ErrorMessage) => void
    ] => {
    const [pageError, dispatch] = React.useReducer<Reducer<PageError, Action>>(reducer, {});

    const addFormError = (formError: FormError) => {
        if (formErrorDescription || formErrorTitle) {
            setMessage({ title: formErrorTitle || '', description: formErrorDescription || '' });
        }
        dispatch({ type: 'AddFormError', payload: formError });
    };
    const clearErrors = () => dispatch({ type: 'ClearError' });
    const setMessage = (errorMessage: ErrorMessage) => {
        dispatch({ type: 'SetDescription', payload: errorMessage.description });
        dispatch({ type: 'SetTitle', payload: errorMessage.title });
    };
    return [pageError, addFormError, clearErrors, setMessage];
};

export default useError;
