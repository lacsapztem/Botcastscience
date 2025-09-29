import { SlashCommandBuilder } from 'discord.js';
import 'dotenv/config.js';
const proto = process.env.PROTO || "http";
const server = process.env.SERVER_ADDRESS || "localhost";
const port = process.env.PORT ? ':' + process.env.PORT : "";
const baseUrl = proto + '://' + server + port

const scanImg = {
	data: new SlashCommandBuilder()
		.setName('scanimage')
		.setDescription("Lance un robot qui permet d'afficher les images d'un channel sur une page web")
    .addBooleanOption(option =>
      option.setName('updateonnew')
        .setDescription('Faut-il mettre à jour les clients en cas de nouvelle image ?')
        .setRequired(true))
    .setDefaultMemberPermissions(0),
	async execute(interaction,callbacks) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
    var updateOnNewVal = true
    interaction.options._hoistedOptions.forEach(element => {
      if(element.name == 'updateonnew') {
        updateOnNewVal = element.value
      }
    })
    callbacks.scanImg(interaction.channelId,updateOnNewVal)
		await interaction.reply(`you can now find images from this channel on ${baseUrl}/channel/${interaction.channelId}/`);
	},
};


export default scanImg