import { SlashCommandBuilder } from 'discord.js';

const biere = {
	data: new SlashCommandBuilder()
		.setName('biere')
		.setDescription('commande biere en francais.')
    .addUserOption((option => option.setName('destinataire').setDescription('Choisi à qui offrir ta bière').setRequired(true))),
	async execute(interaction,callbacks) {
		// interaction.user is the object representinsg the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
    console.log(interaction.user)
    const recipient = interaction.options._hoistedOptions[0].user.username;
		await interaction.reply(`${interaction.user} offre une bière (ou autre chose) à ${recipient}`);
	},
};

export default biere;
