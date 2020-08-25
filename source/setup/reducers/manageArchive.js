import { MANAGE_ARCHIVE_SET_EDITING } from "../actions/types.js";

const INITIAL = {
    editing: false,
};

export default function removeArchiveReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case MANAGE_ARCHIVE_SET_EDITING:
            return {
                ...state,
                editing: !!action.payload,
            };

        default:
            return state;
    }
}
