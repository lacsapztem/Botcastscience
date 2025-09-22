import 'dotenv/config.js';

// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits } from 'discord.js';
import imageHarvester from './imageHarvester.js';
import commandManager from './commandsMgmt.js';
const token = process.env.DISCORD_TOKEN;
//console.log(token)


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });


const scanImgCallback = (ChannelId) => {
  imageHarvester.launchImageScanner(ChannelId,client);
}

const scanImgStopCallback = (ChannelId) => {
  imageHarvester.stopImageScanner(ChannelId,client);
}

const startBot  = () => {
  console.log(`Starting the Bot`);
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    commandManager(client,{
      scanImg : scanImgCallback,
      scanImgStop:scanImgStopCallback,
    });
  imageHarvester.launchImageScanner("397711811778052099",client)
  });
  // Log in to Discord with your client's token
  client.login(token);
}

const botcastscience = {
  imageHarvester: {
    countAttachment: imageHarvester.countAttachment,  // a ChannelId as parameter 
    getImageList: imageHarvester.getImageList,        // a ChannelId as parameter
    registerNewImageCallback: imageHarvester.registerNewImageCallback, 
    getCurrentCursor: imageHarvester.getCurrentCursor,
    setCurrentCursor: imageHarvester.setCurrentCursor,
  },
  startBot // No parameter
};

export default botcastscience;
