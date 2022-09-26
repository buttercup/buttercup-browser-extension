import { createStateObject } from "obstate";

export const ADD_VAULT_STATE = createStateObject<{
    authError: string | null;
    dropboxToken: string | null;
}>({
    authError: null,
    dropboxToken: null
});
