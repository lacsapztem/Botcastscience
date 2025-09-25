import { SlashCommandBuilder } from 'discord.js';

const tchin = {
	data: new SlashCommandBuilder()
		.setName('tchin')
		.setDescription('commande biere en francais.')
    .addUserOption((option => option.setName('destinataire').setDescription('Choisi à qui offrir ta bière').setRequired(true)))
    .addStringOption(option =>
      option.setName('drink')
        .setDescription('La boisson à servir')
        .setRequired(true)
        .addChoices(
          { name: 'Bière', value: 'une bière' },
          { name: 'Jus de fruit', value: 'un jus de fruit' },
          { name: 'Soda', value: 'un soda' },
        ))
    ,
	async execute(interaction,callbacks) {
		// interaction.user is the object representinsg the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
    var recipient = "personne";
    var drink = " rien";
    interaction.options._hoistedOptions.forEach(element => {
      if(element.name == 'destinataire') {
        recipient = element.user.username 
      }
      if(element.name == 'drink') {
        drink = element.value
      }
    });
		await interaction.reply(`${interaction.user} offre ${drink} à ${recipient}`);
	},
};

export default tchin;
