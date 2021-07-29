import {validateDiscordInteraction} from "./validateDiscordInteraction.ts"
import {discordeno, oak} from "./deps.ts";

const app = new oak.Application();

const router = new oak.Router();

router.post("/api/interactions", async ctx => {
    const valid = await validateDiscordInteraction(ctx.request)

    if (!valid) {
        ctx.response.status = oak.Status.Unauthorized
        ctx.response.body = {error: "This is not a valid Discord interaction request."}
        return
    }

    const interaction: discordeno.Interaction = await ctx.request.body({type: "json"}).value

    // @ts-expect-error Discordeno has terrible types apparently.
    if (interaction.type === discordeno.InteractionTypes.Ping) {
        ctx.response.body = {type: discordeno.InteractionResponseTypes.Pong}
        return
    }

    if (interaction.type === discordeno.InteractionTypes.ApplicationCommand) {
        console.log(interaction)
        const argument = interaction.data?.options?.find(option => option.name === "name");
        ctx.response.body = {
            // Type 4 responds with the below message retaining the user's
            // input at the top.
            type: discordeno.InteractionResponseTypes.ChannelMessageWithSource,
            data: {
                content: `Hello, ${argument?.type}!`,
            },
        }
        return
    }

    ctx.response.status = oak.Status.BadRequest
    ctx.response.body = {error: "Invalid Interaction"}
})

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen("127.0.0.1:8000");

// /subscribe
// /unsubscribe
// /create
// /delete