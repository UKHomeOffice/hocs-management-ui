import React, { useContext } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Modal from 'react-modal';
import { ApplicationState, Context } from '../../contexts/application';
import { hasClientError } from '../../helpers/status-helpers';

const getDefaultExpiryDate = (defaultTimeoutSeconds: number) => new Date().getTime() + defaultTimeoutSeconds * 1000;
const getRemainingSeconds = (targetDate: number) => Math.floor((targetDate - new Date().getTime()) / 1000);

const keepAlive = () =>
    axios.get('/api/keepalive')
        .catch(() => window.location.reload());

const isTimingOut = (countDownForSeconds: number, remainingSeconds: number) => remainingSeconds < countDownForSeconds && remainingSeconds > 0;
const isTimedOut = (remainingSeconds: number) => remainingSeconds <= 0;
const getModalTitle = (remainingSeconds: number, timingOut: boolean) => timingOut ? `Your session will expire in ${remainingSeconds} seconds` : 'Your session has expired';
const getModalMessage = (timingOut: boolean) => timingOut ? 'We won\'t be able to save what you have done and you\'ll lose your progress. \n Click Continue to extend your session.' : 'You\'ll need to login again.';
const getButtonText = (timingOut: boolean) => timingOut ? 'Continue' : 'Return to login';

const SessionTimer = () => {
    const { layout: { countDownForSeconds, defaultTimeoutSeconds, header: { service } } = { countDownForSeconds: 0, defaultTimeoutSeconds: 0, header: { service: '' } } } = React.useContext(Context);
    // date stored as seconds since epoch to minimise conversions -or is it milliseconds?
    const [targetDate, setTargetDate] = React.useState<number>(getDefaultExpiryDate(defaultTimeoutSeconds));
    const [remainingSeconds, setRemainingSeconds] = React.useState(defaultTimeoutSeconds);

    const { error }: ApplicationState = useContext(Context);

    React.useEffect(() => {
        Modal.setAppElement('#app');

        axios.interceptors.response.use((response) => {
            const sessionTimeoutHeader = response.headers['x-auth-session-expiresat'];
            if (sessionTimeoutHeader && !isNaN(new Date(sessionTimeoutHeader).getTime())) {
                const expiresAt = new Date(sessionTimeoutHeader);
                setTargetDate(expiresAt.getTime());
            }
            return response;
        }, error => Promise.reject(error));

        // make sure we start with an up-to date expiry value;
        if(!hasClientError(error)) {
            // noinspection JSIgnoredPromiseFromCall
            keepAlive();
        }
    }, []);

    React.useEffect(() => {
        const interval = setInterval(() => {
            const diff = getRemainingSeconds(targetDate);
            setRemainingSeconds(diff);
            if (diff <= 0) {
                clearInterval(interval);
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [targetDate]);

    const onModalButtonClick = React.useCallback(() => {
        if (isTimingOut(countDownForSeconds, remainingSeconds)) {
            // need to call twice so that we can parse the updated refresh token
            keepAlive().then(() => keepAlive());
        } else {

            window.location.reload();
        }
    }, [remainingSeconds]);

    const timingOut = isTimingOut(countDownForSeconds, remainingSeconds);

    return <>
        {typeof window !== 'undefined' && <Helmet defer={false} titleTemplate={`${timingOut ? `${remainingSeconds}s remaining | ` : ''}%s`}>
            {<title>{service.toString()}</title>}
        </Helmet>}
        <Modal
            isOpen={timingOut || isTimedOut(remainingSeconds)}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={false}
            style={{
                overlay: {
                    backgroundColor: 'rgba(189, 189, 189, 0.75)',
                    display: 'flex',
                    zIndex: 3
                },
                content: {
                    border: 'none',
                    borderRadius: '0px',
                    margin: 'auto',
                    position: 'relative'
                }
            }} >
            <h2 className="govuk-heading-l">{getModalTitle(remainingSeconds, timingOut)}</h2>
            {getModalMessage(timingOut).split('\n').map((p, i) =>
                <p className="govuk-body" key={i}>{p}</p>
            )}
            <button className="govuk-button" onClick={onModalButtonClick}>
                {getButtonText(timingOut)}
            </button>
        </Modal>
    </>;
};

export default SessionTimer;
