import { createStateObject } from "obstate";
import { LoginTarget } from "@buttercup/locust";

export const FORM = createStateObject<{
    currentFormID: string | null;
    currentLoginTarget: LoginTarget | null;
    targetFormID: string | null;
}>({
    currentFormID: null,
    currentLoginTarget: null,
    targetFormID: null
});
