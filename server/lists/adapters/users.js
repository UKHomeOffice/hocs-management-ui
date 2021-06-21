const byLabel = (a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase());

module.exports = async (data, { user, logger }) => {
    logger.debug('REQUEST_USERS', { users: data.length });
    return data
        .filter(u => u.id !== user.id)
        // When we do not have a firstName, or lastName we display an empty String, when we do not have an email we display the username,
        // when we only have an email/username we display it without brackets.
        .map(({ id, username, firstName, lastName, email }) => ({
            label: `${((firstName === null) ? '' : firstName + ' ')}` +
            `${((lastName === null) ? '' : lastName + ' ')}` +
            `${((email === null) ? (firstName === null && lastName === null) ? username : '(' + username + ')'
                : (firstName === null && lastName === null) ? email :  '(' + email + ')')}`,
            value: id
        }))
        .sort(byLabel);
};