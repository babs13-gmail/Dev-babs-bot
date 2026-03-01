import makeWASocket, { useSingleFileAuthState } from "@adiwajshing/baileys";
import { config } from "./config.js";
import fs from "fs";
import path from "path";
import chalk from "chalk";

const { state, saveState } = useSingleFileAuthState('./auth_info.json');

const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
});

sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
        const shouldReconnect = lastDisconnect.error?.output?.statusCode !== 401;
        console.log(chalk.red('Connection closed, reconnecting:'), shouldReconnect);
        if (shouldReconnect) startSock();
    } else if (connection === 'open') {
        console.log(chalk.green('✅ Connected to WhatsApp!'));
    }
});

sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!text) return;

    if (text.startsWith(config.prefix)) {
        const args = text.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Load commands dynamically
        const commandsPath = path.join('./commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = await import(`./commands/${file}`);
            if (command.name === commandName) {
                try {
                    await command.execute(sock, msg);
                } catch (err) {
                    console.error(chalk.red(`Error executing ${commandName}:`), err);
                }
            }
        }
    }
});