import {  Collection, Events, MessageFlags } from 'discord.js';


import scanImg from './commands/utility/scanImg.js';
import biere from './commands/utility/biere.js';
import scanImgUrl from './commands/utility/scanImgUrl.js';
import scanImgStop from './commands/utility/scanImgStop.js';


const commandManager = (client,callbacks) => {

  client.commands = new Collection();
  
  client.commands.set(scanImg.data.name, scanImg);
  client.commands.set(scanImgUrl.data.name, scanImgUrl);
  client.commands.set(scanImgStop.data.name, scanImgStop);
  client.commands.set(biere.data.name, biere);

  client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      command.execute(interaction,callbacks);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
      } else {
        interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
      }
    }
  });
}

export default commandManager;