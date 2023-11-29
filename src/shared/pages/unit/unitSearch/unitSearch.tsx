import React, { useEffect, useState } from 'react';
import { History } from 'history';
import ErrorSummary from '../../../common/components/errorSummary';
import useError from '../../../hooks/useError';
import { Link } from 'react-router-dom';
import { getUnits } from '../../../services/unitsService';
import Unit from 'shared/models/unit';

interface UnitSearchProps {
    history: History;
}

const UnitSearch: React.FC<UnitSearchProps> = ({ history }) => {

    const [pageError] = useError();
    const [units, setUnit] = useState<Unit[]>();

    useEffect(() => {
        getUnits()
            .then(choices => setUnit(choices));
    }, []);

    return (
        <div className="govuk-form-group">
            <Link className="govuk-back-link" to="/">Back</Link>
            <ErrorSummary pageError={pageError} />
            <h1 className="govuk-heading-xl">Units</h1>
            <ul>
                {units && units.map(unit => (
                    <li className="govuk-list govuk-list--bullet govuk-list margin-bottom--small" key={unit.shortCode}>
                        {unit.displayName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UnitSearch;
