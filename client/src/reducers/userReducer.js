const SIGN_IN_USER = 'SIGN_IN_USER';
const LOGOUT_USER = 'SET_USER';
const CHANGE_AVATAR = 'CHANGE_AVATAR';
const CHANGE_USERNAME = 'CHANGE_USERNAME';
const CHANGE_EMAIL = 'CHANGE_EMAIL';
const CHANGE_USEDSPACE = 'CHANGE_USEDSPACE';

const defaultState= {
    user: {},
    isAuth: false
}

export const userReducer = (state = defaultState, action) => {
    switch(action.type) {
        case SIGN_IN_USER:
            return {
                ...state,
                user: action.payload,
                isAuth: true
            }
        case LOGOUT_USER:
            return {
                ...state,
                user: {},
                isAuth: false
            }
        case CHANGE_AVATAR:
            return {
                ...state,
                user: {...state.user, avatar: action.payload}
            }
        case CHANGE_USERNAME:
            return {
                ...state,
                user: {...state.user, username: action.payload}
            }
        case CHANGE_EMAIL:
            return {
                ...state,
                user: {...state.user, email: action.payload}
            }
        case CHANGE_USEDSPACE:
            return {
                ...state,
                user: {...state.user, usedSpace: action.payload}
            }
        default:
            return state;
    }
}

export const signInUser = user => ({type: SIGN_IN_USER, payload: user});
export const logoutUser = () => ({type: LOGOUT_USER});
export const changeAvatarAction = avatar => ({type: CHANGE_AVATAR, payload: avatar});
export const changeUsernameAction = username => ({type: CHANGE_USERNAME, payload: username});
export const changeEmailAction = email => ({type: CHANGE_EMAIL, payload: email});
export const changeUsedSpace = usedSpace => ({type: CHANGE_USEDSPACE, payload: usedSpace});