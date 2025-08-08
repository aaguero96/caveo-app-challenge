# 📌 Caveo App Challenge

## ⚙️ Configuração do Cognito

Para implementar o **AWS Cognito**, siga os passos abaixo:

1. Crie um **User Pool** no Cognito.
2. Dentro do User Pool, crie dois grupos:
   - **admin**
   - **usuario**
3. O grupo **admin** deve ter prioridade sobre o grupo **usuario** (caso um usuário pertença a mais de um grupo).

---

## 🗄️ Configuração do Banco de Dados Local (Docker)

Para rodar um banco PostgreSQL localmente via Docker, execute:

```bash
docker run -d   --name ${POSTGRES_CONTAINER_NAME}   -e POSTGRES_DB=${POSTGRES_DB}   -e POSTGRES_USER=${POSTGRES_USER}   -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD}   -p ${POSTGRES_PORT_HOST}:${POSTGRES_PORT_CONTAINER}   postgres
```

> Substitua as variáveis `${...}` pelos valores desejados.

---

## 🚀 Iniciando o Projeto

### 1️⃣ Rodando Localmente com Docker Compose

- O banco de dados será executado localmente.
- Configure **nome, porta, usuário e senha** no arquivo `docker-compose.dev.yaml`.
- Crie um arquivo `.env` baseado no `.env.example`.
- Mesmo utilizando banco local, **configure o Cognito** seguindo a seção *Configuração do Cognito*.
- Para iniciar, execute:

```bash
npm run docker:dev
```

---

### 2️⃣ Rodando Localmente com Banco Próprio

- Tenha um banco de dados PostgreSQL configurado (próprio ou seguindo a seção *Banco de Dados Local*).
- Inicie o projeto com:

```bash
npm run build && npm run start
```

ou

```bash
npm run start:dev
```

---

## 🧪 Testes no Projeto

### ✅ Testes Unitários

```bash
npm run test:unit
```

### 🔄 Testes E2E

1. Configure um banco local seguindo a seção *Banco de Dados Local*.
2. O banco de testes **deve** ter as seguintes credenciais:

```
POSTGRES_DB=test
POSTGRES_USER=test
POSTGRES_PASSWORD=test
POSTGRES_PORT_HOST=5432
```

3. Rode:

```bash
npm run test:e2e
```

---

## 📖 Swagger (Documentação da API)

Com o projeto rodando, acesse:

```
http://localhost:${PORT}/docs
```

---

## 🗃️ Postgres + Postman

- Para acessar o Postgres via **Postman**, importe o arquivo:

```
caveo api.postman_collection.json
```

- Configure a variável de ambiente `URL` no Postman para usar as rotas.


---

## 📝 TODOs

- [ ] Implementar Lambda para que, caso seja atualizado um valor no AWS Cognito, essa atualização seja refletida no banco de dados.
- [ ] Implementar mensageria para que, a cada criação de usuário, seja acionada uma trigger para notificar áreas responsáveis, bancos próprios, data lake, etc.