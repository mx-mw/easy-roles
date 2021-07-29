import {discordeno} from "./deps.ts"

type CommandHandler = (interaction: discordeno.SlashCommandInteraction) => discordeno.InteractionResponse

const hello: CommandHandler = (interaction: discordeno.SlashCommandInteraction) => {
    const argument = interaction.data?.options?.find(option => option.name === "name")

    if (!argument || argument.type !== discordeno.ApplicationCommandOptionTypes.String) {
        throw {message: "Invalid Argument Type: Expected String"}
    }

    return {
        // Type 4 responds with the below message retaining the user's
        // input at the top.
        type: discordeno.InteractionResponseTypes.ChannelMessageWithSource,
        data: {
            content: `Hello, ${argument.value}!`,
        }
    }
}

// /create new "Role Name"
// /create from-role @existing-role
const create: CommandHandler = (interaction: discordeno.SlashCommandInteraction) => {
    const fromRole = interaction.data?.options?.some(option => option.name === "from-role") || false
    const newRole = interaction.data?.options?.some(option => option.name === "new-role") || false

    if (fromRole === newRole) {
        throw {message: "Missing subcommand. Should be: `new-role` or `from-role`."}
    } else if (newRole) {
        const roleNameArg = interaction.data?.options?.find(option => option.name === "role-name")

        if (!roleNameArg || roleNameArg.type !== discordeno.ApplicationCommandOptionTypes.String) {
            throw {message: "Missing or invalid argument. Should be a string."}
        }

        discordeno.createRole(BigInt(interaction.guildId!), {
            mentionable: true,
            name: roleNameArg.value
        })

        return {
            type: discordeno.InteractionResponseTypes.ChannelMessageWithSource,
            data: {
                content: "Created role!"
            }
        }
    } else if (fromRole) {
        const roleArg = interaction.data?.options?.find(option => option.name === "role")

        if (!roleArg || roleArg.type !== discordeno.ApplicationCommandOptionTypes.Role) {
            throw {message: "Missing or invalid argument. Should be a role."}
        }

        const role: discordeno.Role | undefined = interaction.data!.resolved!.roles![roleArg.value]

        if (!role) {
            throw {message: "This role doesn't exist! Create it yourself or use `/create new`. "}
        }

        return {
            type: discordeno.InteractionResponseTypes.ChannelMessageWithSource,
            data: {
                content: `Hey! That role exists and has colour: ${role.color}`
            }
        }
    } else {
        throw {message: "Logic has broken."}
    }
}

export const handlers: Record<string, CommandHandler | undefined> = {
    create,
    hello
}