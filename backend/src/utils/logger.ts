export const logger = {
   info: (message: string) => console.log(`[INFO] ${message}`),
   error: (message: string) => console.log(`[ERROR] ${message}`), // console.error makes bugs
   warn: (message: string) => console.warn(`[WARN] ${message}`),
   debug: (message: string) => console.debug(`[DEBUG] ${message}`),
};
