import React from 'react';
import classNames from 'classnames';
import InputEventData from '../../../models/inputEventData';

interface TextProps {
    disabled?: boolean;
    rows?: number;
    error?: string;
    hint?: string;
    label?: string;
    name: string;
    type?: string;
    updateState: (value: InputEventData) => void;
    value?: string;
}

const TextArea: React.FC<TextProps> = ({ disabled = false,
    rows = 5,
    error,
    hint,
    name,
    label = name,
    updateState,
    value = ''
}) => {

    return (
        <div className={classNames('govuk-form-group', { 'govuk-form-group--error': error })}>

            <label htmlFor={name} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>
            {hint && <div className="govuk-hint">{hint}</div>}
            {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}

            <textarea className={classNames('govuk-textarea', { 'govuk-input--error': error })}
                id={name}
                rows={rows}
                name={name}
                disabled={disabled}
                value={value}
                onChange={({ target: { name, value } }) => updateState({ name, value })}
            />
        </div>
    );
};

export default TextArea;
