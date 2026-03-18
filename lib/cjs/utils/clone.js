"use strict";
// module
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = clone;
function clone(from) {
    if ("object" === typeof from && null !== from) {
        if (Object === from.constructor) {
            return { ...from };
        }
        else if (Array.isArray(from)) {
            return [...from];
        }
        else {
            const FromConstructor = from.constructor;
            return new FromConstructor(from);
        }
    }
    return from;
}
