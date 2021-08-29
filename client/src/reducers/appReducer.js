const SET_LOADING_ON = 'SET_LOADING_ON';
const SET_LOADING_OFF = 'SET_LOADING_OFF';
const SHOW_PROFILE_MENU = 'SHOW_PROFILE_MENU';
const HIDE_PROFILE_MENU = 'HIDE_PROFILE_MENU';
const SHOW_SEARCH = 'SHOW_SEARCH';
const HIDE_SEARCH = 'HIDE_SEARCH';

const defaultState = {
    isLoading: false,
    displayProfileMenu: false,
    displaySearch: false
}

export const appReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_LOADING_ON:
            return {
                ...state,
                isLoading: true
            }
        case SET_LOADING_OFF:
            return {
                ...state,
                isLoading: false
            }
        case SHOW_PROFILE_MENU:
            return {
                ...state,
                displayProfileMenu: true
            }
        case HIDE_PROFILE_MENU:
            return {
                ...state,
                displayProfileMenu: false
            }
        case SHOW_SEARCH:
            return {
                ...state,
                displaySearch: true
            }
        case HIDE_SEARCH:
            return {
                ...state,
                displaySearch: false
            }
        default:
            return state;
    }
}

export const setLoadingOn = () => ({type: SET_LOADING_ON});
export const setLoadingOff = () => ({type: SET_LOADING_OFF});
export const showProfileMenu = () => ({type: SHOW_PROFILE_MENU});
export const hideProfileMenu = () => ({type: HIDE_PROFILE_MENU});
export const showSearch = () => ({type: SHOW_SEARCH});
export const hideSearch = () => ({type: HIDE_SEARCH});