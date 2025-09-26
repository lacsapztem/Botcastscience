import { REST, Routes }  from 'discord.js';
import 'dotenv/config.js';
const token = process.env.DISCORD_TOKEN;
const servers = process.env.DISCORD_SERVERS.split(",");
const clientId = process.env.APP_ID;
import scanImg from './utility/scanImg.js';
import tchin from './utility/tchin.js';
import scanImgUrl from './utility/scanImgUrl.js';
import scanImgStop from './utility/scanImgStop.js';
const commands = [];
commands.push(scanImg.data.toJSON());
commands.push(tchin.data.toJSON());
commands.push(scanImgUrl.data.toJSON());
commands.push(scanImgStop.data.toJSON());

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

     


// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		// The put method is used to fully refresh all commands in the guild with the current set
    for(const idx in servers) {
      console.log("inscription du serveur "+ servers[idx])
      rest.put(
        Routes.applicationGuildCommands(clientId, servers[idx]),
        { body: commands },
      ).then(()=>{
      console.log(`Successfully reloaded ${commands.length} application (/) commands on server `+servers[idx]);
    });
    }
    
		
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
