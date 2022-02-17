export default {
    entityListName: 'FOI_INTERESTED_PARTIES',
    entityName: 'interested party',
    entityNamePlural: 'interested parties',
    entityNameCapitalised: 'Interested party',
    entityRoute: '/manage-foi-interested-parties',
    messages: {
        LOAD_ENTITIES_ERROR: 'There was an error retrieving the interested parties. Please try refreshing the page.',
        AMEND_ENTITY_ERROR_DESCRIPTION: 'Something went wrong while amending the interested party. Please try again.',
        AMEND_ENTITY_SUCCESS: 'The interested party was amended successfully',
        ADD_ENTITY_SUCCESS: 'The interested party was added successfully',
        DUPLICATE_ENTITY_ERROR_DESCRIPTION: 'An interested party with those details already exists',
        ADD_ENTITY_ERROR_DESCRIPTION: 'Something went wrong while adding the interested party. Please try again.'
    }
} as EntityDefinition;