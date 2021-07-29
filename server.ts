import { Application } from "https://deno.land/x/oak@v8.0.0/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello world!";
});

await app.listen("127.0.0.1:8000");

// /subscribe
// /unsubscribe
// /create
// /delete