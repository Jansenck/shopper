import Joi from "joi";

export const fileValidationSchema = Joi.object({
    product_code: Joi.number().integer().required(), 
    new_price: Joi.string().regex(/^\d+\.\d{2}$/).required(),
});