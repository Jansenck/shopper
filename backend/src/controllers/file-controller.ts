import { Request, Response } from "express";
import httpStatus from "http-status";
import productsService from "@/services/products-services";
import { UpdateProductParams } from "@/repositories/products-repository";
import fs from 'fs';
import csv from 'csv-parser';
import multer from "multer";
import path from "path";

const currentDirectory =__dirname;
const uploadDir = path.join(currentDirectory, '../uploads');

const upload = multer({
  dest: 'src/uploads',
});

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

        fs.unlinkSync(uploadDir);

        return res.status(httpStatus.OK).send({ updatedRows, errors });

      } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Erro ao atualizar os preços' });
      }
    });
};

export async function getProducts(req: Request, res: Response) {

  try {
    
    upload.single('csvFile')(req, res, async (err: any) => {

      if (err) {
        return res.status(httpStatus.BAD_REQUEST).send({ error: 'Erro no upload do arquivo' });
      }

      //const uploadDir = uploadDir;
      if (!uploadDir) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Erro ao salvar o arquivo' });
      }

      const stream = fs.createReadStream(path.join(uploadDir, "products-prices.csv"));
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
                new_price: csvRow.new_price,
              };

              try {
                const product = await productsService.getProducts(params);
                const pack = await productsService.getPacks(product);

                isValidProductAndPackPrice(product, pack);

                fileContainsPricesRequired(pack, csvDataColl);

                productsUpdated.push({ ...{ ...product, new_price: csvRow.new_price }, pack });

              } catch (error) {
                const newError = {
                  code: csvRow.product_code,
                  message: error.details ? error.details.message : error.message != undefined? error.message : error,
                };

                invalidProducts.push(newError);
              }
            }

            return res.status(httpStatus.OK).send([...productsUpdated, ...invalidProducts]);
          } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Erro ao atualizar os preços' });
          }
        });
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Erro ao processar a solicitação' });
  }
}

function fileContainsPricesRequired(pack: any[], csvDataColl: any[]) {
  if (pack.length === 0) return;

  const haveAllProducts = pack.every(product => {
    return csvDataColl.some(csvRow => csvRow.product_code === product.product_id);
  });

  if (!haveAllProducts) {
    throw new Error("O arquivo deve conter o novo preço do pack / kit e também os novos preços de cada item contido nele!");
  }
}

function isValidProductAndPackPrice( product: any, pack: any[] ){

  if(pack.length == 0) return;

  const totalSalesPrice = pack.reduce((total, item) => {
    return total + ( Number(item.sales_price) * Number(item.qty));
  }, 0);

  if(Number(product.sales_price) != Number(totalSalesPrice.toFixed(2))) {
    throw ("O novo preço do pacote deve ser igual a soma dos produtos nele contido!");
  }
}