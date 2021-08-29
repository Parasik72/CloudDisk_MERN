import { useCallback, useState } from "react"
import { useHttp } from "../hooks/http.hooks"
import { cleanDiskAction } from "../reducers/fileReducer";
import { changeAvatarAction, changeEmailAction, changeUsedSpace, changeUsernameAction, logoutUser, signInUser } from "../reducers/userReducer"

export const useUser = () => {
    const [ready, setReady] = useState(false);
    const {request} = useHttp()
    const registration = (email, password) => {
        return async dispatch => {
            try {
                const response = await request('/api/auth/registration', 'POST', {email, password});
                if(response instanceof Error)
                    throw new Error(response);
                dispatch(signInUser(response.user));
                localStorage.setItem('token', response.token);
            } catch (error) {
                alert(error.message);
            }
        }
    }
    const login = (email, password) => {
        return async dispatch => {
            try {
                const response = await request('/api/auth/login', 'POST', {email, password});
                if(response instanceof Error)
                    throw new Error(response);
                dispatch(signInUser(response.user));
                localStorage.setItem('token', response.token);
            } catch (error) {
                alert(error.message);
            }
        }
    }
    const auth = useCallback(() => {
        return async dispatch => {
            try {
                const response = await request('/api/auth/', 'GET', null, {Authorization: `Bearer ${localStorage.getItem('token')}`});
                if(response instanceof Error)
                    throw new Error(response);
                dispatch(signInUser(response.user));
                localStorage.setItem('token', response.token);
            } catch (error) {
                localStorage.removeItem('token');
            } finally {
                setReady(true);
            }
        }
    },[request]);
    const logout = () => {
        return dispatch => {
            try {
                dispatch(logoutUser());
                localStorage.removeItem('token');
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
    }
    const changeAvatar = file => {
        return async dispatch => {
            try {
                const formData = new FormData();
                formData.append('file', file);
                const response = await request('/api/user/avatar', 'POST', formData, {Authorization: `Bearer ${localStorage.getItem('token')}`});
                if(response instanceof Error)
                    throw new Error(response);
                dispatch(changeAvatarAction(response.avatar));
            } catch (error) {
                alert(error.message);
            }
        }
    }
    const cleanDisk = () => {
        return async dispatch => {
            try {
                const response = await request('/api/user/clean', 'DELETE', null, {Authorization: `Bearer ${localStorage.getItem('token')}`});
                if(response instanceof Error)
                    throw new Error(response);
                dispatch(cleanDiskAction());
                dispatch(changeUsedSpace(response.user.usedSpace));
                alert(response.message);
            } catch (error) {
                alert(error.message);
            }
        }
    }
    const changeUsername = (username) => {
        return async dispatch => {
            try {
                const response = await request('/api/user/username', 'POST', {username}, {Authorization: `Bearer ${localStorage.getItem('token')}`});
                if(response instanceof Error)
                    throw new Error(response);
                dispatch(changeUsernameAction(username));
            } catch (error) {
                alert(error.message);
            }
        }
    }
    const changeEmail = (email) => {
        return async dispatch => {
            try {
                const response = await request('/api/user/email', 'POST', {email}, {Authorization: `Bearer ${localStorage.getItem('token')}`});
                if(response instanceof Error)
                    throw new Error(response);
                dispatch(changeEmailAction(email));
            } catch (error) {
                alert(error.message);
            }
        }
    }
    return {registration, login, auth, logout, ready, changeAvatar, cleanDisk, changeUsername, changeEmail};
}