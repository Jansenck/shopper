import { useContext } from 'react';
import styled from 'styled-components';
import ProductContext from '../contexts/productsContext';

export default function Message(){

    const productsContext = useContext(ProductContext);

    return(
        <Container isVisible={productsContext.productsStatus}>
            <span>Preços atualizados com sucesso</span>
        </Container>
    );
}

const Container = styled.div`
    height: 100%;
    width: 100vw;
    color: #FFFFFF;
    background-color: #4caf4fc9;
    position: fixed;
    top: 0;
    display: grid;
    align-items: center;
    opacity: 1;
    transition: opacity 1s ease;

    span{
        font-size: 36px;
    }

    &.visible {
        opacity: 0;
    }
`;