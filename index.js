const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const OWNER_ID = "1109183147968581713";
const ROLE_ID = "1522929172123484282";

let events = [];

client.once('clientReady', () => {
    console.log(`✅ ${client.user.tag} is online!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const args = message.content.trim().split(/\s+/);

    if (args[0] === "!createevent") {

        console.log(`!createevent ontvangen van ${message.author.tag}`);

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
            .setTimestamp();

        console.log("Verstuur event...");

        const sent = await message.channel.send({
            content: `<@&${ROLE_ID}> 🎉 Nieuw event!`,
            embeds: [embed]
        });

        await sent.react("✅");
        await sent.react("❌");

        events.push({ name, date, time });

        console.log("Event verstuurd.");
        return;
    }

    if (args[0] === "!events") {
        if (events.length === 0) {
            return message.reply("❌ Geen events gevonden.");
        }

        const list = events
            .map((e, i) => `${i + 1}. ${e.name} - ${e.date} ${e.time}`)
            .join("\n");

        return message.channel.send(`📅 **Events:**\n\n${list}`);
    }
});

client.login(process.env.TOKEN);