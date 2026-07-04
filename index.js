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

// 🔑 OWNER ID (vul hier je Discord ID in)
const OWNER_ID = "1109183147968581713";

// 🔑 Role ID voor mentions
const roleId = "1522929172123484282";

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} is online!`);
});

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;

    const args = message.content.split(' ');

    // 🎉 CREATE EVENT
    if (args[0] === '!createevent') {

        // 🔒 OWNER CHECK
        if (message.author.id !== OWNER_ID) {
            return message.reply("❌ Alleen de owner kan events aanmaken.");
        }

        const params = args.slice(1);

        if (params.length < 3) {
            return message.reply("❌ Gebruik: !createevent <naam> <datum> <tijd>");
        }

        const name = params[0];
        const date = params[1];
        const time = params[2];

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

        events.push({ name, date, time });
    }

    // 📅 EVENTS LIJST
    if (args[0] === '!events') {

        if (events.length === 0) {
            return message.reply("❌ Geen events gevonden.");
        }

        const list = events.map((e, i) =>
            `${i + 1}. ${e.name} - ${e.date} ${e.time}`
        ).join('\n');

        return message.channel.send(`📅 **Events:**\n\n${list}`);
    }

});

client.login(process.env.TOKEN);