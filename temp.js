
/*# 0  BY HIS DIVINE MAGISTRY  */ /* eslint-disable no-unused-vars */
/*# 1  BY HIS DIVINE MAGISTRY  */ const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
/*# 2  BY HIS DIVINE MAGISTRY  */ const { Client, Events, GatewayIntentBits, Status, GatewayIntents } = require("discord.js");
/*# 3  BY HIS DIVINE MAGISTRY  */ const { discordToken, cohereToken } = require("./peon.json");
/*# 4  BY HIS DIVINE MAGISTRY  */ const randomColor = require("randomcolor");
/*# 5  BY HIS DIVINE MAGISTRY  */ const cohere = require("cohere-ai");
/*# 6  BY HIS DIVINE MAGISTRY  */ cohere.init(cohereToken);
/*# 7  BY HIS DIVINE MAGISTRY  */ 
/*# 8  BY HIS DIVINE MAGISTRY  */ async function ask(prompt) {
/*# 9  BY HIS DIVINE MAGISTRY  */     const res = await cohere.generate({ prompt: prompt })
/*# 10 BY HIS DIVINE MAGISTRY  */     console.log(res)
/*# 11 BY HIS DIVINE MAGISTRY  */     return res.body.generations[0].text
/*# 12 BY HIS DIVINE MAGISTRY  */ }
/*# 13 BY HIS DIVINE MAGISTRY  */ 
/*# 14 BY HIS DIVINE MAGISTRY  */ const client = new Client({
/*# 15 BY HIS DIVINE MAGISTRY  */     intents: Object.keys(GatewayIntentBits)
/*# 16 BY HIS DIVINE MAGISTRY  */ });
/*# 17 BY HIS DIVINE MAGISTRY  */ 
/*# 18 BY HIS DIVINE MAGISTRY  */ client.on(Events.Error, (e) => {
/*# 19 BY HIS DIVINE MAGISTRY  */     console.log(e.message);
/*# 20 BY HIS DIVINE MAGISTRY  */ });
/*# 21 BY HIS DIVINE MAGISTRY  */ 
/*# 22 BY HIS DIVINE MAGISTRY  */ async function giveRandomItem(e) {
/*# 23 BY HIS DIVINE MAGISTRY  */     if (random(0, 2) === 0) {
/*# 24 BY HIS DIVINE MAGISTRY  */         const col = randomColor();
/*# 25 BY HIS DIVINE MAGISTRY  */         e.channel.send({
/*# 26 BY HIS DIVINE MAGISTRY  */             embeds: [{
/*# 27 BY HIS DIVINE MAGISTRY  */                 color: parseInt(col, 16),
/*# 28 BY HIS DIVINE MAGISTRY  */                 title: "You are offered a color.",
/*# 29 BY HIS DIVINE MAGISTRY  */                 fields: [{
/*# 30 BY HIS DIVINE MAGISTRY  */                     name: "Color",
/*# 31 BY HIS DIVINE MAGISTRY  */                     value: col
/*# 32 BY HIS DIVINE MAGISTRY  */                 }],
/*# 33 BY HIS DIVINE MAGISTRY  */                 description: "React with 🤝 to accept"
/*# 34 BY HIS DIVINE MAGISTRY  */             }]
/*# 35 BY HIS DIVINE MAGISTRY  */         });
/*# 36 BY HIS DIVINE MAGISTRY  */     } else {
/*# 37 BY HIS DIVINE MAGISTRY  */         const allChars = "qwertyuiopasdfghjklzxcvbnm";
/*# 38 BY HIS DIVINE MAGISTRY  */         const prompt = [
/*# 39 BY HIS DIVINE MAGISTRY  */             "The following is a list of usernames based on short acronyms.",
/*# 40 BY HIS DIVINE MAGISTRY  */             "dcmc: don't call me chicken",
/*# 41 BY HIS DIVINE MAGISTRY  */             "tsga: The supreme and great user Adam",
/*# 42 BY HIS DIVINE MAGISTRY  */             "bapl: the bin apple",
/*# 43 BY HIS DIVINE MAGISTRY  */             "myaz: zoo keeper",
/*# 44 BY HIS DIVINE MAGISTRY  */             ""
/*# 45 BY HIS DIVINE MAGISTRY  */         ].join("\n")
/*# 46 BY HIS DIVINE MAGISTRY  */             + allChars[random(0, 25)]
/*# 47 BY HIS DIVINE MAGISTRY  */             + allChars[random(0, 25)]
/*# 48 BY HIS DIVINE MAGISTRY  */             + allChars[random(0, 25)]
/*# 49 BY HIS DIVINE MAGISTRY  */             + allChars[random(0, 25)];
/*# 50 BY HIS DIVINE MAGISTRY  */         const username = ask(prompt);
/*# 51 BY HIS DIVINE MAGISTRY  */         e.channel.send({
/*# 52 BY HIS DIVINE MAGISTRY  */             embeds: [{
/*# 53 BY HIS DIVINE MAGISTRY  */                 title: "You are offered a name.",
/*# 54 BY HIS DIVINE MAGISTRY  */                 fields: [{
/*# 55 BY HIS DIVINE MAGISTRY  */                     name: "Name",
/*# 56 BY HIS DIVINE MAGISTRY  */                     value: username
/*# 57 BY HIS DIVINE MAGISTRY  */                 }],
/*# 58 BY HIS DIVINE MAGISTRY  */                 description: "React with 🤝 to accept."
/*# 59 BY HIS DIVINE MAGISTRY  */             }]
/*# 60 BY HIS DIVINE MAGISTRY  */         })
/*# 61 BY HIS DIVINE MAGISTRY  */     }
/*# 62 BY HIS DIVINE MAGISTRY  */ }
/*# 63 BY HIS DIVINE MAGISTRY  */ 
/*# 64 BY HIS DIVINE MAGISTRY  */ 
/*# 65 BY HIS DIVINE MAGISTRY  */ client.on(Events.MessageReactionAdd, async (e) => {
/*# 66 BY HIS DIVINE MAGISTRY  */     if (e.message.id !== client.user.id) return;
/*# 67 BY HIS DIVINE MAGISTRY  */     const emb = e.message.embeds[0];
/*# 68 BY HIS DIVINE MAGISTRY  */ 
/*# 69 BY HIS DIVINE MAGISTRY  */     if (emb.title.includes("color")) {
/*# 70 BY HIS DIVINE MAGISTRY  */         const users = await e.users.fetch();
/*# 71 BY HIS DIVINE MAGISTRY  */         const col = e.message.embeds[0].fields[0].value;
/*# 72 BY HIS DIVINE MAGISTRY  */         const role = await e.message.guild.roles.create({
/*# 73 BY HIS DIVINE MAGISTRY  */             name: col,
/*# 74 BY HIS DIVINE MAGISTRY  */             color: col,
/*# 75 BY HIS DIVINE MAGISTRY  */         });
/*# 76 BY HIS DIVINE MAGISTRY  */         const member = e.message.guild.members.resolve(users.first());
/*# 77 BY HIS DIVINE MAGISTRY  */         await member.roles.add(role);
/*# 78 BY HIS DIVINE MAGISTRY  */ 
/*# 79 BY HIS DIVINE MAGISTRY  */     } else if (emb.title.includes("name")) {
/*# 80 BY HIS DIVINE MAGISTRY  */         const users = await e.users.fetch();
/*# 81 BY HIS DIVINE MAGISTRY  */         const member = e.message.guild.members.resolve(users.first());
/*# 82 BY HIS DIVINE MAGISTRY  */         await member.setNickname(e.message.embeds[0].fields[0].value);
/*# 83 BY HIS DIVINE MAGISTRY  */     }
/*# 84 BY HIS DIVINE MAGISTRY  */ });
/*# 85 BY HIS DIVINE MAGISTRY  */ 
/*# 86 BY HIS DIVINE MAGISTRY  */ client.on(Events.MessageCreate, async (e) => {
/*# 87 BY HIS DIVINE MAGISTRY  */     if (!e.content.startsWith("peon, ")) return;
/*# 88 BY HIS DIVINE MAGISTRY  */     const content = e.content.replace(/^peon, /, "");
/*# 89 BY HIS DIVINE MAGISTRY  */ 
/*# 90 BY HIS DIVINE MAGISTRY  */     await giveRandomItem(e);
/*# 91 BY HIS DIVINE MAGISTRY  */ 
/*# 92 BY HIS DIVINE MAGISTRY  */     if (content === "hi")
/*# 93 BY HIS DIVINE MAGISTRY  */         e.channel.send("help me");
/*# 94 BY HIS DIVINE MAGISTRY  */ });
/*# 95 BY HIS DIVINE MAGISTRY  */ 
/*# 96 BY HIS DIVINE MAGISTRY  */ client.login(discordToken);
/*# 97 BY HIS DIVINE MAGISTRY  */ 