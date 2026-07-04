const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 📦 Events opslag (tijdelijk)
let events = [];

// 🔒 Zet hier jouw Discord ID
const OWNER_ID = "1109183147968581713";

// 📢 Role ID voor event mentions
const roleId = "1522929172123484282";

client.once('clientReady', () => {
    console.log(`✅ ${client.user.tag} is online!`);
});

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;

    const args = message.content.trim().split(/\s+/);

    // Alleen !createevent
    if (args[0] === '!createevent') {

        // 🔒 Alleen owner
        if (message.author.id !== OWNER_ID) {
            return message.reply("❌ Alleen de owner kan events aanmaken.");
        }

        if (args.length < 4) {
            return message.reply("❌ Gebruik: !createevent <naam> <datum> <tijd>");
        }

        const name = args[1];
        const date = args[2];
        const time = args[3];

        const embed = new EmbedBuilder()
            .setColor(0x00AEFF)
            .setTitle(`🎉 ${name} Event`)
            .addFields(
                { name: "📅 Datum", value: date, inline: true },
                { name: "⏰ Tijd", value: time, inline: true },
                { name: "✅ RSVP", value: "Reageer met ✅ of ❌" }
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

        return;
    }

    // 📅 Eventlijst
    if (args[0] === '!events') {

        if (events.length === 0) {
            return message.reply("❌ Geen events gevonden.");
        }

        const list = events
            .map((e, i) => `${i + 1}. ${e.name} - ${e.date} ${e.time}`)
            .join('\n');

        return message.channel.send(`📅 **Events:**\n\n${list}`);
    }

});

client.login(process.env.TOKEN);