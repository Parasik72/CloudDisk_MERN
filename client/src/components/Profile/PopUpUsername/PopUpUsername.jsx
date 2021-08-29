import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '../../../actions/user';
import styles from '../../Disk/PopUp/popup.module.scss';

export const PopUpUsername = ({setPopUpDisplay}) => {
    const {changeUsername} = useUser();
    const user = useSelector(state => state.user.user);
    const [newUsername, setNewUsername] = useState(user.username ? user.username : '');
    const dispatch = useDispatch();
    const closePopupHandler = e => {
        setPopUpDisplay(false)
        setNewUsername('');
    }
    const changingHandler = () => {
        dispatch(changeUsername(newUsername));
        setPopUpDisplay(false)
        setNewUsername('');
    }
    return (
        <div className={styles.popup} onMouseDown={closePopupHandler} >
            <div className={styles.popup__body} onMouseDown={e => e.stopPropagation()}>
                <div className={styles.popup__name}><h2>Changing username</h2></div>
                <div className={styles.popup__input}>
                    <input value={newUsername} onChange={e => setNewUsername(e.target.value)} type="text" placeholder="Enter new username..."/>
                </div>
                <div className={styles.popup__btns}>
                    <button onClick={()=>changingHandler()}>Change</button>
                    <button onClick={closePopupHandler}>Close</button>
                </div>
            </div>
        </div>
    );
}