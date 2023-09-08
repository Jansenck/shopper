import productsRepository, { UpdateProductParams } from "@/repositories/products-repository";

async function updateProduct(params: UpdateProductParams) {
    const product = await productsRepository.update(params);
    return product;
}

async function getProducts(params: UpdateProductParams) {  
    const product = await productsRepository.findProducts(params);
    return product;
}

async function getPacks(product_code: any) {
    const pack = await productsRepository.findPacks(product_code);
    return pack;
}

const productsService = {
    updateProduct,
    getProducts,
    getPacks
};

export default productsService; 