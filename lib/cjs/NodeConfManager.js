"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// deps
// natives
const path_1 = require("path");
// externals
const fs_extra_1 = require("fs-extra");
const NodeContainerPattern = require("node-containerpattern");
// locals
const checkShortcut_1 = __importDefault(require("./utils/checkShortcut"));
const clone_1 = __importDefault(require("./utils/clone"));
// module
class ConfManager extends NodeContainerPattern {
    // constructor
    constructor(filePath, spaces = false, recursionSeparator = ".") {
        if ("undefined" !== typeof filePath && "string" !== typeof filePath) {
            throw new TypeError("\"filePath\" parameter is not a string");
        }
        else if ("undefined" !== typeof filePath && "" === filePath.trim()) {
            throw new Error("\"filePath\" parameter is empty");
        }
        else if ("undefined" !== typeof spaces && "boolean" !== typeof spaces) {
            throw new TypeError("The \"spaces\" parameter is not a boolean");
        }
        else if ("undefined" !== typeof recursionSeparator && "string" !== typeof recursionSeparator) {
            throw new TypeError("The \"recursionSeparator\" parameter is not a string");
        }
        else if ("undefined" !== typeof recursionSeparator && "" === recursionSeparator.trim()) {
            throw new Error("\"recursionSeparator\" parameter is empty");
        }
        else {
            super(recursionSeparator);
            this.filePath = "undefined" !== typeof filePath ? filePath.trim() : "";
            this.spaces = spaces;
            this.shortcuts = {};
        }
    }
    // private
    _loadFromConsole() {
        return Promise.resolve().then(() => {
            process.argv.slice(2, process.argv.length).forEach((arg, i, args) => {
                if (arg.startsWith("-")) {
                    const isShortcut = !arg.startsWith("--");
                    const argument = arg.slice(isShortcut ? 1 : 2, arg.length);
                    if (argument && (!isShortcut || this.shortcuts[argument])) {
                        const key = isShortcut ? this.shortcuts[argument] : argument;
                        if (this.skeletons[key] && "boolean" === this.skeletons[key]) {
                            this.set(key, true);
                        }
                        else if (i + 1 >= args.length) {
                            throw new ReferenceError("Missing value for \"" + argument + "\" key (no more arguments)");
                        }
                        else if (args[i + 1].startsWith("--")) {
                            throw new ReferenceError("Missing value for \"" + argument + "\" key (next argument is a valid key)");
                        }
                        else if (args[i + 1].startsWith("-") && this.shortcuts[args[i + 1].slice(1)]) {
                            throw new ReferenceError("Missing value for \"" + argument + "\" key (next argument is a valid shortcut)");
                        }
                        else {
                            this.set(key, args[i + 1]);
                        }
                    }
                }
            });
            return Promise.resolve();
        });
    }
    // public
    // Container.clear & clearShortcuts
    clear() {
        super.clear();
        this.clearShortcuts();
    }
    // forget all the shortcuts
    clearShortcuts() {
        this.shortcuts = {};
        return this;
    }
    // delete the conf file
    deleteFile() {
        return !this.filePath ? Promise.resolve() : (0, fs_extra_1.pathExists)(this.filePath).then((exists) => {
            return exists ? (0, fs_extra_1.unlink)(this.filePath) : Promise.resolve();
        });
    }
    // check if the conf file exists
    fileExists() {
        return !this.filePath ? Promise.resolve(false) : (0, fs_extra_1.pathExists)(this.filePath);
    }
    // Container.get with cloned data
    get(key) {
        return (0, clone_1.default)(super.get(key));
    }
    // load data from conf file then commandline (commandline takeover)
    load() {
        this.clearData();
        return this.fileExists().then((exists) => {
            return !exists ? this._loadFromConsole() : (0, fs_extra_1.readJson)(this.filePath, "utf8").then((data) => {
                for (const key in data) {
                    this.set(key, data[key]);
                }
                return this._loadFromConsole();
            });
        });
    }
    // save data into conf file
    save() {
        return !this.filePath ? Promise.resolve() : (0, fs_extra_1.mkdirp)((0, path_1.dirname)(this.filePath)).then(() => {
            const objects = {};
            this.forEach((value, key) => {
                objects[key] = value;
            });
            return this.spaces ? (0, fs_extra_1.writeJson)(this.filePath, objects, {
                "encoding": "utf8",
                "spaces": 2
            }) : (0, fs_extra_1.writeJson)(this.filePath, objects, {
                "encoding": "utf8"
            });
        });
    }
    // bind a shortcut for commandline
    shortcut(_key, _shortkey) {
        const { key, shortkey } = (0, checkShortcut_1.default)(_key, _shortkey);
        this.shortcuts[shortkey] = key;
        return this;
    }
}
exports.default = ConfManager;
;
