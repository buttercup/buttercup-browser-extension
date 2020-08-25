import { REMOTE_FILES_RESET, REMOTE_FILES_SET_CONTENTS, REMOTE_FILES_SET_LOADING } from "../actions/types.js";

const INITIAL = {
    directoryContents: {},
    directoriesLoading: [],
};

export default function remoteFilesReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case REMOTE_FILES_SET_CONTENTS:
            return {
                ...state,
                directoryContents: {
                    ...state.directoryContents,
                    [action.payload.directory]: action.payload.contents,
                },
            };
        case REMOTE_FILES_SET_LOADING: {
            const { directory, isLoading } = action.payload;
            if (isLoading) {
                return {
                    ...state,
                    directoriesLoading: [...state.directoriesLoading, directory],
                };
            } else {
                return {
                    ...state,
                    directoriesLoading: state.directoriesLoading.filter(dir => dir !== directory),
                };
            }
        }
        case REMOTE_FILES_RESET:
            return {
                ...state,
                directoryContents: {},
                directoriesLoading: [],
            };

        default:
            return state;
    }
}
