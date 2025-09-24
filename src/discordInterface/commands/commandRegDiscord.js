import { REST, Routes }  from 'discord.js';
import 'dotenv/config.js';
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.APP_ID;
import scanImg from './utility/scanImg.js';
import biere from './utility/biere.js';
import scanImgUrl from './utility/scanImgUrl.js';
import scanImgStop from './utility/scanImgStop.js';
const commands = [];
commands.push(scanImg.data.toJSON());
commands.push(biere.data.toJSON());
commands.push(scanImgUrl.data.toJSON());
commands.push(scanImgStop.data.toJSON());

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
		// The put method is used to fully refresh all commands in the guild with the current set
		await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

		console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();