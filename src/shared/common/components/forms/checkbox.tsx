import React from 'react';
import classNames from 'classnames';
import InputEventData from '../../../models/inputEventData';

interface CheckboxProps {
    disabled?: boolean;
    error?: string;
    hint?: string;
    label?: string;
    name: string;
    updateState: (value: InputEventData) => void;
    value?: string;
    autoFocus?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ disabled = false,
    error,
    hint,
    name,
    label = name,
    updateState,
    value = 'false',
    autoFocus = false
}) => {

    const bChecked = value.toLowerCase() == 'true';

    return (
        <div className={classNames('govuk-form-group', { 'govuk-form-group--error': error })}>

            <label htmlFor={name} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>
            {hint && <div className="govuk-hint">{hint}</div>}
            {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}

            <input
                id={name}
                type='checkbox'
                name={name}
                disabled={disabled}
                autoFocus={autoFocus}
                checked={ bChecked }
                onChange={({ target: { name, checked } }) => {
                    updateState({ name, value: (!bChecked).toString() });
                }}
            />
        </div>
    );
};

export default Checkbox;
