# API NestJS – CRUD com Autenticação e Logs

## Descrição  
Esta aplicação é uma API RESTful desenvolvida com **NestJS**, utilizando **PostgreSQL** como banco de dados e **Prisma** para gerenciamento de consultas e relacionamentos. A API possui um sistema de autenticação via **JWT (Bearer Token)**, além de um controle de permissões baseado em roles de usuário.  

## Tecnologias Utilizadas  
- **NestJS** – Framework para construção da API.  
- **PostgreSQL** – Banco de dados relacional.  
- **Prisma** – ORM para manipulação dos dados.  
- **JWT (JSON Web Token)** – Autenticação segura.  
- **Zod** – Validação de dados nos DTOs.  
- **Winston** – Sistema de logs.  
- **Swagger** – Documentação interativa da API.  

## Funcionalidades  
- **CRUD de Usuários:**  
  - Cada usuário possui um papel (`USER` ou `ADMIN`).  
  - Apenas um `ADMIN` pode excluir usuários e criar produtos.  
- **CRUD de Produtos, Pedidos e Carrinhos:**  
  - Operações de criação, leitura, atualização e exclusão.  
- **Autenticação e Segurança:**  
  - Tokens JWT para acesso autenticado.  
  - Senhas armazenadas de forma segura com hash.  
- **Estrutura Modularizada:**  
  - Pastas organizadas em `modules`, `controllers` e `services`.  
- **Validações:**  
  - Implementadas com **Zod** via um **pipe personalizado**.  
- **Sistema de Logs:**  
  - Middleware com **Winston** para registrar eventos e erros.  
- **Documentação:**  
  - Implementada com **Swagger**.  

## Instalação e Configuração  

1. Clone o repositório:  
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```  
2. Instale as dependências:  
   ```bash
   npm install
   ```  
3. Configure as variáveis de ambiente no arquivo `.env`:  
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/database
   JWT_SECRET=seu_token_secreto
   ```  
4. Execute as migrações do Prisma:  
   ```bash
   npx prisma migrate dev
   ```  
5. Inicie a aplicação:  
   ```bash
   npm run start
   ```  

## Autenticação  
A autenticação é feita via **JWT**, utilizando o esquema **Bearer Token**. Após o login, o usuário recebe um token, que deve ser enviado no cabeçalho das requisições:  

```http
Authorization: Bearer <seu-token-aqui>
```  

## Endpoints Principais(Existem mais)  

### Usuários  
- `POST /users` – Criar usuário  
- `GET /users` – Listar usuários  
- `DELETE /users/:id` – (Apenas ADMIN) Excluir usuário  

### Produtos  
- `POST /products` – (Apenas ADMIN) Criar produto  
- `GET /products` – Listar produtos  
- `PATCH /products/:id` – Atualizar produto  
- `DELETE /products/:id` – Excluir produto  

### Pedidos e Carrinhos  
- `POST /orders` – Criar pedido  
- `GET /orders` – Listar pedidos  
- `POST /carts` – Adicionar item ao carrinho  

## Logs  
A aplicação registra logs com **Winston**, permitindo auditoria e rastreamento de erros.  

## Documentação -- Em produção 
A API possui documentação interativa com **Swagger**, acessível em:  
```
http://localhost:3000/api
```  
