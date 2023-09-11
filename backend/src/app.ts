import express, { Express } from "express";
import cors from "cors";

import { connectDb, disconnectDB } from "@/config";

import { validateBody } from "./middlewares/validation-middleware";
import { fileValidationSchema } from "./schemas/file-schema";
import { postUpdateProductPrice, getProducts } from "./controllers/file-controller";

const app = express();
app
  .use(cors())
  .use(express.json())
  .post("/products", validateBody(fileValidationSchema), getProducts)
  .put("/products", validateBody(fileValidationSchema), postUpdateProductPrice);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;