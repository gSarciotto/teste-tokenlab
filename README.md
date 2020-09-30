# teste-tokenlab

Upei o projeto no [Heroku](http://powerful-harbor-82971.herokuapp.com), logo não precisa realmente seguir os passos a seguir :)
(Obs: utilizar o Chrome para testar)

Para iniciar o projeto, primeiro precisamos fazer os seguintes passos:

1. Criar uma database no **PostgresSQL**
2. Executar o arquivo em `backend/src/setupDatabase.sql`, ex: se estivermos dentro da pasta `backend`, basta executar no `psql`: `\i src/setupDatabase.sql`
3. Na pasta `backend` criar um arquivo `.env` contendo:
  - `DB_CONNECTION=postgresql://<usuarioPostgres>:<senha>@localhost/<nomeDatabase>`
  - `JWT_SECRET=thisAveRYlongRANDOMsTrINg`
4. Executar o script `npm run start` na pasta `backend`
    - Esperar aparecer uma mensagem do tipo: app listening on...
5. Executar o script `npm run start` na pasta `frontend`, ele deve abrir o app no browser (utilizar de preferência o Chrome)
