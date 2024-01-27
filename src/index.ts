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

app.post('/urls', async (req, res) => {
  const { user_id, short, long } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO urls (user_id, short, long) VALUES ($1, $2, $3) RETURNING *',
      [user_id, short, long]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/urls/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM urls WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('URL not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.put('/urls/:id', async (req, res) => {
  const { id } = req.params;
  const { short, long } = req.body;

  try {
    const result = await pool.query(
      'UPDATE urls SET short = $1, long = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [short, long, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('URL not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.delete('/urls/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM urls WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('URL not found');
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
