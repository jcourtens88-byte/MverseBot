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

const events = [];

client.once("clientReady", () => {
    console.log(`✅ ${client.user.tag} is online!`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const args = message.content.trim().split(/\s+/);
    const command = args.shift()?.toLowerCase();

    switch (command) {

        case "!createevent": {

            if (message.author.id !== OWNER_ID) {
                return message.reply("❌ Alleen de owner kan events aanmaken.");
            }

            if (args.length < 3) {
                return message.reply("❌ Gebruik: !createevent <naam> <datum> <tijd>");
            }

            const [name, date, time] = args;

            const embed = new EmbedBuilder()
                .setColor(0x00AEFF)
                .setTitle(`🎉 ${name} Event`)
                .addFields(
                    { name: "📅 Datum", value: date, inline: true },
                    { name: "⏰ Tijd", value: time, inline: true },
                    { name: "✅ RSVP", value: "Reageer met ✅ of ❌" }
                )
                .setTimestamp();

            const eventMessage = await message.channel.send({
                content: `<@&${ROLE_ID}> 🎉 Nieuw event!`,
                embeds: [embed]
            });

            await eventMessage.react("✅");
            await eventMessage.react("❌");

            events.push({ name, date, time });

            break;
        }

        case "!events": {

            if (events.length === 0) {
                return message.reply("❌ Geen events gevonden.");
            }

            const list = events
                .map((event, index) => `${index + 1}. ${event.name} - ${event.date} ${event.time}`)
                .join("\n");

            return message.channel.send(`📅 **Events:**\n\n${list}`);
        }

        default:
            return;
    }
});

client.login(process.env.TOKEN);