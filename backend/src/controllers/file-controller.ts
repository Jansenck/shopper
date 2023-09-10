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
            const validProducts: any[] = [];
            const invalidProducts: any[] = [];

            for (const csvRow of csvDataColl) {
              const params: UpdateProductParams = {
                product_code: csvRow.product_code,
                new_price: csvRow.new_price,
              };

              try {
                const product = await productsService.getProducts(params);
                const pack = await productsService.getPacks(product);

                isValidProductAndPackPrice({ fileData: csvRow, product: { ...product, pack } });

                fileContainsPricesRequired({ productList: csvDataColl, product: { ...product, pack } });

                const newPrice = Number(csvRow.new_price).toFixed(2);
                const salesPrice = product.sales_price.toFixed(2);

                validProducts.push({ ...{ ...product, sales_price: salesPrice, new_price: newPrice }, pack });

              } catch (error) {
                const newError = {
                  code: csvRow.product_code,
                  error: error.details ? error.details.message : error.message != undefined? error.message : error,
                };

                invalidProducts.push(newError);
              }
            }

            return res.status(httpStatus.OK).send([...invalidProducts, ...validProducts]);
          } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Erro ao atualizar os preços' });
          }
        });
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Erro ao processar a solicitação' });
  }
}

function fileContainsPricesRequired(item: any) {

  const haveCurrentProduct: boolean = item.productList.some((product: any) => product.product_code === item.product.code);
  
  if (!haveCurrentProduct) {
    throw new Error(`O arquivo deve conter o novo preço para o produto ${item.product.code}`);
  };
  
  if (item.product.pack.length === 0) return;

  const haveAllPackProducts = item.product.pack.every((packProduct: any) =>
    item.productList.some((product: any) => product.product_code === packProduct.product_id)
  );

  if (!haveAllPackProducts) {
    throw new Error("O arquivo deve conter o novo preço do pack / kit e também os novos preços de cada item contido nele!");
  }
}

function isValidProductAndPackPrice(item: any){

  if(item.product.pack.length == 0) return;
  
  const totalSalesPrice = item.product.pack.reduce((total: any, product: any) => {
    return total + ( Number(product.sales_price) * Number(product.qty));
  }, 0);
  
  if(Number(item.fileData.new_price) != Number(totalSalesPrice.toFixed(2))) {
    throw ("O novo preço do pacote deve ser igual a soma dos produtos nele contido!");
  }
}