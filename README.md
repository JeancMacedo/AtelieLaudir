# 🧵 Projeto Ateliê Laudir

## 1. Visão Geral do Projeto

Este projeto consiste no desenvolvimento de um site completo para o **Ateliê Laudir**, um negócio local com tradição artesanal desde o início dos anos 2000. O objetivo central é criar uma ferramenta de gestão digital que modernize sua presença online e, principalmente, ofereça autonomia para a proprietária gerenciar seus serviços de forma independente e eficiente.

A principal entrega é um sistema de gerenciamento de conteúdo (CRUD - Criar, Ler, Atualizar, Deletar) que permitirá ao ateliê:
* Adicionar novos serviços de forma simplificada.
* Visualizar e administrar a lista de ofertas disponíveis.
* Atualizar informações como preços, descrições e disponibilidade.
* Remover serviços que foram descontinuados.

## 2. Autor do Projeto

* **Desenvolvedor:** Jean Carlo Silva de Macedo
* **ID Acadêmico:** CP3030563 
* **Repositório:** [github.com/JeancMacedo/AtelieLaudir](https://github.com/JeancMacedo/AtelieLaudir)

*Observação: Este projeto foi inicialmente concebido em grupo, mas a partir da segunda entrega parcial, passou a ser desenvolvido e mantido individualmente*.

## 3. Tecnologias Utilizadas

A aplicação foi construída utilizando as seguintes tecnologias e dependências:

* **Backend:** Node.js
* **Banco de Dados:** MongoDB (NoSQL)
* **Frontend:** HTML e CSS
* **Framework e Bibliotecas:**
    * `Express` 
    * `Mongoose` 
    * `Nodemon` 
    * `Dotenv` 

## 4. Estrutura do Projeto (MVC)

O projeto segue a arquitetura MVC (Model-View-Controller) para organizar o código de forma clara e escalável.

   ```## Estrutura do Projeto

    AtelieLaudir/
    - node_modules/
    - src/
        - Controller/
            - serviceController.js
        - Model/
            - service.js
        - routes/
            - serviceRoutes.js
        - View/
            - index.html
            - app.js
        - server.js
    - .env.example
    - package.json
    - README.md
```

## 5. Estrutura do Banco de Dados

O banco de dados utilizado é o **MongoDB**, com o nome `atelie_laudir`[cite: 45, 48, 72]. A principal coleção é a `services`[cite: 174], que armazena os serviços oferecidos.

### Schema do Serviço (`Service`)

A estrutura para cada serviço no banco de dados é definida pelo seguinte schema Mongoose[cite: 63, 66]:

```javascript
const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    # 🧵 Projeto Ateliê Laudir

    ## Visão Geral

    Este projeto implementa uma vitrine digital e painel administrativo para o Ateliê Laudir — um ateliê artesanal com atuação em Campinas (SP). A aplicação fornece um CRUD para gerenciar serviços (criar, listar, atualizar e remover), além de uma interface administrativa simples.

    ## Autor

    - Desenvolvedor: Jean Carlo Silva de Macedo
    - ID Acadêmico: CP3030563
    - Repositório: https://github.com/JeancMacedo/AtelieLaudir

    > Observação: o projeto teve contribuições coletivas inicialmente, mas a manutenção atual é feita individualmente.

    ## Tecnologias

    - Node.js (backend)
    - Express
    - Mongoose (MongoDB)
    - MongoDB (banco de dados)
    - HTML, CSS (frontend)
    - Nodemon (desenvolvimento)
    - Dotenv (variáveis de ambiente)

    ## Banco de Dados

    Banco: `atelie_laudir` (MongoDB)

    Coleção principal: `services`

    Schema Mongoose (Service):

    ```javascript
    const ServiceSchema = new mongoose.Schema({
        name: { type: String, required: true },
        description: { type: String, default: '' },
        price: { type: Number, required: true, min: 0 },
        available: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now }
    });

    module.exports = mongoose.model('Service', ServiceSchema);
    ```

    ## Como executar localmente

    Pré-requisitos:

    - Node.js v16+ instalado
    - MongoDB Community Server (local) ou cluster no MongoDB Atlas

    Passos:

    1. Clone o repositório e entre na pasta:

    ```bash
    git clone https://github.com/JeancMacedo/AtelieLaudir.git
    cd AtelieLaudir
    ```

    2. Instale dependências:

    ```bash
    npm install
    ```

    3. Configure variáveis de ambiente:

    - Copie `.env.example` para `.env` na raiz do projeto e ajuste `MONGODB_URI` se necessário.
    - Exemplo (local):

    ```env
    MONGODB_URI=mongodb://localhost:27017/atelie_laudir
    PORT=3000
    ```

    4. Inicie o servidor (desenvolvimento):

    ```bash
    npm run dev
    # ou
    node src/server.js
    ```

    Abra http://localhost:3000 no navegador.

    ## Uso com MongoDB Compass (opcional)

    - Abra o MongoDB Compass e conecte usando a URI definida em `MONGODB_URI` (por exemplo, `mongodb://localhost:27017/atelie_laudir`).

    ## Rotas da API (serviços)

    - GET /services               → lista serviços (suporta paginação com `?page=` e `?limit=`)
    - POST /services              → cria um novo serviço
    - GET /services/:id           → obtém um serviço por id
    - PUT /services/:id           → atualiza um serviço
    - DELETE /services/:id        → remove um serviço

    Observação: a rota GET `/services` retorna, quando a paginação estiver habilitada, um objeto com metadados e a lista em `data`:

    ```json
    {
        "data": [ /* array de serviços */ ],
        "page": 1,
        "limit": 10,
        "total": 42,
        "totalPages": 5
    }
    ```

    ## Próximos passos
    - Implementar autenticação para o painel administrativo.
