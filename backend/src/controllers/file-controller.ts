import { Request, Response } from "express";
import httpStatus from "http-status";

import productsService from "@/services/products-services"; 
import { UpdateProductParams } from "@/repositories/products-repository";

import fs from'fs';
import csv from 'csv-parser';

export async function postUpdateProductPrice(req: Request, res: Response) {

  const stream = fs.createReadStream("src/uploads/products-prices.csv");
  const csvDataColl: any[] = [];

stream
  .pipe(csv())
  .on('data', (data: any) => {
    csvDataColl.push(data);
  })
  .on('end', async () => {

    try {
      const updatedRows: any[] = [];
      const errors: any[] = [];

      for (const csvRow of csvDataColl) {
      
        const params: UpdateProductParams = { 
          product_code: csvRow.product_code, 
          new_price: csvRow.new_price 
        }; 

        try {
          const product = await productsService.updateProduct(params);

          delete product.sales_price;

          const updatedProduct = {
            code: product.code,
            name: product.name,
            new_price: csvRow.new_price
          };

          updatedRows.push(updatedProduct);

        } catch (error) {
          const productWithError = { code: csvRow.product_code, name: csvRow.product_name};
          errors.push(productWithError);
        }
      }

      return res.status(httpStatus.OK).send({ updatedRows, errors });

    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Erro ao atualizar os preços' });
    }
  });


  function validateRow(data: any){
    const containsProductCode = 'product_code' in data;
    const containsProductPrice = 'new_price' in data;

    if( !containsProductCode || !containsProductPrice ) {
      return false;
    } 

    return true;
  }
};