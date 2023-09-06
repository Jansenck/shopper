import productsRepository, { UpdateProductParams } from "@/repositories/products-repository";

async function updateProduct(params: UpdateProductParams) {
    const product = await productsRepository.update(params);
    return product;
}

const productsService = {
    updateProduct,
};

export default productsService; 