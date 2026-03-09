# Sistema de Direito Penal Angolano - API

Sistema Web Inteligente para Assistência na Aplicação do Direito Penal Angolano com Base em Fatos e Leis Vigentes.

## 📋 Pré-requisitos

- **Java 17+** 
- **PostgreSQL 14+** com extensões:
  - `uuid-ossp`
  - `postgis` (para dados geográficos)
  - `pg_trgm` (para busca fuzzy)
- **Maven 3.8+** (ou use o wrapper `mvnw`)

## 🗄️ Configuração do Banco de Dados

### 1. Criar o banco de dados

```sql
CREATE DATABASE sistema_penal;
```

### 2. Conectar ao banco e criar extensões

```sql
\c sistema_penal

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### 3. Configurar credenciais

Edite o arquivo `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/sistema_penal
    username: seu_usuario
    password: sua_senha
```

Ou use variáveis de ambiente:

```bash
set DB_URL=jdbc:postgresql://localhost:5432/sistema_penal
set DB_USERNAME=postgres
set DB_PASSWORD=sua_senha
```

## 🔑 Configuração de Segurança

### JWT Secret

Defina uma chave secreta forte para JWT:

```bash
set JWT_SECRET=sua-chave-secreta-muito-longa-com-pelo-menos-256-bits
```

### OpenAI API Key (para funcionalidades de IA)

```bash
set OPENAI_API_KEY=sk-sua-chave-openai
```

## 🚀 Executar a Aplicação

### Opção 1: Usando Maven Wrapper (recomendado)

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

### Opção 2: Compilar e executar JAR

```bash
# Compilar
.\mvnw.cmd clean package -DskipTests

# Executar
java -jar target/sistema_penal-0.0.1-SNAPSHOT.jar
```

### Opção 3: Usando Maven instalado

```bash
mvn spring-boot:run
```

## 📍 Endpoints Principais

Após iniciar, acesse:

| URL | Descrição |
|-----|-----------|
| http://localhost:8080/api/swagger-ui.html | Documentação Swagger UI |
| http://localhost:8080/api/api-docs | OpenAPI JSON |
| http://localhost:8080/api/actuator/health | Health Check |

## 🔐 Autenticação

### Registrar usuário

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Admin","email":"admin@example.com","senha":"123456"}'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","senha":"123456"}'
```

### Usar token em requisições

```bash
curl -X GET http://localhost:8080/api/leis \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

## 📁 Estrutura do Projeto

```
src/main/java/com/api/sistema_penal/
├── api/
│   ├── controller/     # REST Controllers
│   └── dto/            # Data Transfer Objects
├── domain/
│   ├── entity/         # Entidades JPA
│   └── repository/     # Spring Data Repositories
├── service/            # Lógica de negócio
├── security/           # JWT e Spring Security
├── config/             # Configurações
├── scheduler/          # Jobs agendados
└── exception/          # Tratamento de exceções
```

## 🧪 Testes

```bash
.\mvnw.cmd test
```

## 📊 Módulos Disponíveis

- **Autenticação**: JWT, refresh tokens, roles
- **Legislação**: Leis, artigos, busca full-text
- **Processos**: Gestão de processos judiciais
- **Sentenças**: Registro e análise de jurisprudência
- **Denúncias**: Portal de denúncias anônimas
- **Chat IA**: Assistente jurídico com OpenAI
- **Previsões**: Análise preditiva de penas
- **Mapa Criminal**: Visualização geográfica
- **Relatórios**: Exportação de dados (CSV, JSON)
- **Notificações**: Sistema de alertas
- **Portal do Cidadão**: Conteúdos educativos

## 🐳 Docker (Opcional)

```bash
# Subir PostgreSQL com Docker
docker run -d \
  --name postgres-penal \
  -e POSTGRES_DB=sistema_penal \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgis/postgis:14-3.2
```

## 📝 Licença

Projeto acadêmico - Sistema de Direito Penal Angolano
