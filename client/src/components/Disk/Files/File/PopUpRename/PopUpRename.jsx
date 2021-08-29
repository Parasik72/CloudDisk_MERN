import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFile } from '../../../../../actions/file';
import styles from '../../../PopUp/popup.module.scss';


export const PopUpRename = ({file, setPopUpDisplay}) => {
    const {renameFile} = useFile();
    const [newFileName, setNewFileName] = useState(file.name);
    const dispatch = useDispatch();
    const closePopupHandler = e => {
        setPopUpDisplay(false)
        setNewFileName('');
    }
    const renameHandler = () => {
        dispatch(renameFile(file._id, newFileName));
        setPopUpDisplay(false)
    }
    return (
        <div className={styles.popup} onDragOver={e => e.stopPropagation()} onDragLeave={e => e.stopPropagation()} onDragEnter={e => e.stopPropagation()} onDrop={e => e.stopPropagation()} onMouseDown={closePopupHandler}>
            <div className={styles.popup__body} onMouseDown={e => e.stopPropagation()}>
                <div className={styles.popup__name}><h2>Rename file</h2></div>
                <div className={styles.popup__input}>
                    <input value={newFileName} onChange={e => setNewFileName(e.target.value)} type="text" placeholder="Enter new name..."/>
                </div>
                <div className={styles.popup__btns}>
                    <button onClick={()=>renameHandler()}>Change name</button>
                    <button onClick={closePopupHandler}>Close</button>
                </div>
            </div>
        </div>
    );
}