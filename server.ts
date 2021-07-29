import {validateDiscordInteraction} from "./validateDiscordInteraction.ts"
import {discordeno, oak} from "./deps.ts";
import {handlers} from "./commands.ts"

discordeno.rest.token = Deno.env.get("DISCORD_BOT_TOKEN")!

const app = new oak.Application();

const router = new oak.Router();

router.post("/api/interactions", async ctx => {
    const valid = await validateDiscordInteraction(ctx.request)

    if (!valid) {
        ctx.response.status = oak.Status.Unauthorized
        ctx.response.body = {error: "Invalid Interaction: Failed Discord Signature Validation"}
        return
    }

    const interaction: discordeno.Interaction = await ctx.request.body({type: "json"}).value

    // @ts-expect-error Discordeno has terrible types apparently.
    if (interaction.type === discordeno.InteractionTypes.Ping) {
        ctx.response.body = {type: discordeno.InteractionResponseTypes.Pong}
        return
    }

    if (interaction.type === discordeno.InteractionTypes.ApplicationCommand) {
        if (!interaction.data) {
            ctx.response.body = {
                type: discordeno.InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "Something went wrong and the command didn't have any data. Try again later.",
                    flags: 64
                }
            }
            return
        }

        console.log(interaction)

        const handler = handlers[interaction.data.name]

        if (handler) {
            try {
                ctx.response.body = handler(interaction)
                return
            } catch (e) {
                ctx.response.body = {
                    type: discordeno.InteractionResponseTypes.ChannelMessageWithSource,
                    data: {
                        content: e.message,
                        flags: 64
                    }
                }
                return
            }
        } else {
            ctx.response.body = {
                type: discordeno.InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "This command wasn't recognised. Probably something went wrong. Try again later.",
                    flags: 64
                }
            }
            return
        }
    }

    ctx.response.status = oak.Status.BadRequest
    ctx.response.body = {error: "Invalid Interaction: Invalid Type"}
    return
})

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen("127.0.0.1:8000");

// /create
// /list
// /edit
// /delete