import {
    // APP_SET_SAVING
} from "../actions/types.js";

const INITIAL = {
    archives: []
};

export default function appReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        // case APP_SET_SAVING:
        //     return {
        //         ...state,
        //         saving: !!action.payload
        //     };

        default:
            return state;
    }
}
