import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

// Parse JSON and URL-encoded data
app.use(express.urlencoded({ extended: false }));
app.use(express.json({}));

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.get('/test', (req, res) => {
  res.json({
    text: 'testing string',
  });
});

export default app;
