import axios from 'axios';

function joinAllCards(cardsGroups) {

    const novoArray = cardsGroups.map(objeto => ({
        "Código": objeto.code,
        "Nome": objeto.name,
        "Preço Atual": objeto.sales_price,
        "Novo Preço": objeto.new_price,
        "Status": objeto.message != null? `Atualização Inválida! ${objeto.message}` : "Atualização Válida!"
    }));
      

    const groupOfCards = [].concat(...novoArray)
    return groupOfCards;
}

export async function handleCSVFiles(file){
    const body = {file}
    const response = await axios.post("http://localhost:3000/products", body);
    const cards = joinAllCards(response.data);
    console.log(response);
    return cards;
}