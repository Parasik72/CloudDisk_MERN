import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFile } from '../../../actions/file';
import { addUploadFile, setCurrrentDir, setSearch, setSortBy, setSortDirection } from '../../../reducers/fileReducer';
import { File } from './File/File';
import { UploadFile } from './File/UploadFile';
import EmptyFolder from '../../../assets/img/EmptyFolder.png';
import styles from './files.module.scss';

export const Files = () => {
    const currentDir = useSelector(state => state.files.currentDir);
    const searchValue = useSelector(state => state.files.searchValue);
    const sortBy = useSelector(state => state.files.sortBy);
    const sortDirection = useSelector(state => state.files.sortDirection);
    const {upload} = useFile();
    const [drag, setDrag] = useState(false);
    const files = useSelector(state => state.files.files);
    const uploadFile = useSelector(state => state.files.uploadFile);
    const dirStack = useSelector(state => state.files.dirStack);
    const dispatch = useDispatch();
    const showSort = searchValue !== null && !searchValue.length && files.length ? true : false;
    const backHandler = () => {
        if(searchValue.length){
            dispatch(setSearch(''));
            const currentDirTemp = currentDir;
            dispatch(setCurrrentDir('search'));
            setTimeout(()=>{
                dispatch(setCurrrentDir(currentDirTemp));
            },1);
        }
        else
            dispatch(setCurrrentDir(dirStack.pop()));
    }
    const dragHandler = (flag) => {
        return e => {
            let bflag = true;
            for (const item of e.dataTransfer.items) {
                if(item.kind !== 'file'){
                    bflag = false;
                    break;
                }
            }
            if(bflag){
                e.stopPropagation();
                e.preventDefault();
                setDrag(flag);
            }
        }
    }
    const dropHandler = e => {
        e.stopPropagation();
        e.preventDefault();
        const uploadFilesArr = [];
        for (const iterator of e.dataTransfer.files) {
            const upFile = { _id: Date.now() + Math.random(), date: Date.now(), name: iterator.name, size: iterator.size, progress: 0, currentDir };
            dispatch(addUploadFile(upFile));
            uploadFilesArr.push(upFile);
        }
        dispatch(upload([...e.dataTransfer.files], currentDir, uploadFilesArr));
        setDrag(false);
    }
    const sortHandler = (name) => {
        if(sortBy === name)
            dispatch(setSortDirection(-sortDirection));
        else
            dispatch(setSortDirection(1));
        dispatch(setSortBy(name));
    }
    if(drag)
        return (
            <div className={styles.drag} onDrop={dropHandler} onDragEnter={dragHandler(true)} onDragLeave={dragHandler(false)} onDragOver={dragHandler(true)}>
                <h1>Drop some files</h1>
            </div>
        );
    return (
        <div className={styles.files} onDragEnter={dragHandler(true)} onDragLeave={dragHandler(false)} onDragOver={dragHandler(true)}>
            <div className={styles.files__header}>
                <div className={styles.files__back} 
                    style={{display: dirStack?.length || searchValue.length ? 'flex' : 'none'}}
                    onClick={()=>backHandler()}
                >
                    🠔 Back
                </div>
                {showSort && <div className={styles.files__name} onClick={() => sortHandler('name')}>Name {sortBy === 'name' && sortDirection === 1 ? <span>&nbsp;˄</span> : sortBy === 'name' ? <span>&nbsp;˅</span> : ''}</div>}
                {showSort && <div className={styles.files__date} onClick={() => sortHandler('date')}>Date {sortBy === 'date' && sortDirection === 1 ? <span>&nbsp;˄</span> : sortBy === 'date' ? <span>&nbsp;˅</span> : ''}</div>}
                {showSort && <div className={styles.files__size} onClick={() => sortHandler('size')}>Size {sortBy === 'size' && sortDirection === 1 ? <span>&nbsp;˄</span> : sortBy === 'size' ? <span>&nbsp;˅</span> : ''}</div>}
            </div>
            {!files?.length && !uploadFile?.length &&
                <div className={styles.files__empty}>
                    <img width={200} height={200} src={EmptyFolder} alt="EmptyFolder" />
                    <h1>Empty</h1>
                </div>
            }
            {files?.map(file => <File key={file._id} file={file}/>)}
            {uploadFile?.map(file => file.currentDir === currentDir && <UploadFile key={file._id} file={file}/>)}
        </div>
    );
}