import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFile } from "../../../actions/file";
import { setLoadingOn } from "../../../reducers/appReducer";
import { setSearch } from "../../../reducers/fileReducer";
import styles from '../../Disk/PopUp/popup.module.scss';

export const PopUpSearch= ({popUpSearchDisplay, setPopUpDisplay}) => {
    const searchValue = useSelector(state => state.files.searchValue);
    const {searchFile, getFiles} = useFile();
    const [searchVal, setSearchVal] = useState(searchValue);
    const dispatch = useDispatch();
    const currentDir = useSelector(state => state.files.currentDir);
    const closePopupHandler = e => {
        setPopUpDisplay(false);
    }
    const searchHandler = () => {
        dispatch(setLoadingOn());
        dispatch(setSearch(searchVal));
        if(searchVal.length)
            dispatch(searchFile(searchVal, currentDir));
        else
            dispatch(getFiles(currentDir));
        setPopUpDisplay(false);
    }
    return (
        <div style={{display: popUpSearchDisplay ? 'flex' : 'none'}} className={styles.popup} onDragOver={e => e.stopPropagation()} onDragLeave={e => e.stopPropagation()} onDragEnter={e => e.stopPropagation()} onDrop={e => e.stopPropagation()} onMouseDown={closePopupHandler}>
            <div className={styles.popup__body} onMouseDown={e => e.stopPropagation()}>
                <div className={styles.popup__name}><h2>Search</h2></div>
                <div className={styles.popup__input}>
                    <input value={searchVal} onChange={e => setSearchVal(e.target.value)} type="text" placeholder="Enter file name..."/>
                </div>
                <div className={styles.popup__btns}>
                    <button onClick={()=>searchHandler()}>Search</button>
                    <button onClick={closePopupHandler}>Close</button>
                </div>
            </div>
        </div>
    );
}