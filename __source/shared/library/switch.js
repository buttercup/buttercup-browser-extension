function optionsToIndex(options) {
    if (!options) {
        throw new Error("Options must be specified");
    }
    if (Array.isArray(options)) {
        return options.map(([key, value]) => [
            incoming => {
                if (typeof key === "string") {
                    return incoming === key;
                } else if (typeof key === "function") {
                    return !!key(incoming);
                }
                // assume regex
                return key.test(incoming);
            },
            value
        ]);
    } else if (typeof options === "object") {
        return Object.keys(options).map(key => [value => value === key, options[key]]);
    } else {
        throw new Error("Invalid options format");
    }
}

export function switchValue(options, def) {
    const index = optionsToIndex(options);
    return value => {
        const item = index.find(indexSet => indexSet[0](value));
        return (item && item[1]) || def;
    };
}
