import {discordeno} from "./deps.ts"

const APP_ID = "870213788530540575"
const CLIENT_SECRET = "870213788530540575"
const BOT_TOKEN = "ODcwMjEzNzg4NTMwNTQwNTc1.YQJfvg.TVa62XYIxugNplSh15tPl3ncJuU"
const GUILD_ID = "700155253202616392"

const data: discordeno.CreateGuildApplicationCommand = {
    name: "create",
    description: "Creates a role menu that can be used by members to add roles.",
    options: [
        {
            name: "from-role",
            description: "Create a role menu for a pre-existing role.",
            type: 1,
            options: [
                {
                    name: "role",
                    description: "Role to create the menu for.",
                    type: 8,
                    required: true
                }
            ]
        },
        {
            name: "new-role",
            type: 1,
            description: "Create a role menu for a new role.",
            options: [
                {
                    name: "role-name",
                    description: "Name to use for the new role.",
                    type: 3,
                    required: true
                }
            ]
        }
    ]
}

const response = await fetch(`https://discord.com/api/v8/applications/${APP_ID}/guilds/${GUILD_ID}/commands`, {headers: {"Authorization": `Bot ${BOT_TOKEN}`, "Content-Type": "application/json"}, method: "POST", body: JSON.stringify(data)})

console.log(await response.text())