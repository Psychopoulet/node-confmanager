// module

export default function clone (from: unknown): unknown {

    if ("object" === typeof from && null !== from) {

        if (Object === from.constructor) {
            return { ...from };
        }
        else if (Array.isArray(from)) {
            return [ ...from as unknown[] ];
        }
        else {
            const FromConstructor = from.constructor as new (arg: unknown) => unknown;
            return new FromConstructor(from);
        }

    }

    return from;

}
