import express from 'express';
import { Pool } from 'pg';

const app = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({
  user: 'koyaaoyama',
  host: 'localhost',
  database: 'postgres',
  password: '',
  port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('PostgreSQL connected:', res.rows);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
