import { useCallback } from "react"
import { useHttp } from "../hooks/http.hooks"
import { setLoadingOff, setLoadingOn } from "../reducers/appReducer";
import { addFile, changeUploadFile, deleteFileAction, deleteUploadFile, renameFileAction, setDisableDelete, setFiles } from "../reducers/fileReducer";
import { changeUsedSpace } from "../reducers/userReducer";

export const useFile = () => {
    const {request} = useHttp()
    const getFiles = useCallback((dirId, sortBy = 'name', sortDirection = 1) => {
        return async dispatch => {
            try {
                dispatch(setLoadingOn());
                let response;
                if(dirId)
                    response= await request(`/api/file/?dirId=${dirId}&sort=${sortBy}&direction=${sortDirection}`, 'GET', null, {Authorization: `Bearer ${localStorage.getItem('token')}`});
                else
                    response= await request(`/api/file/?sort=${sortBy}&direction=${sortDirection}`, 'GET', null, {Authorization: `Bearer ${localStorage.getItem('token')}`});
                dispatch(setFiles(response.files));
            } catch (error) {
                console.log(error);
            } finally{
                dispatch(setLoadingOff());
            }
        }
    },[request]);

    const createDir = (name, type, parent) => {
        return async dispatch => {
            try {
                let body = {name, type};
                if(parent)
                    body = {...body, parent};
                const response = await request('/api/file/', 'POST', body, {Authorization: `Bearer ${localStorage.getItem('token')}`});
                if(response instanceof Error)
                    throw new Error(response);
                dispatch(addFile(response.file));
            } catch (error) {
                alert(error.message);
            }
        }
    }

    const upload = (files, dirId, uploadFiles) => {
        return async dispatch => {
            try {
                const formData = new FormData();
                formData.append('file', files[0]);
                if(dirId)
                    formData.append('dirId', dirId);
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/file/upload', true);
                xhr.upload.addEventListener('progress', e => {
                    if(uploadFiles.length){
                        uploadFiles[0].progress = e.loaded / e.total * 100;
                        dispatch(changeUploadFile(uploadFiles[0]));
                    }
                });
                xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
                xhr.send(formData);
                xhr.onload = () => {
                    const response = JSON.parse(xhr.response);
                    const {message} = response;
                    if(uploadFiles.length)
                        dispatch(deleteUploadFile(uploadFiles[0]._id));
                    if(message)
                        alert(message);
                    else{
                        dispatch(addFile({...response.file, currentDir: dirId}));
                        dispatch(changeUsedSpace(response.user.usedSpace));
                    }
                    files.shift();
                    if(uploadFiles.length)
                        uploadFiles.shift();
                    if(files.length)
                        dispatch(upload(files, dirId, uploadFiles));
                    };
            } catch (error) {
            }
        }
    }

    const deleteFile = (id) => {
        return async dispatch => {
            try {
                dispatch(setDisableDelete(true));
                const response = await request(`/api/file/?id=${id}`, 'DELETE', null, {Authorization: `Bearer ${localStorage.getItem('token')}`});
                if(response instanceof Error)
                    throw new Error(response);
                dispatch(deleteFileAction(id));
                dispatch(changeUsedSpace(response.user.usedSpace));
            } catch (error) {
                alert(error.message);
            } finally{
                dispatch(setDisableDelete(false));
            }
        }
    }

    const downloadFile = async (file) => {
        try {
            const response = await fetch(`/api/file/download/?id=${file._id}`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
            if(response.status === 200){
                const blob = await response.blob();
                const downloadLink = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadLink;
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                link.remove();
            } 
        } catch (error) {
            alert(error);
        }
    }
    
    const renameFile = (id, name) => {
        return async dispatch => {
            try {
                const response = await request(`/api/file/?id=${id}`, 'PATCH', {name}, {Authorization: `Bearer ${localStorage.getItem('token')}`});
                if(response instanceof Error)
                    throw new Error(response);
                dispatch(renameFileAction(response.file));
            } catch (error) {
                alert(error.message);
            }
        }
    }

    const searchFile = (name, dirId) => {
        return async dispatch => {
            try {
                let response;
                if(dirId)
                    response = await request(`/api/file/search/?dirId=${dirId}&name=${name}`, 'GET', null, {Authorization: `Bearer ${localStorage.getItem('token')}`});
                else
                    response = await request(`/api/file/search/?name=${name}`, 'GET', null, {Authorization: `Bearer ${localStorage.getItem('token')}`});
                if(response instanceof Error)
                    throw new Error(response);
                dispatch(setFiles(response.files));
            } catch (error) {
                alert(error.message);
            } finally {
                dispatch(setLoadingOff());
            }
        }
    }

    return {getFiles, createDir, upload, deleteFile, downloadFile, renameFile, searchFile};
}