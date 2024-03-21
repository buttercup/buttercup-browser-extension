import { createStateObject } from "obstate";

export const FRAME = createStateObject<{
    isTop: boolean;
}>({
    isTop: false
});
