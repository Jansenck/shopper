import { useEffect, useContext } from 'react';
import styled from 'styled-components';

import ProductContext from '../contexts/productsContext';
import InputCSVFiles from './InputCSVFiles';
import Message from './Message';

export default function HomePage() {

  const productsContext = useContext(ProductContext);

  useEffect(() => {
    setTimeout(hiddenMessage, 3000);
  }, [ productsContext.productsStatus ]);

  function hiddenMessage() {
    productsContext.setProductsStatus(false);
  }

  return(
      <Container>
          <img src="https://agenciagnu.com.br/webstore/SHOPPER/logo.png" />
          <InputCSVFiles/>
          {productsContext.productsStatus && <Message/>}
      </Container>
  );
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  margin: 90px 0;
  padding: 0 40px 128px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  img {
    height: 120px;
    width: 160px;
    margin-bottom: 90px;
  }
`;