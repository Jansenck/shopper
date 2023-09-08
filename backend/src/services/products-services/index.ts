import productsRepository, { UpdateProductParams } from "@/repositories/products-repository";

async function updateProduct(params: UpdateProductParams) {
    const product = await productsRepository.update(params);
    return product;
}

async function getProducts(item: UpdateProductParams) {  

    const product = await productsRepository.findProducts(item);

    const costPriceLower = Number(item.new_price) < Number(product.cost_price);
    const priceReductionMoreThan10Percent = Number(item.new_price) < ( Number(product.sales_price) * 0.9 );
    const costPriceExceeded = Number(item.new_price) > ( Number(product.sales_price) * 1.1 );

    if(costPriceLower) {
        throw ("Não é permitido um novo preço menor que o preço de custo!");

    } else if(priceReductionMoreThan10Percent) {
        throw ("Não é permitido reduzir mais que 10% do valor atual!");

    } else if(costPriceExceeded) {
        throw ("Não é permitido aumento maior que 10% do valor atual!");

    }

    return product;
}

async function getPacks(product: any) {
    const pack = await productsRepository.findPacks(product.code);
    return pack;
}

const productsService = {
    updateProduct,
    getProducts,
    getPacks
};

export default productsService; 