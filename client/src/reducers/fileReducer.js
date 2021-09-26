const SET_CURRENT_DIR = 'SET_CURRENT_DIR';
const SET_FILES = 'SET_FILES';
const ADD_FILE = 'ADD_FILE';
const DELETE_FILE = 'DELETE_FILE';
const SHOW_POPUP = 'SHOW_POPUP';
const HIDE_POPUP = 'HIDE_POPUP';
const PUSH_DIRSTACK = 'PUSH_DIRSTACK';
const SET_SORT_BY = 'SET_SORT_BY';
const SET_SORT_DIRECTION = 'SET_SORT_DIRECTION';
const SET_DISABLE_DELETE = 'SET_DISABLE_DELETE';
const RENAME_FILE = 'RENAME_FILE';
const CLEAR_SEARCH = 'CLEAR_SEARCH';
const SET_SEARCH = 'SET_SEARCH';
const ADD_UPLOAD_FILE = 'ADD_UPLOAD_FILE';
const DELETE_UPLOAD_FILE = 'DELETE_UPLOAD_FILE';
const CHANGE_UPLOAD_FILE = 'CHANGE_UPLOAD_FILE';
const CLEAN_DISK = 'CLEAN_DISK';
const TO_ROOT = 'TO_ROOT';

const defaultState = {
    currentDir: null,
    files: [],
    popUpDisplay: false,
    dirStack: [],
    sortBy: 'name',
    sortDirection: 1,
    disableDelete: false,
    searchValue: '',
    uploadFile: []
}

export const fileReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_CURRENT_DIR:
            return {
                ...state,
                currentDir: action.payload
            }
        case SET_FILES:
            return {
                ...state,
                files: action.payload
            }
        case ADD_FILE:
            return {
                ...state,
                files: [...state.files, action.payload]
            }
        case DELETE_FILE:
            return {
                ...state,
                files: [...state.files.filter(file => file._id !== action.payload)]
            }
        case SHOW_POPUP:
            return {
                ...state,
                popUpDisplay: true
            }
        case HIDE_POPUP:
            return {
                ...state,
                popUpDisplay: false
            }
        case PUSH_DIRSTACK:
            return {
                ...state,
                dirStack: [...state.dirStack, action.payload]
            }
        case SET_SORT_BY:
            return {
                ...state,
                sortBy: action.payload
            }
        case SET_SORT_DIRECTION:
            return {
                ...state,
                sortDirection: action.payload
            }
        case SET_DISABLE_DELETE:
            return {
                ...state,
                disableDelete: action.payload
            }
        case RENAME_FILE:
            return {
                ...state,
                files: [...state.files.map(file => file._id === action.payload._id 
                    ? 
                    {...file, name: action.payload.name}
                    :
                    {...file}
                    )]
            }
        case CLEAR_SEARCH:
            return {
                ...state,
                searchValue: ''
            }
        case SET_SEARCH:
            return {
                ...state,
                searchValue: action.payload
            }
        case ADD_UPLOAD_FILE:
            return {
                ...state,
                uploadFile: [...state.uploadFile, action.payload]
            }
        case DELETE_UPLOAD_FILE:
            return {
                ...state,
                uploadFile: [...state.uploadFile.filter(file => file._id !== action.payload)]
            }
        case CHANGE_UPLOAD_FILE:
            return {
                ...state,
                uploadFile: [...state.uploadFile.filter(file => file._id === action.payload._id
                    ?
                    {...file, progress: action.payload.progress}
                    :
                    {...file}
                    )]
            }
        case CLEAN_DISK:
            return {
                ...state,
                currentDir: null,
                files: [],
                popUpDisplay: false,
                dirStack: [],
                sortBy: 'name',
                sortDirection: 1,
                disableDelete: false,
                searchValue: '',
                uploadFile: []
            }
        case TO_ROOT:
            return {
                ...state,
                currentDir: null,
                popUpDisplay: false,
                dirStack: []
            }
        default:
            return state;
    }
}

export const setCurrrentDir = dir => ({type: SET_CURRENT_DIR, payload: dir});
export const setFiles = files => ({type: SET_FILES, payload: files});
export const addFile = file => ({type: ADD_FILE, payload: file});
export const deleteFileAction = file => ({type: DELETE_FILE, payload: file});
export const showPopUp = () => ({type: SHOW_POPUP});
export const hidePopUp = () => ({type: HIDE_POPUP});
export const pushDirStack = dir => ({type: PUSH_DIRSTACK, payload: dir});
export const setSortBy = sort => ({type: SET_SORT_BY, payload: sort});
export const setSortDirection= direction => ({type: SET_SORT_DIRECTION, payload: direction});
export const setDisableDelete= flag => ({type: SET_DISABLE_DELETE, payload: flag});
export const renameFileAction = payload => ({type: RENAME_FILE, payload});
export const clearSearch = () => ({type: CLEAR_SEARCH});
export const setSearch = value => ({type: SET_SEARCH, payload: value});
export const addUploadFile = file => ({type: ADD_UPLOAD_FILE, payload: file});
export const deleteUploadFile = id => ({type: DELETE_UPLOAD_FILE, payload: id});
export const changeUploadFile = payload => ({type: CHANGE_UPLOAD_FILE, payload});
export const cleanDiskAction = () => ({type: CLEAN_DISK});
export const toRoot = () => ({type: TO_ROOT});