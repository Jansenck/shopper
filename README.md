# Shopper

Um sistema de atualização de preços de produtos.



## Sobre

Shopper Management é uma aplicação web na qual você pode atualizar multiplos preços de produtos com alguns cliques.

## Como rodar backend

1. Clone esse repositório
2. Instale as dependencias rodando o comando a seguir tanto no frontend quanto no backend

    ```bach
        npm i
    ```

1. Criar um banco de dados com o nome shopper na máquina local, usando MySQL
    1. via mysql ou MySQL Worckbench

    ```bash
        CREATE DATABASE products;
        CREATE DATABASE packs;
    ```

2. Configure o arquivo .env usando o arquivo .env.example:

- Veja o exemplo no arquivo .env.example.

- Adicione ao seu arquivo .env

3. Execute todas as migrações

    ```bach
        npm run migration:run
    ```

1. Alimente o banco de dados

    ```bach
        npm run dev:seed
    ```

1. Execute o back-end:

    ```bach
        npm run dev
    ```



## Como rodar frontend

1. Clone esse repositório
2. Instale as dependencias rodando o comando a seguir tanto no frontend quanto no backend

```bash
npm i
```

1. Execute o front-end:

```
npm run dev
```