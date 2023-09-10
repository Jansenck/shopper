# Shopper

Um sistema de atualização de preços de produtos.



## Sobre

Driven.t is a web browser application with which you can manage every single aspect of your event.

Shopper Management é uma aplicação web na qual você pode atualizar multiplos preços de produtos com alguns cliques.

## Como rodar backend

1. Clone esse repositório
2. Instale as dependencias rodando o comando a seguir tanto no frontend quanto no backend

```bash
npm i
```

1. Crie um banco de dados MySQL com o nome que você desejar.

2. Configure o arquivo .env.development usando o arquivo .env.example (consulte a seção "Executando a aplicação localmente ou dentro de um contêiner Docker" para obter detalhes).

3. Execute todas as migrações

```
npm run migration:run
```

1. Alimente o banco de dados

```
npm run dev:seed
```

1. Execute o back-end:

```
npm run dev
```



### O que fazer ao adicionar novas VARIÁVEIS DE AMBIENTE


- Há várias coisas que você precisa fazer ao adicionar novas VARIÁVEIS DE AMBIENTE:

- Adicione-as ao arquivo .env.example.

- Adicione-as ao seu arquivo .env




## Como rodar backend em desenvolvimento

1. Clone esse repositório
2. Instale as dependencias rodando o comando a seguir tanto no frontend quanto no backend

```bash
npm i
```

1. Execute o front-end:

```
npm run dev
```