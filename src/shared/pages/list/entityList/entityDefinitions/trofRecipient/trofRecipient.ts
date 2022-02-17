export default {
    entityListName: 'TO_RECIPIENTS',
    entityName: 'recipient',
    entityNamePlural: 'recipients',
    entityNameCapitalised: 'Recipient',
    entityRoute: '/manage-trof-recipient',
    messages: {
        LOAD_ENTITIES_ERROR: 'There was an error retrieving recipients. Please try refreshing the page.',
        AMEND_ENTITY_ERROR_DESCRIPTION: 'Something went wrong while amending the recipient. Please try again.',
        AMEND_ENTITY_SUCCESS: 'The recipient was amended successfully',
        ADD_ENTITY_SUCCESS: 'The recipient was added successfully',
        DUPLICATE_ENTITY_ERROR_DESCRIPTION: 'A recipient with those details already exists',
        ADD_ENTITY_ERROR_DESCRIPTION: 'Something went wrong while adding the recipient. Please try again.'
    }
} as EntityDefinition;