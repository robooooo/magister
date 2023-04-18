/* eslint-disable no-unused-vars */
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const { Client, Events, GatewayIntentBits, Status } = require("discord.js");
const { discordToken, cohereToken } = require("./peon.json");
const randomColor = require("randomcolor");
const cohere = require("cohere-ai");
cohere.init(cohereToken);

async function ask(prompt) {
    const res = await cohere.generate({ prompt: prompt })
    console.log(res)
    return res.body.generations[0].text
}

const client = new Client({
    intents: Object.keys(GatewayIntentBits)
});

client.on(Events.Error, (e) => {
    console.log(e.message);
});

async function giveRandomItem(e) {
    if (random(0, 2) === 0) {
        const col = randomColor().replace("#", "0x")
        e.channel.send({
            embeds: [{
                color: parseInt(col, 16),
                title: "You are offered a color.",
                fields: [{
                    name: "Color",
                    value: col
                }],
                description: "React with 🤝 to accept"
            }]
        });
    } else {
        const allChars = "qwertyuiopasdfghjklzxcvbnm";
        const prompt = [
            "The following is a list of usernames based on short acronyms.",
            "dcmc: don't call me chicken",
            "tsga: The supreme and great user Adam",
            "bapl: the bin apple",
            "myaz: zoo keeper",
            ""
        ].join("\n")
            + allChars[random(0, 25)]
            + allChars[random(0, 25)]
            + allChars[random(0, 25)]
            + allChars[random(0, 25)];
        const username = ask(prompt);
        e.channel.send({
            embeds: [{
                title: "You are offered a name.",
                fields: [{
                    name: "Name",
                    value: username
                }],
                description: "React with 🤝 to accept."
            }]
        })
    }
}


client.on(Events.MessageReactionAdd, async (e) => {
    if (e.message.id !== client.user.id) return;
    const emb = e.message.embeds[0];

    if (emb.title.includes("color")) {
        const users = await e.users.fetch();
        const col = e.message.embeds[0].fields[0].value;
        const role = await e.message.guild.roles.create({
            name: col,
            color: col,
        });
        const member = e.message.guild.members.resolve(users.first());
        await member.roles.add(role);

    } else if (emb.title.includes("name")) {
        const users = await e.users.fetch();
        const member = e.message.guild.members.resolve(users.first());
        await member.setNickname(e.message.embeds[0].fields[0].value);
    }
});

client.on(Events.MessageCreate, async (e) => {
    if (random(0, 100) === 0)
        await giveRandomItem(e);

    if (!e.content.startsWith("peon, ")) return;
    const content = e.content.replace(/^peon, /, "");


    if (content === "hi")
        e.channel.send("help me");
});

client.login(discordToken);

