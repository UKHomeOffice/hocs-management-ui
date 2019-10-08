import { ObjectSchema, ValidationError, setLocale } from 'yup';
import { FormError } from '../models/formError';

setLocale({
    mixed: {
        required: 'A ${label} is required'
    },
    string: {
        matches: 'The ${label} contains invalid characters'
    }
});

export const validate = (schema: ObjectSchema<any>, state: any, addFormError: (value: FormError) => void) => {
    try {
        schema.validateSync(state, { abortEarly: false });
        return true;
    } catch (error) {
        if (error instanceof ValidationError) {
            error.inner.map((error: { path: any; message: any; }) => addFormError({ key: error.path, value: error.message }));
        }
        return false;
    }
};
