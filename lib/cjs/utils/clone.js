"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// module
function clone(from) {
    if (from && "object" === typeof from) {
        if (Object === from.constructor) {
            return Object.assign({}, from);
        }
        else if (Array === from.constructor) {
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
exports.default = clone;
;
