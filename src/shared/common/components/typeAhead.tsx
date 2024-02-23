import React, { Component } from 'react';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import Item from '../../models/item';

interface TypeAheadProps {
    clearable?: boolean;
    disabled?: boolean;
    error?: string;
    getOptions: () => Promise<Item[]>;
    hint?: string;
    label?: string;
    name: string;
    onSelectedItemChange: (newItem: Item) => void;
    value?: Item;
}

interface TypeAheadState {
    componentMounted: boolean;
    cachedOptions?: Item[];
}

class TypeAhead extends Component<TypeAheadProps, TypeAheadState> {

    constructor(props: TypeAheadProps) {
        super(props);
        this.state = {
            componentMounted: false
        };
    }

    componentDidMount() {
        this.setState({ componentMounted: true });
    }

    handleChange(selectedItem: Item) {
        this.props.onSelectedItemChange(selectedItem);
    }

    filterItems = (inputValue: string, items: Item[]) => items
        .filter(item => item
            .label
            .toLocaleLowerCase()
            .indexOf(inputValue?.toLocaleLowerCase().trim()) !== -1);

    promiseOptions = (inputValue: string) =>
        new Promise<Item[]>((resolve) => {
            if (this.state.cachedOptions) {
                resolve(this.filterItems(inputValue, this.state.cachedOptions));
            } else {
                // todo: remove !
                this.props.getOptions!().then((choices: Item[]) => {
                    this.setState(prevState => ({ ...prevState, cachedOptions: choices }));
                    resolve(this.filterItems(inputValue, choices));
                });
            }
        });

    render() {
        const {
            clearable = true,
            disabled = false,
            error,
            hint,
            label,
            name,
            value
        } = this.props;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
                <label htmlFor={`${name}-input`} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>
                {hint && <div className="govuk-hint">{hint}</div>}
                {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}
                <AsyncSelect<Item>
                    cacheOptions
                    classNamePrefix="govuk-typeahead"
                    components={{
                        Control: props => (
                            <components.Control
                                className={error ? ' govuk-typeahead__control--error' : undefined}
                                {...props}
                            />
                        )
                    }}
                    defaultOptions
                    id={name}
                    inputId={`${name}-input`}
                    isDisabled={disabled}
                    isClearable={clearable}
                    loadOptions={this.promiseOptions}
                    noOptionsMessage={() => 'No matches'}
                    onChange={this.handleChange.bind(this)}
                    options={[]}
                    placeholder="Search"
                    styles={{
                        control: () => ({}),
                        indicatorSeparator: () => ({}),
                        dropdownIndicator: () => ({}),
                        menu: () => ({}),
                        menuList: () => ({}),
                        groupHeading: () => ({}),
                        option: () => ({}),
                        valueContainer: () => ({}),
                        placeholder: () => ({})
                    }}
                    value={value}
                />
            </div >
        );
    }
}

export default TypeAhead;
