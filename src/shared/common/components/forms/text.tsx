import React from 'react';
import classNames from 'classnames';
import InputEventData from '../../../models/inputEventData';

interface TextProps {
    disabled?: boolean;
    error?: string;
    hint?: string;
    label?: string;
    name: string;
    type?: string;
    updateState: (value: InputEventData) => void;
    value?: string;
    autoFocus?: boolean;
}

const Text: React.FC<TextProps> = ({ disabled = false,
    error,
    hint,
    name,
    label = name,
    type = 'text',
    updateState,
    value = '',
    autoFocus = false
}) => {

    return (
        <div className={classNames('govuk-form-group', { 'govuk-form-group--error': error })}>

            <label htmlFor={name} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>
            {hint && <div className="govuk-hint">{hint}</div>}
            {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}

            <input className={classNames('govuk-input', { 'govuk-input--error': error })}
                id={name}
                type={type}
                name={name}
                disabled={disabled}
                value={value}
                autoFocus={autoFocus}
                onChange={({ target: { name, value } }) => updateState({ name, value })}
            />
        </div>
    );
};

export default Text;
