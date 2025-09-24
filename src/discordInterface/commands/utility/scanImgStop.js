import { SlashCommandBuilder } from 'discord.js';
import 'dotenv/config.js';
const proto = process.env.PROTO || "http";
const server = process.env.SERVER || "localhost";
const port = process.env.PORT ? ':' + process.env.PORT : "";
const baseUrl = proto + '://' + server + port

const scanImgStop = {
	data: new SlashCommandBuilder()
		.setName('stopscanimage')
		.setDescription("Arrete un scanimage"),
	async execute(interaction,callbacks) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
    callbacks.scanImgStop(interaction.channelId)
		await interaction.reply(`Scan stopped`);
	},
};


export default scanImgStop