// module

export default function clone (from: any): any {

    if (from && "object" === typeof from) {

        if (Object === from.constructor) {
            return { ...from };
        }
        else if (Array.isArray(from)) {
            return [ ...from ];
        }
        else {
            return new from.constructor(from);
        }

    }
    else {
        return from;
    }

}
