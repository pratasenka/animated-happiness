import { checkSchema } from "express-validator";

export const buyItemValidation = checkSchema({
    itemId: {
        notEmpty: {
            errorMessage: 'itemId should contain value',
        }
    },
});