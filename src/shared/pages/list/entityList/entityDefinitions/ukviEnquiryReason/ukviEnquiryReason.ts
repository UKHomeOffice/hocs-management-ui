export default {
    entityListName: 'COMP_CCT_ENQ_REASON',
    entityName: 'enquiry reason',
    entityNamePlural: 'UKVI enquiry reasons',
    entityNameCapitalised: 'Enquiry Reason',
    entityRoute: '/manage-ukvi-enquiry-reasons',
    messages: {
        LOAD_ENTITIES_ERROR: 'There was an error retrieving enquiry reasons. Please try refreshing the page.',
        AMEND_ENTITY_ERROR_DESCRIPTION: 'Something went wrong while amending the enquiry reason. Please try again.',
        AMEND_ENTITY_SUCCESS: 'The enquiry reason was amended successfully',
        ADD_ENTITY_SUCCESS: 'The enquiry reason was added successfully',
        DUPLICATE_ENTITY_ERROR_DESCRIPTION: 'Enquiry reason with that name already exists',
        ADD_ENTITY_ERROR_DESCRIPTION: 'Something went wrong while adding the enquiry reason. Please try again.'
    }
} as EntityDefinition;
