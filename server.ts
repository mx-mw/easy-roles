import {Application, Router, Status} from "https://deno.land/x/oak@v8.0.0/mod.ts";
import {validateDiscordInteraction} from "./validateDiscordInteraction.ts"

const app = new Application();

const router = new Router();

router.post("/api/interactions", async ctx => {
    const valid = await validateDiscordInteraction(ctx.request)

    if (!valid) {
        ctx.response.status = Status.Unauthorized
        ctx.response.body = {error: "This is not a valid Discord interaction request."}
        return
    }

    const {type = 0, data = {options: []}} = await ctx.request.body({type: "json"}).value

    // Discord performs Ping interactions to test our application.
    // Type 1 in a request implies a Ping interaction.
    if (type === 1) {
        ctx.response.body = {type: 1}
    }

    // Type 2 in a request is an ApplicationCommand interaction.
    // It implies that a user has issued a command.
    if (type === 2) {
        const {value} = data.options.find((option: any) => option.name === "name");
        ctx.response.body = {
            // Type 4 responds with the below message retaining the user's
            // input at the top.
            type: 4,
            data: {
                content: `Hello, ${value}!`,
            },
        }
        return
    }

    ctx.response.status = Status.BadRequest
    ctx.response.body = {error: "Invalid Interaction"}
})

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen("127.0.0.1:8000");

// /subscribe
// /unsubscribe
// /create
// /delete