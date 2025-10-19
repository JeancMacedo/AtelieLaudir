# 🧵 Projeto Ateliê Laudir

## 1. Visão Geral do Projeto

[cite_start]Este projeto consiste no desenvolvimento de um site completo para o **Ateliê Laudir**, um negócio local com tradição artesanal desde o início dos anos 2000[cite: 1, 220]. [cite_start]O objetivo central é criar uma ferramenta de gestão digital que modernize sua presença online e, principalmente, ofereça autonomia para a proprietária gerenciar seus serviços de forma independente e eficiente[cite: 24, 28, 31].

A principal entrega é um sistema de gerenciamento de conteúdo (CRUD - Criar, Ler, Atualizar, Deletar) que permitirá ao ateliê:
* [cite_start]Adicionar novos serviços de forma simplificada[cite: 14].
* [cite_start]Visualizar e administrar a lista de ofertas disponíveis[cite: 16, 17].
* [cite_start]Atualizar informações como preços, descrições e disponibilidade[cite: 19].
* [cite_start]Remover serviços que foram descontinuados[cite: 21].

## 2. Autor do Projeto

* [cite_start]**Desenvolvedor:** Jean Carlo Silva de Macedo [cite: 117]
* [cite_start]**ID Acadêmico:** CP3030563 [cite: 118, 235]
* [cite_start]**Repositório:** [github.com/JeancMacedo/AtelieLaudir](https://github.com/JeancMacedo/AtelieLaudir) [cite: 121, 124]

[cite_start]*Observação: Este projeto foi inicialmente concebido em grupo, mas a partir da segunda entrega parcial, passou a ser desenvolvido e mantido individualmente*[cite: 228, 229, 230].

## 3. Tecnologias Utilizadas

A aplicação foi construída utilizando as seguintes tecnologias e dependências:

* [cite_start]**Backend:** Node.js [cite: 12]
* [cite_start]**Banco de Dados:** MongoDB (NoSQL) [cite: 12, 37]
* [cite_start]**Frontend:** HTML e CSS [cite: 12]
* **Framework e Bibliotecas:**
    * [cite_start]`Express` [cite: 126]
    * [cite_start]`Mongoose` [cite: 126]
    * [cite_start]`Nodemon` [cite: 126]
    * [cite_start]`Dotenv` [cite: 126]

## 4. Estrutura do Projeto (MVC)

[cite_start]O projeto segue a arquitetura MVC (Model-View-Controller) para organizar o código de forma clara e escalável[cite: 80].

ATELIELAUDIR/ │ ├── node_modules/ ├── src/ │ ├── Controller/ │ │ └── serviceController.js # Controla a lógica de negócio  │ ├── Model/ │ │ └── service.js # Define o schema do banco de dados  │ ├── routes/ │ │ └── serviceRoutes.js # Define as rotas da API  │ └── View/ │ ├── app.js │ └── index.html # Interface do usuário  │ ├── .env.example # Arquivo de exemplo para variáveis de ambiente  ├── .gitignore ├── package-lock.json ├── package.json └── README.md

## 5. Estrutura do Banco de Dados

O banco de dados utilizado é o **MongoDB**, com o nome `atelie_laudir`[cite: 45, 48, 72]. A principal coleção é a `services`[cite: 174], que armazena os serviços oferecidos.

### Schema do Serviço (`Service`)

A estrutura para cada serviço no banco de dados é definida pelo seguinte schema Mongoose[cite: 63, 66]:

```javascript
const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});
```
module.exports = mongoose.model('Service', ServiceSchema);

6. Como Executar o Projeto Localmente
Siga os passos abaixo para configurar e iniciar o ambiente de desenvolvimento.

Pré-requisitos:

Node.js (versão 16 ou superior).

MongoDB Community Server instalado localmente ou uma conta no MongoDB Atlas (nuvem).


MongoDB Compass (recomendado para visualizar o banco de dados).

Passos para Instalação

1° Clone o repositório:
git clone [https://github.com/JeancMacedo/AtelieLaudir.git](https://github.com/JeancMacedo/AtelieLaudir.git)
cd AtelieLaudir

2° Instale as dependências do projeto através do npm:
npm install express dotenv mongoose nodemon

3° Configure as variáveis de ambiente:
Crie um arquivo chamado .env na raiz do projeto, copiando o conteúdo de .env.example.
 - Ajuste a variável MONGODB_URI se necessário.
 - O padrão para uma instalação local é:
   MONGODB_URI=mongodb://localhost:27017/atelie_laudir

4°(Opcional) Conecte-se com o MongoDB Compass:

Abra o MongoDB Compass e crie uma nova conexão.
Use a URI mongodb://localhost:27017/atelie_laudir e clique em "Save & Connect".
Inicie o servidor: Execute um dos seguintes comandos no terminal:
	npm run dev
	    ou
	node src/server.js

Após a inicialização, o terminal exibirá uma mensagem de sucesso, e o servidor estará disponível em http://localhost:3000.

7. Rotas da API (CRUD de Serviços)
GET /services -> Lista todos os serviços.

POST /services -> Cria um novo serviço.

GET /services/:id -> Obtém um serviço específico por ID.

PUT /services/:id -> Atualiza um serviço existente.

DELETE /services/:id -> Remove um serviço.
