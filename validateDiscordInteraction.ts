import {Request} from "https://deno.land/x/oak@v8.0.0/mod.ts";
import nacl from "https://cdn.skypack.dev/tweetnacl@v1.0.3?dts";

// Your public key can be found on your application in the Developer Portal
const DISCORD_PUBLIC_KEY = Deno.env.get("DISCORD_PUBLIC_KEY")!;

export const validateDiscordInteraction = async (req: Request): Promise<boolean> => {
    const signature = req.headers.get('X-Signature-Ed25519');
    const timestamp = req.headers.get('X-Signature-Timestamp');

    if (!signature || !timestamp || !req.hasBody) {
        return false
    }

    const body = await req.body({type: "text"}).value;

    const isVerified = nacl.sign.detached.verify(
        new TextEncoder().encode(timestamp + body),
        hexToUint8Array(signature),
        hexToUint8Array(DISCORD_PUBLIC_KEY),
    );

    return isVerified;
}

/** Converts a hexadecimal string to Uint8Array. */
const hexToUint8Array = (hex: string) => new Uint8Array(hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)));