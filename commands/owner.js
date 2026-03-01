export const name = "owner";

export function execute(from, args, config) {
    console.log(`[OWNER] ${from} -> Owner number is ${config.ownerNumber}`);
}
