import { config } from "../config.js";

export const name = "owner";

export async function execute(sock, msg) {
    await sock.sendMessage(msg.key.remoteJid, { text: `Owner: ${config.ownerNumber}` });
}