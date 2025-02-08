# API Loja NestJS

Esta aplicação é uma API RESTful desenvolvida com **NestJS**, utilizando **PostgreSQL** como banco de dados e **Prisma** como ORM. A API conta com autenticação JWT, controle de permissões por roles (usuário e admin), sistema de logs (Winston) e documentação interativa via Swagger.

## Funcionalidades

- **CRUD de Usuários**:
  - Cada usuário possui um papel (`USER` ou `ADMIN`).
  - Apenas um `ADMIN` pode excluir usuários e criar produtos.
- **CRUD de Produtos**:
  - Qualquer usuário pode visualizar produtos.
  - Apenas usuários com papel `ADMIN` podem criar, atualizar ou excluir produtos.
- **Autenticação e Autorização**:
  - Registro de novos usuários.
  - Login de usuários existentes para obtenção de token JWT.
  - Proteção de rotas com base no papel do usuário.
- **Sistema de Logs**:
  - Registro de atividades e erros utilizando o Winston.
- **Documentação da API**:
  - Documentação interativa disponível via Swagger.

## Tecnologias

- **NestJS**, **PostgreSQL**, **Prisma**, **JWT**, **Winston**, **Zod**, **Swagger**.

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/Lucalopezz/api-loja-nestjs.git
   cd api-loja-nestjs
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados:
   - Crie um banco no PostgreSQL.
   - Adicione no arquivo `.env`:
     ```
     DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
     ```

4. Rode as migrações:
   ```bash
   npx prisma migrate dev
   ```

5. Inicie o servidor:
   ```bash
   npm run start:dev
   ```

A aplicação estará disponível em `http://localhost:3000`.

## Uso Básico

- **Registro**: `POST /auth/register`
  ```json
  { "email": "usuario@example.com", "senha": "senha123", "nome": "Nome do Usuário" }
  ```

- **Login**: `POST /auth/login`
  ```json
  { "email": "usuario@example.com", "senha": "senha123" }
  ```

  **Resposta**:
  ```json
  { "access_token": "token_jwt" }
  ```

- **Swagger**: Acesse `http://localhost:3000/docs`.

## Estrutura do Projeto

- **src/**:
  - **auth/**: Módulo de autenticação.
  - **users/**: CRUD de usuários.
  - **products/**: CRUD de produtos.
  - **common/**: Guardas, interceptors e utils.
  - **main.ts**: Entrada principal.


