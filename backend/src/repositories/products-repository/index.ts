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

async function findPacks(product_code: any) {
  const response = await prisma.packs.findMany({
    where: {
      pack_id: product_code,
    },
    include: {
      products_packs_pack_idToproducts: {
        select: {
          code: true,
          name: true,
          cost_price: true
        },
      },
    },
  });

  const packs = response.map(pack => {

    return { 
      id: convertBigIntToNumber(pack.id),
      pack_id: convertBigIntToNumber(pack.pack_id),
      product_id: convertBigIntToNumber(pack.product_id), 
      qty: convertBigIntToNumber(pack.qty)
    }
  });

  return packs;
}

function convertBigIntToNumber(number: BigInt): number {
  const serialized = JSON.stringify(number.toString());
  const codeValue = JSON.parse(serialized.valueOf());

  return codeValue;
}

const productsRepository = {
  update,
  findProducts,
  findPacks
};
  
export default productsRepository;
