const byDisplayName = (a, b) => a.displayName.toUpperCase().localeCompare(b.displayName.toUpperCase());

module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_UNITS', { units: data.length });
    return data
        .map(({ displayName, shortCode, type }) => ({
            displayName: displayName,
            shortCode: shortCode,
            type: type
        }))
        .sort(byDisplayName);
};