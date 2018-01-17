const __ports = {
    state: []
};

export function addPort(type, port) {
    switch (type) {
        case "state":
            __ports.state.push(port);
            break;

        default:
            throw new Error(`Failed adding port: Unknown port type: ${type}`);
    }
}

export function getPorts(type) {
    switch (type) {
        case "state":
            return __ports.state;

        default:
            throw new Error(`Failed retrieving ports: Unknown port type: ${type}`);
    }
}
