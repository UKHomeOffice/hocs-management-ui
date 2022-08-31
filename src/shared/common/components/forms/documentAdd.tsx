import React, { Fragment } from 'react';
import InputEventData from '../../../models/inputEventData';

interface DocumentAddProps {
    allowMultiple?: boolean;
    disabled?: boolean;
    error?: string;
    hint?: string;
    label?: string;
    name: string;
    updateState: (files: InputEventData) => void;
}

const DocumentAdd: React.FC<DocumentAddProps> = ({ allowMultiple, disabled, error, hint, label = 'Add document', name, updateState }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        updateState({ name, value: Array.from(e.target.files || []) });
    };

    return (
        <Fragment>
            <div className={'govuk-form-group'}>
                <label className="govuk-label" htmlFor={name} id={`${name}-label`}>
                    <label htmlFor={name} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>
                    {hint && <div className="govuk-hint">{hint}</div>}
                    {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}
                </label>
                <input
                    className="govuk-file-upload"
                    type={'file'}
                    id={name}
                    name={name}
                    onChange={e => handleChange(e)}
                    multiple={allowMultiple}
                    disabled={disabled}
                />
            </div>
        </Fragment>
    );
};

export default DocumentAdd;
