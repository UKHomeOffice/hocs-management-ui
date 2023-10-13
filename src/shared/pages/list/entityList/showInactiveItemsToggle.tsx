import React, { FormEvent, useCallback } from 'react';

interface ShowInactiveItemsToggleProps {
    inactiveCount: number;
    showInactive: boolean;
    onToggle: (flag: boolean) => void;
}

export const ShowInactiveItemsToggle = ({ inactiveCount, showInactive, onToggle }: ShowInactiveItemsToggleProps) => {
    const toggleShowInactive = useCallback((flag: boolean, event: FormEvent) => {
        event.preventDefault();
        onToggle(flag);
    }, [onToggle]);

    return <>
        {inactiveCount > 0 && !showInactive &&
            <p className="govuk-hint">
                {inactiveCount} inactive item{inactiveCount === 1 ? ' is' : 's are'} not being shown.{' '}
                <a href="#" onClick={event => toggleShowInactive(true, event)}>
                    Show inactive items
                </a>.
            </p>
        }
        {inactiveCount > 0 && showInactive &&
            <p className="govuk-hint">
                Showing {inactiveCount} inactive item{inactiveCount === 1 ? '' : 's'}.{' '}
                <a href="#" onClick={event => toggleShowInactive(false, event)}>
                    Hide inactive items
                </a>.
            </p>
        }
    </>;
};
