export default {
    entityListName: 'FOI_ACCOUNT_MANAGERS',
    entityName: 'account manager',
    entityNamePlural: 'account managers',
    entityNameCapitalised: 'Account manager',
    entityRoute: '/manage-foi-account-managers',
    messages: {
        LOAD_ENTITIES_ERROR: 'There was an error retrieving account managers. Please try refreshing the page.',
        AMEND_ENTITY_ERROR_DESCRIPTION: 'Something went wrong while amending the account manager. Please try again.',
        AMEND_ENTITY_SUCCESS: 'The account manager was amended successfully',
        ADD_ENTITY_SUCCESS: 'The account manager was added successfully',
        DUPLICATE_ENTITY_ERROR_DESCRIPTION: 'An account manager with those details already exists',
        ADD_ENTITY_ERROR_DESCRIPTION: 'Something went wrong while adding the account manager. Please try again.'
    }
} as EntityDefinition;