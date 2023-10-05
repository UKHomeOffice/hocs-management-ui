import React, { Component } from 'react';
import InputEventData from 'shared/models/inputEventData';

interface DateInputProps {
    disabled?: boolean;
    error?: string;
    hint?: string;
    label?: string;
    name: string;
    updateState: (datePart: InputEventData) => void;
    value?: string;
    maxYear?: number;
    minYear?: number;
}

class DateInput extends Component<DateInputProps> {

    constructor(props: DateInputProps) {
        super(props);
        this.state = this.parseValue(props.value || '');
    }

    onChange(field: string, value: string) {
        this.setState({ [field]: value }, () => {
            this.props.updateState({ name: this.props.name, value: `${this.state[this.datePart('year')]}-${this.state[this.datePart('month')]}-${this.state[this.datePart('day')]}` });
        });
    }

    datePart(field: string) { return `${this.props.name}-${field}`; }

    parseValue(value: string) {
        const parts = value && value.split('-');
        return {
            [this.datePart('day')]: parts && parts[2] || '',
            [this.datePart('month')]: parts && parts[1] || '',
            [this.datePart('year')]: parts && parts[0] || ''
        };
    }

    render() {
        const {
            name,
            disabled,
            error,
            hint,
            label,
            minYear = 1900,
            maxYear = (new Date().getFullYear() + 100)
        } = this.props;
        return <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
            <fieldset id={name} disabled={disabled} className="govuk-fieldset" role="group">
                <legend className="govuk-fieldset__legend govuk-label--s">{label}</legend>
                {hint && <div className="govuk-hint">{hint}</div>}
                {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}
                <div className="govuk-date-input">
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={this.datePart('day')}>Day</label>
                            <input
                                className={`govuk-input govuk-date-input__input govuk-input--width-2 ${error ? 'govuk-input--error' : ''}`}
                                id={this.datePart('day')}
                                name={this.datePart('day')}
                                type="text"
                                inputMode="numeric"
                                min="1"
                                max="31"
                                value={this.state[this.datePart('day')]}
                                onChange={e => this.onChange(this.datePart('day'), e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={this.datePart('month')}>Month</label>
                            <input
                                className={`govuk-input govuk-date-input__input govuk-input--width-2 ${error ? 'govuk-input--error' : ''}`}
                                id={this.datePart('month')}
                                name={this.datePart('month')}
                                type="number"
                                pattern="[0-9]*"
                                min="1"
                                max="12"
                                value={this.state[this.datePart('month')]}
                                onChange={e => this.onChange(this.datePart('month'), e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={this.datePart('year')}>Year</label>
                            <input
                                className={`govuk-input govuk-date-input__input govuk-input--width-4  ${error ? 'govuk-input--error' : ''}`}
                                id={this.datePart('year')}
                                name={this.datePart('year')}
                                type="number"
                                pattern="[0-9]*"
                                min={minYear}
                                max={maxYear}
                                value={this.state[this.datePart('year')]}
                                onChange={e => this.onChange(this.datePart('year'), e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>;
    }
}

export default DateInput;
