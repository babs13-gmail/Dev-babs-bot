import fs from "fs";
import path from "path";
import { config } from "./config.js";
import chalk from "chalk";

console.log(chalk.blue(`> ${config.botName} v${config.version} starting...`));

// Command loader
const commandsPath = path.join('./commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = {};
for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    commands[command.name] = command;
}
console.log(chalk.green(`Loaded ${commandFiles.length} commands.`));

// Fake message event for testing
function onMessage(from, message) {
    if (!message.startsWith(config.prefix)) return;
    const args = message.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = commands[commandName];
    if (!command) return console.log(chalk.yellow(`Unknown command: ${commandName}`));
    
    try {
        command.execute(from, args, config);
    } catch (err) {
        console.error(chalk.red(`Error executing command ${commandName}:`), err);
    }
}

// Demo
console.log(chalk.blue(`Bot ready! Use ${config.prefix}ping to test.`));
onMessage(config.ownerNumber, ".ping");
