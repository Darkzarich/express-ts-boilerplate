import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.get('/test', (req, res) => {
  res.json({
    text: 'testing string',
  });
});

export default app;
