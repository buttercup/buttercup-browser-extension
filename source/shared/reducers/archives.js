import { ARCHIVES_ADD, ARCHIVES_REMOVE, ARCHIVES_SET_LOCKED, ARCHIVES_SET_UNLOCKED } from "../actions/types.js";

const INITIAL = {
    archives: []
};

export default function archivesReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ARCHIVES_ADD:
            return {
                ...state,
                archives: [...state.archives, action.payload]
            };
        case ARCHIVES_REMOVE:
            return {
                ...state,
                archives: state.archives.filter(info => info.id !== action.payload)
            };
        case ARCHIVES_SET_LOCKED:
            return {
                ...state,
                archives: state.archives.map(info => {
                    if (info.id === action.payload) {
                        return {
                            ...info,
                            state: "locked"
                        };
                    }
                    return info;
                })
            };
        case ARCHIVES_SET_UNLOCKED:
            return {
                ...state,
                archives: state.archives.map(info => {
                    if (info.id === action.payload) {
                        return {
                            ...info,
                            state: "unlocked"
                        };
                    }
                    return info;
                })
            };

        default:
            return state;
    }
}
