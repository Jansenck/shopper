import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ObjectSchema, bool } from "joi";
import fs from 'fs';
import csv from 'csv-parser';
import multer from "multer";
import path from "path";


const currentDirectory =__dirname;
const uploadDir = path.join(currentDirectory, '../uploads');

const existsFolder = createUploadDir(uploadDir);

if(!existsFolder){
  throw("Erro ao criar pasta de upload");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});

const upload = multer({ storage });

export function validateBody<T>(schema: ObjectSchema<T>): ValidationMiddleware {
  return validate(schema, "body");
}

function validate(schema: ObjectSchema, type: "body" | "params") {

  return (req: Request, res: Response, next: NextFunction) => {

    try {
      fs.writeFileSync(`${uploadDir}/products-prices.csv`, req.body.file, 'utf8');
    } catch (error) {
      console.error('Erro ao salvar o arquivo:', error);
    }

    upload.single('csvFile')(req, res, async (error) => {
      
      if (error) {
        return res.status(httpStatus.BAD_REQUEST).send({ error: 'Erro no upload do arquivo' });
      }

      const results: any[] = [];
      const errors: any[] = [];

      try {
        const stream = fs.createReadStream(path.join(uploadDir, "products-prices.csv"));

        stream
          .pipe(csv())
          .on('data', (row) => {
            results.push(row);
          })
          .on('end', () => {

            for (const row of results) {

              const { error } = schema.validate(row);

              if (error) {
                errors.push({
                  product_code: row.product_code,
                  new_price: row.new_price.toFixed(2),
                  errorMessage: messageError(error.details[0].message),
                });
              }
            }

            if (errors.length > 0) {
              return res.status(httpStatus.BAD_REQUEST).send(errors);
            }
            
            next();
          });
      } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Erro ao processar o arquivo CSV' });
      }
    });
  };
};

async function createUploadDir(uploadDir: string) {

  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

  } catch (error) {
    console.error('Erro ao criar ou verificar a pasta de uploads:', error);
  }
}

function messageError(error: string){

    let message = "";

    if(error.includes("empty")){
        message = `O campo ${error.split('\"')[1]} está vazio!`;

    } else if(error.includes("pattern: /^\\d+\\.\\d{2}$/")) {
        message = `O novo preço deve ser um número com 2 casas decimais! (Ex: 5.12)`;

    } else if(error.includes("pattern: /^\\d+$/")) {
        message = "O novo código do produto deve ser um número inteiro! (Ex: 100)";

    }

    return message;
}

type ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => void;