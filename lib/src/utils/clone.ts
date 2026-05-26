// module

export default function clone <T> (from: T): T {

    if ("object" === typeof from && null !== from) {

        if (Object === from.constructor) {
            return { ...from };
        }
        else if (Array.isArray(from)) {
            return [ ...from ] as T;
        }
        else {
            const FromConstructor = from.constructor as new (arg: T) => T;
            return new FromConstructor(from);
        }

    }

    return from;

}
