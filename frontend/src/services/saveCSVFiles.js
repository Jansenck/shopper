import axios from 'axios';

export async function saveCSVFile(csvData){
    const body = { file: csvData };
    const response = await axios.put('http://localhost:3000/products', body);
    return response;
}