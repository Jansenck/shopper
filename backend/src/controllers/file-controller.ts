import { Request, Response } from "express";
import httpStatus from "http-status";

import productsService from "@/services/products-services"; 
import { UpdateProductParams } from "@/repositories/products-repository";

export async function postCreateOrUpdateProductPrice(req: Request, res: Response) {
    try {
        const fileData: UpdateProductParams = req.body;
        const product = await productsService.updateProduct(fileData);
        return res.status(httpStatus.CREATED).send(product);
        
    } catch (error) {  
        console.log("Error message", error.message)
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
};