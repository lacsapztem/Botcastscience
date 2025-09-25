import express from 'express';
import botcastscience from './discordInterface/botcastscience.js';
import dotenv from 'dotenv';
import cors from 'cors';
import crypto from "crypto";
import path from 'path';
//import routes from './routes/index.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const PORT = process.env.PORT ?? 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
console.log('Let"s start the bot');
botcastscience.startBot();
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
import { log } from 'console';

app.use(webpackDevMiddleware(compiler, { publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.set('views', path.join(__dirname, 'client/views'));
app.set('view engine', 'ejs');

//créé des callback permettant d'envoyer des evenements aux clients
const clientCallbacks=[]



app.get('/', (req, res) => {
  console.log("Serving channelId ");
  res.write('Server running...'); 
});


app.get('/channel/:channelId/', (req, res) => {
  const ChannelId = req.params.channelId;
  //console.log("Serving channelId ",ChannelId);
  res.render('index', {ChannelId : ChannelId});
});

app.post('/:channelId/updatecursor/', (req, res) => {
  try {
    const cursor = req.body.cursor;
    const ChannelId = req.params.channelId;
    //console.log("update Cursor for channelId "+ChannelId,cursor);
    botcastscience.imageHarvester.setCurrentCursor(ChannelId,cursor);
    if(clientCallbacks[ChannelId]) {
      const tmptab=clientCallbacks[ChannelId].clients;
      for (const clt in tmptab) { 
        //console.log('envoi d un curseur',clt)
        tmptab[clt].udpateCursor(cursor); 
      }
    }
    //res.write("data : 0\n\n");
    res.sendStatus(200);
    log("envoyé")
   } catch(e) {
       console.log(e);
       res.sendStatus(500);
   }
});

app.get('/:channelId/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');


  const id = req.params.clientId || crypto.randomBytes(16).toString("hex");

  console.log(id + ' : start events',req.params);

  const ChannelId = req.params.channelId;

  const dataInit = {
    type : 'imagelist',
    data : botcastscience.imageHarvester.getImageList(ChannelId),
    cursor : botcastscience.imageHarvester.getCurrentCursor(ChannelId),
    id : id
  }

  //envoi la liste des images existentes
  res.write(`data: ${JSON.stringify(dataInit)}\n\n`);
  
  if( ! clientCallbacks[ChannelId] ) {
    clientCallbacks[ChannelId] =  {
      clients : []
    }
  }

  clientCallbacks[ChannelId].clients[id]=({
    channel : ChannelId,
    id : id,
    udpateCursor : (newCursor) => {
        const data = {
          type : 'cursor',
          data : newCursor,
          id : id
        }
        console.log("sending cursor " + newCursor + " to " + id);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
  });

  //const timer=setInterval(tmpfonc,1000)
  //déclare une callback qui sera lancé a chaque mise à à jour de la liste d'image
  botcastscience.imageHarvester.registerNewImageCallback(() => {
    const data = {
      type : 'imagelist',
      data : botcastscience.imageHarvester.getImageList(ChannelId),
      cursor : botcastscience.imageHarvester.getCurrentCursor(ChannelId),
    }
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });

  req.on('close', () => {
    //supprime le client de la liste des callbacks
    delete clientCallbacks[ChannelId].clients[id];
    res.end();
  });
});

app.get('/:channelId/imglist', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(botcastscience.imageHarvester.getImageList(req.params.channelId)));
});







//Lancement du serveur web pour l'interface
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
