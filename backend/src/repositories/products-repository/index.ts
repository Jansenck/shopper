import { prisma } from "@/config";
import { products, packs } from "@prisma/client";

export type UpdateProductParams = { product_code: bigint, new_price: products["sales_price"] };

async function update(product: UpdateProductParams) {

  const response = await prisma.products.update({

    where: {
      code: product.product_code,
    },

    data: { 
      sales_price: Number(product.new_price) 
    }
  });

  const serialized = JSON.stringify(response.code.toString());
  const codeValue = JSON.parse(serialized.valueOf());

  return { ...response, code: codeValue };

}

async function findProducts(product: UpdateProductParams) {

  const response = await prisma.products.findUnique({
    where: {
      code: product.product_code,
    },
  });

  return { ...response, code: convertBigIntToNumber(response.code) };
}

function convertBigIntToNumber(number: BigInt): number {
  const serialized = JSON.stringify(number.toString());
  const codeValue = JSON.parse(serialized.valueOf());

  return codeValue;
}

const productsRepository = {
  update,
  findProducts,
};
  
export default productsRepository;
