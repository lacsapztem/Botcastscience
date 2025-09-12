import 'dotenv/config.js';

// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits } from 'discord.js';
const token = process.env.DISCORD_TOKEN;
//console.log(token)

const ImageList = [];
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
// eslint-disable-next-line prettier/prettier
var NewImageCallback = () => { return null };
const registerNewImageCallback = (func) => {
  NewImageCallback = func;
};

const getImageAttachment = (message) => {
  message.attachments.forEach((file) => {
    if (file.contentType && file.contentType.startsWith('image/')) ImageList.push(file);
  });
  NewImageCallback();
};

const parseMessageList = (messages) => {
  console.log(`Received ${messages.size} messages`);
  //Iterate through the messages here with the variable "messages".
  messages.forEach(getImageAttachment);
  console.log(`found ${ImageList.length} file(s)`);
};

const filterAttachementMsg = (message) => message.attachments.size > 0;

const initChannel = (channel) => {
  //console.log(channel);
  channel.messages.fetch({ limit: 100 }).then(parseMessageList);
  const collector = channel.createMessageCollector({ filterAttachementMsg, Max: 1 });
  collector.on('collect', getImageAttachment);
  collector.on('end', (collected) => console.log(`End of message collector`, collected));
};

const launchImageScanner = (ChannelId) => {
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    client.channels.fetch(ChannelId).then(initChannel).catch(console.error);
  });

  // Log in to Discord with your client's token
  client.login(token);
};

const countAttachment = () => {
  console.log(`There is ${ImageList.length} file(s)`);
  setTimeout(countAttachment, 10000);
};
const getImageList = () => ImageList;

const botcastscience = {
  countAttachment,
  getImageList,
  launchImageScanner,
  registerNewImageCallback,
};
export default botcastscience;
