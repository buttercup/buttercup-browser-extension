import { Position, Toaster, ToasterInstance } from "@blueprintjs/core";

const __toaster = Toaster.create({
    position: Position.BOTTOM_RIGHT
});

export function getToaster(): ToasterInstance {
    return __toaster;
}
