import { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { saveCSVFile } from '../services/saveCSVFiles';
import { handleCSVFiles } from '../services/handleCSVFiles';
import ProductContext from '../contexts/productsContext';

export default function InputCSVFiles() {

    const productsContext = useContext(ProductContext);

    const [ csvFile, setCsvFile ] = useState(null);
    const [ cards, setCards ] = useState([]);
    const [ isFileUploaded, setIsFileUploaded ] = useState(false);
    const [ allProductsAreValid, setAllProductsAreValid ] = useState(false);

    async function fetchData(e){

        e.preventDefault();

        try {
            const fileData = await handleCSVFiles(csvFile);
            setCards(fileData);
        } catch (error) {
            setIsFileUploaded(false);
        }
    }
    
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
            if (e.target && e.target.result) {
              const content = e.target.result;
              setCsvFile(content);
              setIsFileUploaded(true)
            }
          };
          reader.readAsText(file);
        }
    };

    async function updateProducts(e) {

        e.preventDefault();
        
        try {
            if(csvFile !== null) {
                await saveCSVFile(csvFile);
                productsContext.setProductsStatus(true);
            }

        } catch (error) {
            console.log(error)
            window.alert('Erro ao atualizar preços');
        }
    }

    useEffect(() => {
        if(cards.length > 0) {
            const haveSomeInvalidProduct = cards.some(card => card.error != undefined);
            setAllProductsAreValid(!haveSomeInvalidProduct);
        }
    }, [ cards ]);

    return(
        <FormContainer>
            <form onSubmit={(e) => updateProducts(e)}>

                <label>Insira um arquivo CSV:</label>

                <input 
                    type='file' 
                    accept=".csv" 
                    onChange={(event) => handleFileChange(event)}
                />

                <ValidateButton 
                    isfileuploaded={isFileUploaded} 
                    disabled={isFileUploaded ? '' : 'disabled'} 
                    onClick={(e) => fetchData(e)}

                >VALIDAR
                
                </ValidateButton>

                <UpdateButton 
                    type="submit" 
                    isAllProductsValid={allProductsAreValid && isFileUploaded} disabled={(allProductsAreValid && isFileUploaded) ? '' : 'disabled'} 

                >ATUALIZAR

                </UpdateButton>

            </form>
            <CardsContainer >
                {cards !== undefined? (
                        <>
                            {cards.map((card, cardIndex) => (
                                <Card key={cardIndex} invalidProduct={card.error != undefined}>
                                    <ProductCode>
                                        <span>Código</span> 
                                        <span>{card.code}</span>
                                    </ProductCode>

                                    {
                                        card.error?

                                        <ProductError>
                                            <span>Erro</span> 
                                            <span>{card.error}</span>
                                        </ProductError>
                                        :
                                        <>
                                            <ProductName>
                                                <span>Nome</span> 
                                                <span>{card.name}</span>
                                            </ProductName>

                                            <ProductPrice>
                                                <span>Preço Atual</span> 
                                                <span>{card.sales_price}</span>
                                            </ProductPrice>

                                            <ProductNewPrice>
                                                <span>Novo Preço</span> 
                                                <span>{card.new_price}</span>
                                            </ProductNewPrice>
                                        </>
                                        
                                    }

                                </Card>
                            ))}
                        </>
                ) : (
                    <p>There is no cards yet</p>
                )}
            </CardsContainer>
        </FormContainer>
    );
}

const FormContainer = styled.div`
    height: fit content;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    form {
        height: 178px;
        width: 300px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    label {
        color: #000;
        text-align: left;
        font-size: 18px;
    }

    input {
        color: black;
        font-size: 14px;
    }

    ::-webkit-file-upload-button {
        background: #2b2d61;
        border-style: none;
        height: 32px;
        width: 150px;
        border-radius: 4px;
        color: #FFFFFF;
        font-size: 14px;
    }
`;

const ValidateButton = styled.button`
    background-color: ${props => props.isfileuploaded? '#0DAB77' : '#FF0000'};
    cursor: ${props => props.isfileuploaded? 'pointer' : ''};

`;

const UpdateButton = styled.button`
    background-color: ${props => props.isAllProductsValid? '#2da77a' : '#FF0000'};
    cursor: ${props => props.isAllProductsValid? 'pointer' : ''};
`; 

const CardsContainer = styled.div`
    height: fit-content;
    width: 100%;
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    justify-content: ${props => props.havecards? 'center' : 'left'};
    align-items: center;
`;

const Card = styled.div`
    height: 90px;
    width: 1024px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    background-color: ${props => props.invalidProduct? '#f44336' : '#4caf50'};
    margin: 10px;
    padding: 20px;
    box-sizing: border-box;

    div{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    span {
        width: fit-content;
    }
`;

const ProductCode = styled.div`
    width: 78px;
    align-items: center;
`;

const ProductName = styled.div`
    width: 428px;
    align-items: left;
`;

const ProductPrice = styled.div`
    width: 128px;
    align-items: center;
`;

const ProductNewPrice = styled.div`
    width: 112px;
    align-items: center;
`;

const ProductError= styled.div`
    width: 826px;
    align-items: left;
`;