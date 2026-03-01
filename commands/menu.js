export const name = "menu";

export async function execute(sock, msg) {
    await sock.sendMessage(msg.key.remoteJid, { text: 'Commands available: ping, menu, owner' });
}