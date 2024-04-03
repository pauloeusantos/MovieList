// server.js
import express from 'express';
import bodyParser from 'body-parser';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const app = express();
const PORT = process.env.PORT || 3000;
const adapter = new FileSync('db.json');
const db = low(adapter);

// Inicializa o banco de dados com uma estrutura básica
db.defaults({ movies: [] }).write();

app.use(bodyParser.json());

// Rota para obter a lista de filmes
app.get('/movies', (req, res) => {
  const movies = db.get('movies').value();
  res.json(movies);
});

// Rota para adicionar um novo filme
app.post('/movies', (req, res) => {
  const newMovie = req.body;
  db.get('movies').push(newMovie).write();
  res.json(newMovie);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
