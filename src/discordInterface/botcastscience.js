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

const startBot  = (ChannelId) => {
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    
    commandManager(client,{
      scanImg : scanImgCallback,
    });
  });

  // Log in to Discord with your client's token
  client.login(token);
}

const botcastscience = {
  imageHarvester: {
    countAttachment: imageHarvester.countAttachment,
    getImageList: imageHarvester.getImageList,
    registerNewImageCallback: imageHarvester.registerNewImageCallback,
  },
  startBot
};

export default botcastscience;
