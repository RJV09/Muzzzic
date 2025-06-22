require('dotenv').config();
const { Client, Collection, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { DisTube } = require('distube');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
client.distube = new DisTube(client, { leaveOnStop: false, leaveOnEmpty: true, youtubeDL: false, plugins: [] });

['setup'].forEach(cmd => {
  const command = require(`./commands/${cmd}.js`);
  client.commands.set(command.data.name, command);
});

client.on('interactionCreate', async inter => {
  if (inter.isChatInputCommand()) {
    const cmd = client.commands.get(inter.commandName);
    if (!cmd) return;
    return cmd.execute(inter, client);
  }
  if (inter.isButton()) {
    const queue = client.distube.getQueue(inter.guildId);
    switch (inter.customId) {
      case 'play': return queue ? queue.resume() : inter.reply({ content: 'Nothing to play.', ephemeral: true });
      case 'pause': return queue ? queue.pause() : inter.reply({ content: 'Nothing to pause.', ephemeral: true });
      case 'skip': return client.distube.skip(inter.guildId) && inter.reply({ content: '⏭ Skipped.', ephemeral: true });
      case 'stop': return client.distube.stop(inter.guildId) && inter.reply({ content: '⏹ Stopped.', ephemeral: true });
    }
  }
});

client.distube.on('playSong', (queue, track) => {
  const embed = new EmbedBuilder()
    .setTitle("Now Playing")
    .setDescription(`[${track.name}](${track.url}) — ${track.formattedDuration}`)
    .setThumbnail(track.thumbnail)
    .setFooter({ text: `Requested by ${track.user.tag}` });
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('pause').setLabel('⏸ Pause').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('play').setLabel('▶️ Resume').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('skip').setLabel('⏭ Skip').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('stop').setLabel('⏹ Stop').setStyle(ButtonStyle.Danger),
  );
  queue.textChannel.send({ embeds: [embed], components: [row] });
});

client.distube.on('addSong', (queue, track) => {
  queue.textChannel.send(`✅ Added **${track.name}** — ${track.formattedDuration} to the queue by ${track.user.tag}`);
});

client.login(process.env.TOKEN);