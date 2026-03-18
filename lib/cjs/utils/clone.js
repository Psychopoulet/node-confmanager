"use strict";
// module
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = clone;
function clone(from) {
    if (from && "object" === typeof from) {
        if (Object === from.constructor) {
            return { ...from };
        }
        else if (Array.isArray(from)) {
            return [...from];
        }
        else {
            return new from.constructor(from);
        }
    }
    else {
        return from;
    }
}
