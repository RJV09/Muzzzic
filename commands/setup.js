const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup the music control panel'),
  async execute(inter, client) {
    const embed = new EmbedBuilder()
      .setTitle('🎶 Music Control Panel')
      .setDescription('Use the buttons below to control playback:\n➡️ Play ▶️ Resume ⏸ Pause ⏭ Skip ⏹ Stop');
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('play').setLabel('▶️ Resume').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('pause').setLabel('⏸ Pause').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('skip').setLabel('⏭ Skip').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('stop').setLabel('⏹ Stop').setStyle(ButtonStyle.Danger),
    );
    await inter.reply({ embeds: [embed], components: [row] });
  }
};
