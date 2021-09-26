import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFile } from '../../actions/file';
import { showSearch } from '../../reducers/appReducer';
import { addUploadFile, clearSearch, showPopUp } from '../../reducers/fileReducer';
import styles from './disk.module.scss';
import { Files } from './Files/Files';
import { Loader } from './Loader/Loader';
import { PopUp } from './PopUp/PopUp';

export const Disk = () => {
    const isLoading = useSelector(state => state.app.isLoading);
    const sortBy = useSelector(state => state.files.sortBy);
    const sortDirection = useSelector(state => state.files.sortDirection);
    const currentDir = useSelector(state => state.files.currentDir);
    const {getFiles, upload} = useFile();
    const dispatch = useDispatch();
    useEffect(()=> {
        dispatch(clearSearch());
        dispatch(showSearch());
        if(currentDir !== 'search')
            dispatch(getFiles(currentDir, sortBy, sortDirection));
    },[dispatch, getFiles, currentDir, sortBy, sortDirection]);
    const uploadHandler = e => {
        if(e.target?.files?.length){
            const uploadFilesArr = [];
            for (const iterator of e.target.files) {
                const upFile = { _id: Date.now() + Math.random(), date: Date.now(), name: iterator.name, size: iterator.size, progress: 0 };
                dispatch(addUploadFile(upFile));
                uploadFilesArr.push(upFile);
            }
            dispatch(upload([...e.target.files], currentDir, uploadFilesArr));
        }
    }
    return (
        <>
        {!isLoading && <div className={styles.disk}>
            <div className={styles.disk__btns}>
                <button onClick={() => dispatch(showPopUp())}>Create folder</button>
                <div className={styles.disk__fileUpload}>
                    <label htmlFor="fileUpload">Upload file</label>
                    <input onChange={uploadHandler} multiple={true} type="file" id="fileUpload" />
                </div>
            </div>
            <Files />
            <PopUp />
        </div>}
        {isLoading && <Loader />}
        </>
    );
}