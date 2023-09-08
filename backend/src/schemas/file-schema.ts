import Joi from "joi";

export const fileValidationSchema = Joi.object({
    product_code: Joi.string().pattern(/^\d+$/).required(), 
    new_price: Joi.string().pattern(/^\d+\.\d{2}$/).required(),
});