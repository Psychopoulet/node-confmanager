import NodeContainerPattern = require("node-containerpattern");
export default class ConfManager extends NodeContainerPattern {
    filePath: string;
    spaces: boolean;
    shortcuts: Record<string, string>;
    constructor(filePath: string, spaces?: boolean, recursionSeparator?: string);
    private _loadFromConsole;
    clear(): void;
    clearShortcuts(): this;
    deleteFile(): Promise<void>;
    fileExists(): Promise<boolean>;
    get(key: string): any;
    load(loadConsole?: boolean): Promise<void>;
    save(): Promise<void>;
    shortcut(_key: string, _shortkey: string): this;
}
