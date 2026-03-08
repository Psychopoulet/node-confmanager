// deps

    // natives
    import { lstat, type Stats } from "node:fs";

// module

export default function isFile (file: string): Promise<boolean> {

    return new Promise((resolve, reject) => {

        if ("undefined" === typeof file) {
            reject(new ReferenceError("missing \"file\" argument"));
        }
            else if ("string" !== typeof file) {
                reject(new TypeError("\"file\" argument is not a string"));
            }
            else if ("" === file.trim()) {
                reject(new Error("\"file\" argument is empty"));
            }
        else {

            lstat(file, (err: Error | null, stats: Stats): void => {
                return resolve(Boolean(!err && stats.isFile()));
            });

        }

    });

}
