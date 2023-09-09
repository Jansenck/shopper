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
};

export async function getProducts(req: Request, res: Response){

  const stream = fs.createReadStream("src/uploads/products-prices.csv");
  const csvDataColl: any[] = [];

  stream
    .pipe(csv())
    .on('data', (data: any) => {
      csvDataColl.push(data);
    })
    .on('end', async () => {

      try {
        const productsUpdated: any[] = [];
        const invalidProducts: any[] = [];

        for (const csvRow of csvDataColl) {

          const params: UpdateProductParams = { 
            product_code: csvRow.product_code, 
            new_price: csvRow.new_price 
          }; 

          try {
            const product = await productsService.getProducts(params); 
            const pack = await productsService.getPacks(product);

            const validProduct = isValidProductAndPackPrice(product, pack);

            const haveAllRequiredPrices = fileContainsPricesRequired(pack);
            
            productsUpdated.push({...product, pack});

          } catch (error) {

            const newError = {
              code: csvRow.product_code, 
              message: error.details? error.details.message : error.message,
            };

            invalidProducts.push(newError);
          }
        }

        if(invalidProducts.length > 0) {
          return res.status(httpStatus.BAD_REQUEST).send({invalidProducts: invalidProducts});
        }

        return res.status(httpStatus.OK).send(productsUpdated);

      } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Erro ao atualizar os preços' });
      }
    });

    function fileContainsPricesRequired(pack: any[]) {
      if (pack.length === 0) return;
    
      const haveAllProducts = pack.every(product => {
        return csvDataColl.some(csvRow => csvRow.product_code === product.product_id);
      });
    
      if (!haveAllProducts) {
        throw new Error("O arquivo deve conter o novo preço do pack / kit e também os novos preços de cada item contido nele!");
      }
    }
    
}

function isValidProductAndPackPrice( product: any, pack: any[] ){

  if(pack.length == 0) return;

  const totalSalesPrice = pack.reduce((total, item) => {
    return total + ( Number(item.sales_price) * Number(item.qty));
  }, 0);

  if(Number(product.sales_price) != Number(totalSalesPrice.toFixed(2))) {
    throw ("O novo preço para o pacote deve ser igual a soma dos produtos");
  }
}