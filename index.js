console.log("INSTANCE:", process.pid);
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const OWNER_ID = "1109183147968581713";
const ROLE_ID = "1522929172123484282";

const events = new Map();

client.once("clientReady", () => {
    console.log(`✅ ${client.user.tag} is online!`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const content = message.content.trim();
    const args = content.split(/\s+/);
    const cmd = args[0]?.toLowerCase();

    if (cmd === "!createevent") {

        if (message.author.id !== OWNER_ID) {
            return message.reply("❌ Alleen de owner kan events aanmaken.");
        }

        if (args.length < 4) {
            return message.reply("❌ Gebruik: !createevent <naam> <datum> <tijd>");
        }

        const [_, name, date, time] = args;

        const embed = new EmbedBuilder()
            .setColor(0x00AEFF)
            .setTitle(`🎉 ${name} Event`)
            .addFields(
                { name: "📅 Datum", value: date, inline: true },
                { name: "⏰ Tijd", value: time, inline: true },
                { name: "✅ RSVP", value: "Reageer met ✅ of ❌" }
            )
            .setTimestamp();

        const msg = await message.channel.send({
            content: `<@&${ROLE_ID}> 🎉 Nieuw event!`,
            embeds: [embed]
        });

        await msg.react("✅");
        await msg.react("❌");

        events.set(msg.id, { name, date, time });

        return;
    }

    if (cmd === "!events") {

        if (events.size === 0) {
            return message.reply("❌ Geen events gevonden.");
        }

        const list = [...events.values()]
            .map((e, i) => `${i + 1}. ${e.name} - ${e.date} ${e.time}`)
            .join("\n");

        return message.channel.send(`📅 **Events:**\n\n${list}`);
    }
});

client.login(process.env.TOKEN);