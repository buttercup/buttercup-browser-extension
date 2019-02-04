import { AUTOLOGIN_CLEAR_DETAILS, AUTOLOGIN_SET_DETAILS } from "../actions/types.js";

const INITIAL = {
    tabID: null,
    sourceID: null,
    entryID: null,
    setTime: null
};

export default function autoLoginReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case AUTOLOGIN_CLEAR_DETAILS:
            return {
                ...INITIAL
            };
        case AUTOLOGIN_SET_DETAILS: {
            const { entryID, sourceID, tabID } = action.payload;
            return {
                ...state,
                entryID,
                sourceID,
                tabID,
                setTime: Date.now()
            };
        }

        default:
            return state;
    }
}
