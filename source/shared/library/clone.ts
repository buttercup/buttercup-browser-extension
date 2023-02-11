export function naiveClone<T extends Array<any> | Record<string, any>>(item: T): T {
    if (Array.isArray(item)) {
        return naiveCloneArray(item);
    }
    return naiveCloneObject(item);
}

function naiveCloneArray<T extends Array<any>>(arr: T): T {
    const clone = [...arr] as T;
    for (let i = 0; i < clone.length; i += 1) {
        if (Array.isArray(clone[i])) {
            clone[i] = naiveCloneArray(clone[i]);
        } else if (clone[i] && typeof clone[i] === "object") {
            clone[i] = naiveCloneObject(clone[i]);
        }
    }
    return clone;
}

function naiveCloneObject<T extends Record<string, any>>(obj: T): T {
    const clone = { ...obj };
    for (const key in clone) {
        if (Array.isArray(clone[key])) {
            clone[key] = naiveCloneArray(clone[key]);
        } else if (typeof clone[key] === "object" && clone[key]) {
            clone[key] = naiveCloneObject(clone[key]);
        }
    }
    return clone;
}
