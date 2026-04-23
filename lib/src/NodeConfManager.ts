// deps

    // natives
    import { dirname } from "node:path";
    import { unlink, readFile, writeFile, mkdir } from "node:fs/promises";

    import { createReadStream } from "node:fs";
    import { createInterface } from "node:readline";

    // externals
    import NodeContainerPattern from "node-containerpattern";

    // locals
    import checkShortcut from "./utils/checkShortcut";
    import clone from "./utils/clone";
    import isFile from "./utils/isFile";

// module

export default class ConfManager extends NodeContainerPattern {

    // attributes

        // public

        public filePath: string;
        public spaces: boolean;
        public shortcuts: Record<string, string>;

    // constructor

    public constructor (filePath: string, spaces: boolean = false, recursionSeparator: string = ".") {

        if ("undefined" !== typeof filePath && "string" !== typeof filePath) {
            throw new TypeError("\"filePath\" parameter is not a string");
        }
        else if ("string" === typeof filePath && "" === filePath.trim()) {
            throw new RangeError("\"filePath\" parameter is empty");
        }

        else if ("undefined" !== typeof spaces && "boolean" !== typeof spaces) {
            throw new TypeError("The \"spaces\" parameter is not a boolean");
        }

        else if ("undefined" !== typeof recursionSeparator && "string" !== typeof recursionSeparator) {
            throw new TypeError("The \"recursionSeparator\" parameter is not a string");
        }
        else if ("string" === typeof recursionSeparator && "" === recursionSeparator.trim()) {
            throw new RangeError("\"recursionSeparator\" parameter is empty");
        }

        else {

            super(recursionSeparator);

            this.filePath = "undefined" !== typeof filePath ? filePath.trim() : "";
            this.spaces = spaces;
            this.shortcuts = {};

        }

    }

    // private

    private _loadFromEnvFile (file: string): Promise<void> {

        return new Promise((resolve: () => void, reject: (error: Error) => void) => {

            let stop = false;

            const input = createReadStream(file);

            // To stop reading early from inside "line", call rl.close(); "close" then fires and the Promise resolves.
            const rl = createInterface({
                "input": input,
                "crlfDelay": Infinity
            });

            rl.on("line", (l: string) => {

                const line: string = l.trim();

                if (0 >= line.length || line.startsWith("#") || !line.includes("=")) {
                    return;
                }

                const [ key, value ]: string[] = line.split("=");

                try {
                    this.set(key.trim().toLocaleLowerCase(), value);
                }
                catch (e: unknown) {

                    stop = true;

                    if (e instanceof Error) {
                        reject(e);
                    }
                    else {
                        reject(new Error(String(e)));
                    }

                }

            });

            rl.on("error", (error: Error): void => {

                if (!stop) {
                    stop = true;
                    reject(error);
                }

            });

            rl.on("close", (): void => {

                if (!stop) {
                    stop = true;
                    resolve();
                }

            });

        });

    }

    private _loadFromEnv (): void {

        Object.keys(process.env).forEach((key: string): void => {
            this.set(key.trim().toLocaleLowerCase(), process.env[key]);
        });

    }

    private _loadFromConsole (): void {

        process.argv.slice(2, process.argv.length).forEach((arg: string, i: number, args: string[]): void => {

            if ("--" === arg) {
                return;
            }

            if (arg.startsWith("-")) {

                const isShortcut: boolean = !arg.startsWith("--");
                const argument: string = arg.slice(isShortcut ? 1 : 2, arg.length);

                if (argument && (!isShortcut || this.shortcuts[argument])) {

                    const key: string = isShortcut ? this.shortcuts[argument] : argument;

                    // boolean
                    if ("string" === typeof this.skeletons[key] && "boolean" === this.skeletons[key]) {
                        this.set(key, true);
                    }

                    // check args
                    else if (i + 1 >= args.length) {
                        throw new ReferenceError("Missing value for \"" + argument + "\" key (no more arguments)");
                    }
                    else if (args[i + 1].startsWith("--")) {
                        throw new ReferenceError("Missing value for \"" + argument + "\" key (next argument is a valid key)");
                    }
                    else if (args[i + 1].startsWith("-") && this.shortcuts[args[i + 1].slice(1)]) {
                        throw new ReferenceError("Missing value for \"" + argument + "\" key (next argument is a valid shortcut)");
                    }

                    // array
                    else if ("undefined" !== typeof this.skeletons[key] && "array" === this.skeletons[key]) {

                        const nextArgs: string[] = args.slice(i + 1, args.length);

                        if (nextArgs.length) {

                            const endArrayArgs: number = nextArgs.findIndex((a: string): boolean => {

                                return a.startsWith("--")
                                    || (a.startsWith("-") && Boolean(this.shortcuts[a.slice(1)]));

                            });

                            const values: string[] = 0 < endArrayArgs ? nextArgs.slice(0, endArrayArgs) : nextArgs;

                            if (1 === values.length && values[0].startsWith("[") && values[0].endsWith("]")) {
                                this.set(key, JSON.parse(values[0]));
                            }
                            else {
                                this.set(key, values);
                            }

                        }

                    }
                    else {
                        this.set(key, args[i + 1]);
                    }

                }

            }

        });

    }

    // public

    // Container.clear & clearShortcuts
    public clear (): void {
        super.clear();
        this.clearShortcuts();
    }

    // forget all the shortcuts
    public clearShortcuts (): this {
        this.shortcuts = {};
        return this;
    }

    // delete the conf file
    public deleteFile (): Promise<void> {

        return !this.filePath ? Promise.resolve() : isFile(this.filePath).then((exists: boolean): Promise<void> => {
            return exists ? unlink(this.filePath) : Promise.resolve();
        });

    }

    // check if the conf file exists
    public fileExists (): Promise<boolean> {
        return !this.filePath ? Promise.resolve(false) : isFile(this.filePath);
    }

    // Container.get with cloned data
    public get <T = unknown> (key: string): T {
        return clone<T>(super.get<T>(key));
    }

    // prio : env > console > envfile > conf file
    public load (options: boolean //
        | {
            "loadConsole"?: boolean; // load data from conf file then commandline (default : true)
            "loadEnv"?: boolean; // load data from ENV (default : true)
            "loadEnvFile"?: string; // load data from env file (default : "" => no load)
        } = {
            "loadConsole": true,
            "loadEnv": true,
            "loadEnvFile": ""
        }): Promise<void> {

        this.clearData();

        return this.fileExists().then((exists: boolean): Promise<void> => {

            if (!exists) {
                return Promise.resolve();
            }

            return readFile(this.filePath, "utf-8").then((content: string): Record<string, unknown> => {
                return JSON.parse(content) as Record<string, unknown>;
            }).then((data: Record<string, unknown>): void => {

                for (const key in data) {
                    this.set(key, data[key]);
                }

            });

        }).then(async () => {

            if ("boolean" === typeof options && options) {
                this._loadFromConsole();
            }
            else if ("object" === typeof options) {

                // default values
                const loadConsole: boolean = "boolean" === typeof options.loadConsole ? options.loadConsole : true;
                const loadEnv: boolean = "boolean" === typeof options.loadEnv ? options.loadEnv : true;
                const loadEnvFile: string = "string" === typeof options.loadEnvFile ? options.loadEnvFile : "";

                if ("" !== loadEnvFile.trim()) {
                    await this._loadFromEnvFile(loadEnvFile);
                }

                if (loadConsole) {
                    this._loadFromConsole();
                }

                if (loadEnv) {
                    this._loadFromEnv();
                }

            }

        });

    }

    // save data into conf file
    public save (): Promise<void> {

        return !this.filePath ? Promise.resolve() : mkdir(dirname(this.filePath), {
            "recursive": true
        }).then((): Promise<void> => {

            const objects: Record<string, unknown> = {};
            this.forEach((value: unknown, key: string): void => {
                objects[key] = value;
            });

            return this.spaces
                ? writeFile(this.filePath, JSON.stringify(objects, undefined, 2), "utf-8")
                : writeFile(this.filePath, JSON.stringify(objects), "utf-8");

        });

    }

    // bind a shortcut for commandline
    public shortcut (_key: string, _shortkey: string): this {

        const { key, shortkey }: { "key": string; "shortkey": string; } = checkShortcut(_key, _shortkey);

        this.shortcuts[shortkey] = key;

        return this;

    }

}
