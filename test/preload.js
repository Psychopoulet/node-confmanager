// deps

    // externals
    const { afterAll, beforeAll } = require("bun:test");

// module

if ("undefined" === typeof globalThis.before) {

    globalThis.before = beforeAll;

}

if ("undefined" === typeof globalThis.after) {

    globalThis.after = afterAll;

}
