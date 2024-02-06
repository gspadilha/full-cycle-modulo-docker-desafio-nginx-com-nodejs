const express = require("express");
const random_name = require("node-random-name");
const mysql = require("mysql");

const PORT = 3000;

const app = express();

const dbConfig = {
  host: "db",
  user: "root",
  password: "password",
  database: "nodedb",
};

app.get("/", (_req, res) => {
  saveNameOnDB(res);
});

app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});

async function saveNameOnDB(res) {
  const INSERT_QUERY = `INSERT INTO people (name) VALUES ('${random_name()}')`;

  const connection = mysql.createConnection(dbConfig);

  connection.query(INSERT_QUERY, (error, _results, _fields) => {
    if (error) {
      const m = `Erro inserindo o nome: ${error}`;
      console.log(`${m}`);
      res.status(500).send(m);
      return;
    }

    console.log(`Registro inserido com sucesso!`);
    getAll(res, connection);
  });
}

function showAll(people) {
  return people.map((person) => `<li>${person.name}</li>`).join("");
}

function getAll(res, connection) {
  const SELECT_QUERY = `SELECT id, name FROM people`;

  connection.query(SELECT_QUERY, (error, people) => {
    if (error) {
      const m = `Erro buscando o nome: ${error}`;
      console.log(`${m}`);
      res.status(500).send(m);
      return;
    }

    console.log(`Registros achados com sucesso!`);
    res.send(`<h1>Full Cycle Rocks!</h1><ol>${showAll(people)}<ol>`);
    connection.end();
  });
}
