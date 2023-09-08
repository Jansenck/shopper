import "reflect-metadata";
import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";

import { loadEnv, connectDb, disconnectDB } from "@/config";

import { validateBody } from "./middlewares/validation-middleware";
import { fileValidationSchema } from "./schemas/file-schema";
import { postUpdateProductPrice, getProducts } from "./controllers/file-controller";

loadEnv();

const app = express();
app
  .use(cors())
  .use(express.json())
  .get("/products", validateBody(fileValidationSchema), getProducts)
  .post("/", validateBody(fileValidationSchema), postUpdateProductPrice);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;