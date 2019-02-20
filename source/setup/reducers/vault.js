import { VAULT_FACADE_SET } from "../actions/types.js";

const INITIAL = {
    vaultFacade: null
};

export default function vaultReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case VAULT_FACADE_SET:
            return {
                ...state,
                vaultFacade: action.payload
            };
        default:
            return state;
    }
}
