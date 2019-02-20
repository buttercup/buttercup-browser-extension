import { createAction } from "redux-actions";
import { VAULT_FACADE_SET } from "./types.js";

export const setVaultFacade = createAction(VAULT_FACADE_SET);
