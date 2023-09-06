import { prisma } from "@/config";
import { products } from "@prisma/client";

export type UpdateProductParams = { product_code: bigint, new_price: products["cost_price"] };

async function update(product: UpdateProductParams) {

  const response = await prisma.products.update({

    where: {
      code: product.product_code,
    },

    data: { 
      cost_price: Number(product.new_price) 
    }
  });

  const serialized = JSON.stringify(response.code.toString());
  const codeValue = JSON.parse(serialized.valueOf());

  return { ...response, code: codeValue };

}

const productsRepository = {
  update,
};
  
export default productsRepository;
