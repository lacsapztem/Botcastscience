import { SlashCommandBuilder } from 'discord.js';
import 'dotenv/config.js';
const proto = process.env.PROTO || "http";
const server = process.env.SERVER || "localhost";
const port = process.env.PORT ? ':' + process.env.PORT : "";
const baseUrl = proto + '://' + server + port

const scanImgUrl = {
	data: new SlashCommandBuilder()
		.setName('imageurl')
		.setDescription("permet de récuperer l'url d'une scanimage en cours")
    .setDefaultMemberPermissions(0),
	async execute(interaction,callbacks) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply(`you can find images from this channel on ${baseUrl}/channel/${interaction.channelId}/`);
	},
};


export default scanImgUrl