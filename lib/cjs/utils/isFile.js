"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// deps
// natives
const node_fs_1 = require("node:fs");
// module
function isFile(file) {
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
            (0, node_fs_1.lstat)(file, (err, stats) => {
                return resolve(Boolean(!err && stats.isFile()));
            });
        }
    });
}
exports.default = isFile;
;
