
export function printf(msg: string, ...args: any[]) {
    console.info(new Date().toISOString() + ": " + msg, ...args);
}
