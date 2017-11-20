import { WEBDAV_DIRECTORY_SET_CONTENTS, WEBDAV_DIRECTORY_SET_LOADING, WEBDAV_RESET } from "../actions/types.js";

const INITIAL = {
    directoryContents: {},
    directoriesLoading: []
};

export default function webdavReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case WEBDAV_DIRECTORY_SET_CONTENTS:
            return {
                ...state,
                directoryContents: {
                    ...state.directoryContents,
                    [action.payload.directory]: action.payload.contents
                }
            };
        case WEBDAV_DIRECTORY_SET_LOADING: {
            const { directory, isLoading } = action.payload;
            if (isLoading) {
                return {
                    ...state,
                    directoriesLoading: [...state.directoriesLoading, directory]
                };
            } else {
                return {
                    ...state,
                    directoriesLoading: state.directoriesLoading.filter(dir => dir !== directory)
                };
            }
        }
        case WEBDAV_RESET:
            return {
                ...state,
                directoryContents: {},
                directoriesLoading: []
            };

        default:
            return state;
    }
}
