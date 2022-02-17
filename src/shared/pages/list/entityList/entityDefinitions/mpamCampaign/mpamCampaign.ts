export default {
    entityListName: 'MPAM_CAMPAIGNS',
    entityName: 'campaign',
    entityNamePlural: 'campaigns',
    entityNameCapitalised: 'Campaign',
    entityRoute: '/manage-mpam-campaigns',
    messages: {
        LOAD_ENTITIES_ERROR: 'There was an error retrieving campaigns. Please try refreshing the page.',
        AMEND_ENTITY_ERROR_DESCRIPTION: 'Something went wrong while amending the campaign. Please try again.',
        AMEND_ENTITY_SUCCESS: 'The campaign was amended successfully',
        ADD_ENTITY_SUCCESS: 'The campaign was added successfully',
        DUPLICATE_ENTITY_ERROR_DESCRIPTION: 'A campaign with those details already exists',
        ADD_ENTITY_ERROR_DESCRIPTION: 'Something went wrong while adding the campaign. Please try again.'
    }
} as EntityDefinition;