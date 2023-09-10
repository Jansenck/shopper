import { createContext, useState } from 'react';

const ProductContext = createContext();
export default ProductContext;

export function ProductsProvider({children}) {

    const [ productsStatus, setProductsStatus ] = useState(false);

  return (
    <ProductContext.Provider value={{ productsStatus, setProductsStatus }}>
      {children}
    </ProductContext.Provider>
  );
}
