export const name = "ping";

export function execute(from, args, config) {
    console.log(`[PING] ${from} -> Pong!`);
}
