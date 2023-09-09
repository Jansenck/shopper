import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { saveCSVFile } from '../services/saveCSVFiles';
import { handleCSVFiles } from '../services/handleCSVFiles';

export default function InputCSVFiles() {
    const [ csvFile, setCsvFile ] = useState(null);
    const [ isFileUploaded, setIsFileUploaded ] = useState(false);
    const [ cards, setCards ] = useState([]);

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

    function setCSVFile() {
        
        try {
            if(csvFile !== null) {
                handleCSVFiles(csvFile);
            }
        } catch (error) {
            window.alert('Error saving CSV file');
        }
    }

    const  convertFileToCard = (file) => {
        const array = [];
        for (const key in file) {
            array.push(`${key}: ${file[key]}\n\n`);
        }
        return array;
    }

    return(
        <FormContainer>
            <form onSubmit={setCSVFile}>
                <label>Insert your CSV file:</label>
                <input className="jfilestyle" data-theme="blue" type='file' accept=".csv" onChange={(event) => handleFileChange(event)}/>
                <Button isfileuploaded={isFileUploaded} disabled={isFileUploaded ? '' : 'disabled'} onClick={(e) => fetchData(e)}>VALIDAR</Button>
                <Button type="submit" isfileuploaded={isFileUploaded} disabled={cards.length > 0 ? '' : 'disabled'} onClick={() => saveCSVFile(csvFile)}>ATUALIZAR</Button>
            </form>
            <CardsContainer >
                {cards !== undefined? (
                        <>
                            {cards.map((card, cardIndex) => (
                                <Card key={cardIndex}>
                                    <div>
                                        {convertFileToCard(card).map(item => {
                                            return <span key={`${card}`}>{item}</span>
                                        })}
                                    </div>
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

    ::-webkit-file-upload-button {
        background: #5d8d9f;
        border-style: none;
        height: 22px;
        border-radius: 4px;
    }
`;

const Button = styled.button`
    background-color: ${props => props.isfileuploaded? '#FB2576' : ''};
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
    background-color: #2C3333;
    margin: 10px;
    padding: 20px;
    box-sizing: border-box;

    div{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    span {
        width: fit-content;
    }
`;