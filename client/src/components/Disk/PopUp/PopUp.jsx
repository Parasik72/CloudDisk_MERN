import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFile } from '../../../actions/file';
import { hidePopUp } from '../../../reducers/fileReducer';
import styles from './popup.module.scss';

export const PopUp = () => {
    const currentDir = useSelector(state => state.files.currentDir);
    const {createDir} = useFile();
    const [dirName, setDirName] = useState('');
    const popUpDisplay = useSelector(state => state.files.popUpDisplay);
    const dispatch = useDispatch();
    const createHandler = () => {
        dispatch(createDir(dirName, 'dir', currentDir));
        dispatch(hidePopUp());
        setDirName('');
    }
    const closePopupHandler = e => {
        dispatch(hidePopUp());
        setDirName('');
    }
    return (
        <div className={styles.popup} onMouseDown={closePopupHandler} style={{display: popUpDisplay ? 'flex' : 'none'}}>
            <div className={styles.popup__body} onMouseDown={e => e.stopPropagation()}>
                <div className={styles.popup__name}><h2>Creating folder</h2></div>
                <div className={styles.popup__input}>
                    <input value={dirName} onChange={e => setDirName(e.target.value)} type="text" placeholder="Enter folder name..."/>
                </div>
                <div className={styles.popup__btns}>
                    <button onClick={()=>createHandler()}>Create</button>
                    <button onClick={closePopupHandler}>Close</button>
                </div>
            </div>
        </div>
    );
}