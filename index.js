const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 📦 events opslag (tijdelijk)
let events = [];

// 🔑 PLAATS HIER JE ROLE ID (Events rol)
const roleId = "1522929172123484282";

client.once('clientReady', () => {
    console.log(`✅ ${client.user.tag} is online!`);
});

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;

    // 🎉 CREATE EVENT
    if (message.content.startsWith('!createevent')) {

        const args = message.content.split(' ').slice(1);

        if (args.length < 3) {
            return message.reply("❌ Gebruik: !createevent <naam> <datum> <tijd>");
        }

        const name = args[0];
        const date = args[1];
        const time = args[2];

        const embed = new EmbedBuilder()
            .setColor(0x00AEFF)
            .setTitle(`🎉 ${name} Event`)
            .addFields(
                { name: "📅 Datum", value: date, inline: true },
                { name: "⏰ Tijd", value: time, inline: true },
                { name: "✅ RSVP", value: "Reageer met ✅ of ❌", inline: false }
            )
            .setFooter({ text: "Pro Event Bot" })
            .setTimestamp();

        const sent = await message.channel.send({
            content: `<@&${roleId}> 🎉 Nieuw event!`,
            embeds: [embed]
        });

        await sent.react('✅');
        await sent.react('❌');

        events.push({
            name,
            date,
            time
        });
    }

    // 📅 EVENTS LIJST
    if (message.content === '!events') {

        if (events.length === 0) {
            return message.reply("❌ Geen events gevonden.");
        }

        const list = events.map((e, i) =>
            `${i + 1}. ${e.name} - ${e.date} ${e.time}`
        ).join('\n');

        message.channel.send(`📅 **Events:**\n\n${list}`);
    }

});

client.login(process.env.TOKEN);