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

        if (!file) {
            return res.status(400).send({ message: 'O corpo da solicitação deve conter um arquivo CSV.' });
        }

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
                        message: error.details[0].message,
                    });
                    return res.status(httpStatus.BAD_REQUEST).send(errors);
                }
            }

            next();
        });
    }
}

type ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => void;