# 🧵 Projeto Ateliê Laudir

## 1. Descrição do Projeto

O objetivo central deste projeto é desenvolver uma **vitrine digital** para o Ateliê Laudir que seja, ao mesmo tempo, moderna, informativa e de fácil navegação.

A plataforma foi projetada para:
* Solidificar a presença online da marca.
* Facilitar o acesso a informações essenciais, como a proposta de valor e a gama de serviços disponíveis.

A solução digital visa apoiar o crescimento de um **pequeno negócio local**, facilitando a organização dos serviços de costura e estética, além da comercialização de produtos.

---

## 2. Tecnologias Utilizadas

As principais tecnologias aplicadas no desenvolvimento deste projeto são:

* **Node.js**: Ambiente de execução do JavaScript no lado do servidor.
* **MongoDB**: Banco de dados NoSQL utilizado para armazenar os dados da aplicação.
* **HTML/CSS**: Linguagens de marcação e estilo para a construção da interface do usuário.
* **JavaScript**: Linguagem de programação para a lógica do front-end e back-end.

---

## 3. Entidades e Estrutura do Banco de Dados

O sistema foi modelado com base nas seguintes entidades principais:

* **Serviços de Costura**: Armazena os serviços oferecidos para o CRUD (Criar, ler, atualizar, deletar).
* **Serviços de Estética**: Exibe os serviços de estética, e seus valores. 
* **Projetos**: Funciona como o portfólio da vitrine digital, exibindo os trabalhos anteriores.
* **Usuários**: Armazena as credenciais para acesso ao painel administrativo onde o CRUD será gerenciado.
* **Agendamentos**: Representa o agendamento de um serviço (costura, estética, etc.) feito por um cliente.

O banco de dados, nomeado `atelie_laudir`, é composto pelas coleções `servicos`, `projetos` e `usuarios`, que armazenam as informações conforme o schema definido no diagrama do projeto.

---

## 4. Funcionalidades Principais (CRUD)

O núcleo do sistema é um **CRUD** (Create, Read, Update, Delete) que permite o gerenciamento completo dos serviços oferecidos. As funcionalidades incluem:

* **Create**: Adicionar novos serviços (ex: "Customização de Vestidos").
* **Read**: Visualizar todos os serviços em uma lista administrativa.
* **Update**: Editar preços, descrições e disponibilidade dos serviços.
* **Delete**: Remover serviços que não são mais oferecidos.

---

## 5. Telas e Fluxos Principais

A aplicação conta com telas essenciais para apresentar o ateliê e permitir a interação do usuário:

* **Página Inicial / Nossa História**: Apresenta a história do Ateliê Laudir e sua fundadora.
* **Fale Conosco**: Exibe informações de contato e um formulário para envio de mensagens.

---

## Como rodar localmente (Node + MongoDB)

Passos rápidos para executar a API localmente:

1. Instale Node.js (v16+).
2. Na raiz do projeto rode:

	npm install

3. Crie um arquivo `.env` copiando `.env.example` e ajuste `MONGODB_URI` se necessário.

4. Inicie o servidor em modo desenvolvimento:

	npm run dev

O servidor será iniciado em http://localhost:3000 por padrão.

## MongoDB — instruções completas

Você pode usar MongoDB local (instalado no Windows) ou MongoDB Atlas (nuvem). A string de conexão padrão no projeto é:

```
mongodb://localhost:27017/atelie_laudir
```

Opção A — MongoDB local no Windows:

- Baixe o instalador do MongoDB Community Server: https://www.mongodb.com/try/download/community
- Instale como serviço (opção recomendada). O banco usará por padrão o diretório C:\\data\\db.
- Verifique o serviço no PowerShell:

```powershell
Get-Service -Name MongoDB* | Format-Table -AutoSize
```

Opção B — MongoDB Atlas (cloud):

- Crie uma conta e um cluster grátis em https://www.mongodb.com/cloud/atlas
- Configure Database Access (usuário/senha) e Network Access (seu IP de desenvolvimento).
- Copie a string de conexão do Atlas para `MONGODB_URI` em `.env`.

Exemplo:

```
MONGODB_URI=mongodb+srv://user:password@cluster0.abcd.mongodb.net/atelie_laudir?retryWrites=true&w=majority
```

## Rotas de API (inicial)

GET /services  -> Lista todos os serviços (rota usada para teste inicial)
POST /services -> Cria um novo serviço
GET /services/:id -> Obtém um serviço por id
PUT /services/:id -> Atualiza um serviço
DELETE /services/:id -> Remove um serviço

---

**Autenticação (JWT)**

O projeto agora inclui autenticação baseada em JWT com refresh tokens rotativos.

- Endpoints adicionados:
	- `POST /auth/register` — registra um usuário (body: `email`, `password`).
	- `POST /auth/login` — autentica, retorna `accessToken` (JWT) e seta cookie `refreshToken` (HttpOnly).
	- `POST /auth/refresh` — usa cookie `refreshToken` para emitir novo `accessToken` e rotacionar refresh token.
	- `POST /auth/logout` — remove refresh token e limpa cookie.

- Como usar:
	- Faça login e coloque o `accessToken` no header `Authorization: Bearer <token>` para acessar rotas protegidas.
	- O `refreshToken` é armazenado em cookie `HttpOnly` para segurança e é usado automaticamente pelo endpoint `/auth/refresh` (no front-end use `fetch('/auth/refresh', { credentials: 'include' })`).

**Rotas protegidas**

As rotas que realizam escrita foram protegidas com middleware JWT:
- `POST /services`, `PUT /services/:id`, `DELETE /services/:id` agora requerem `Authorization` header com um `accessToken` válido.

**Variáveis de ambiente**

Copie `.env.example` para `.env` e defina um `JWT_SECRET` forte. Exemplo mínimo em `.env`:

```
MONGODB_URI=mongodb://localhost:27017/atelie_laudir
PORT=3000
JWT_SECRET=uma_chave_secreta_muito_forte
JWT_EXP=1h
```

**Executando testes automáticos**

Os testes de integração usam `jest`, `supertest` e `mongodb-memory-server` para rodar um MongoDB em memória — não é necessário alterar sua instalação local do MongoDB.

Passos para executar localmente:

1. Instale dependências:

```pwsh
npm install
```

2. Rode os testes:

```pwsh
npm test
```

Os testes cobrem o fluxo: registrar usuário, login, criar um serviço protegido, refresh de token e logout.
