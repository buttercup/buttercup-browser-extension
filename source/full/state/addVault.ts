import { createStateObject } from "obstate";

export const ADD_VAULT_STATE = createStateObject<{
    error: string | null;
    dropboxToken: string | null;
}>({
    error: null,
    dropboxToken: null
});
