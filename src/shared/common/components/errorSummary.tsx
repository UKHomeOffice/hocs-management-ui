import React, { useEffect } from 'react';
import PageError from '../../models/pageError';

interface ErrorSummaryProps {
    pageError: PageError;
}

const ErrorSummary: React.FC<ErrorSummaryProps> = ({ pageError: { error } }) => {
    const componentRef = React.createRef<HTMLDivElement>();

    useEffect(() => {
        if(componentRef && componentRef.current) {
            componentRef.current.scrollIntoView();
        }
    }, [error]);

    if (error) {
        const { formErrors: errors, description, title: heading } = error;

        return (
            <div className="govuk-error-summary" role="alert" aria-labelledby="error-summary-heading-example-1" tabIndex={-1} ref={componentRef}>
                <h2 className="govuk-error-summary__title" id="error-summary-heading-example-1">
                    {heading}
                </h2>
                <div className="govuk-error-summary__body">
                    {description && <p>
                        {description}
                    </p>}
                    {errors &&
                        <ul className="govuk-list govuk-error-summary__list">
                            {errors.map(({ key, value }) => {
                                const link = `${key}-error`;
                                return (
                                    <li key={key}>
                                        <a href={`#${link}`} onClick={scrollInToView.bind(null, link)} >{value}</a>
                                    </li>
                                );
                            })}
                        </ul>
                    }
                </div>
            </div>
        );
    }
    return null;

};

const scrollInToView = (link: string, e: React.FormEvent<HTMLLinkElement>) => {
    e.preventDefault();
    const element = document.getElementById(link);
    if (element) {
        element.scrollIntoView();
    }
};

export default ErrorSummary;
