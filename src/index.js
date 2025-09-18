import express from 'express';
import botcastscience from './discordInterface/botcastscience.js';
import dotenv from 'dotenv';
import cors from 'cors';


import path from 'path';
//import routes from './routes/index.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const PORT = process.env.PORT ?? 8000;
const DISCORD_CHANNEL = process.env.DISCORD_CHANNEL;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
botcastscience.launchImageScanner(DISCORD_CHANNEL);
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/public')));

import webpack from 'webpack';
import config from '../webpack.client.config.js';
const compiler = webpack(config);

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

app.use(webpackDevMiddleware(compiler, { publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.set('views', path.join(__dirname, 'client/views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', botcastscience.getImageList());
});

app.get('/imglist', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(botcastscience.getImageList()));
});

app.get('/events', (req, res) => {
  console.log('start events');
  // Set headers to establish SSE connection
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(`data: ${JSON.stringify(botcastscience.getImageList())}\n\n`);
  // Send a message every 5 seconds for demonstration purposes
  botcastscience.registerNewImageCallback(() => {
    res.write(`data: ${JSON.stringify(botcastscience.getImageList())}\n\n`);
  });
  //const intervalId = setInterval(() => {
  //  const message = { data: 'Hello from the server!' };
  //  res.write(`data: ${JSON.stringify(message)}\n\n`);
  //}, 5000);
  // Close the connection when the client disconnects
  req.on('close', () => {
    //clearInterval(intervalId);
    res.end();
  });
});

//Lancement du serveur web pour l'interface
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
