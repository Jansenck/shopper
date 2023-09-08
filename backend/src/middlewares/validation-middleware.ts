import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ObjectSchema } from "joi";
import fs from 'fs';
import csv from 'csv-parser';

import { fileValidationSchema } from "@/schemas/file-schema";

export function validateBody<T>(schema: ObjectSchema<T>): ValidationMiddleware {
    return validate(schema, "body");
}

function validate(schema: ObjectSchema, type: "body" | "params") {
    return (req: Request, res: Response, next: NextFunction) => {

        const { file } = req.body;

        /* if (!file) {
            return res.status(400).send({ message: 'Upload a CSV file.' });
        } */

        const results: any = [];
        const errors: any = [];

        fs.createReadStream("src/uploads/products-prices.csv")
        .pipe(csv())
        .on('data', (row) => {
            results.push(row);
        })
        .on('end', () => {

            for (const row of results) {

                const { error } = fileValidationSchema.validate(row);

                if (error) {
                    errors.push({
                        product_code: error._original.product_code,
                        new_price: error._original.new_price,
                        errorMessage: messageError(error.details[0].message),
                    });
                    return res.status(httpStatus.BAD_REQUEST).send(errors);
                }
            }

            next();
        });
    }
}

function messageError(error: string){

    let message = "";

    if(error.includes("empty")){
        message = `O campo ${error.split('\"')[1]} está vazio!`;

    } else if(error.includes("pattern: /^\\d+\\.\\d{2}$/")) {
        message = `O novo preço deve ser um número com 2 casas decimais! (Ex: 5.12)`;

    } else if(error.includes("pattern: /^\\d+$/")) {
        message = "O novo código do produto deve ser um número inteiro!";

    }

    return message;
}

type ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => void;