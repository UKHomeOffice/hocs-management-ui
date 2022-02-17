interface EntityDefinition {
    entityListName: string;
    entityName: string;
    entityNamePlural: string;
    entityNameCapitalised: string;
    entityRoute: string;
    messages: {
        AMEND_ENTITY_ERROR_DESCRIPTION: string;
        DUPLICATE_ENTITY_ERROR_DESCRIPTION: string;
        ADD_ENTITY_SUCCESS: string;
        AMEND_ENTITY_SUCCESS: string;
        ADD_ENTITY_ERROR_DESCRIPTION: string;
        LOAD_ENTITIES_ERROR: string
    };
}