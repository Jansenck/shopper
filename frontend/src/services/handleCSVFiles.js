import axios from 'axios';

export async function handleCSVFiles(file){
    const body = {file}
    const response = await axios.post("http://localhost:3000/products", body);
    return response.data;
}