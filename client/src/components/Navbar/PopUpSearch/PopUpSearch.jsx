import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFile } from "../../../actions/file";
import styles from '../../Disk/PopUp/popup.module.scss';

export const PopUpSearch= ({popUpSearchDisplay, setPopUpDisplay}) => {
    const {searchFile, getFiles} = useFile();
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const currentDir = useSelector(state => state.files.currentDir);
    const closePopupHandler = e => {
        setPopUpDisplay(false);
    }
    const searchHandler = () => {
        if(search.length)
            dispatch(searchFile(search, currentDir));
        else
            dispatch(getFiles(currentDir));
        setPopUpDisplay(false);
    }
    return (
        <div style={{display: popUpSearchDisplay ? 'flex' : 'none'}} className={styles.popup} onDragOver={e => e.stopPropagation()} onDragLeave={e => e.stopPropagation()} onDragEnter={e => e.stopPropagation()} onDrop={e => e.stopPropagation()} onMouseDown={closePopupHandler}>
            <div className={styles.popup__body} onMouseDown={e => e.stopPropagation()}>
                <div className={styles.popup__name}><h2>Search</h2></div>
                <div className={styles.popup__input}>
                    <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Enter file name..."/>
                </div>
                <div className={styles.popup__btns}>
                    <button onClick={()=>searchHandler()}>Search</button>
                    <button onClick={closePopupHandler}>Close</button>
                </div>
            </div>
        </div>
    );
}