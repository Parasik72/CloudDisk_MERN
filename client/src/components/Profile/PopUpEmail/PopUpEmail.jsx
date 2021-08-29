import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '../../../actions/user';
import styles from '../../Disk/PopUp/popup.module.scss';

export const PopUpEmail = ({setPopUpDisplay}) => {
    const {changeEmail} = useUser();
    const user = useSelector(state => state.user.user);
    const [newEmail, setNewEmail] = useState(user.email ? user.email : '');
    const dispatch = useDispatch();
    const closePopupHandler = e => {
        setPopUpDisplay(false)
        setNewEmail('');
    }
    const changingHandler = () => {
        dispatch(changeEmail(newEmail));
        setPopUpDisplay(false)
        setNewEmail('');
    }
    return (
        <div className={styles.popup} onMouseDown={closePopupHandler} >
            <div className={styles.popup__body} onMouseDown={e => e.stopPropagation()}>
                <div className={styles.popup__name}><h2>Changing email</h2></div>
                <div className={styles.popup__input}>
                    <input value={newEmail} onChange={e => setNewEmail(e.target.value)} type="text" placeholder="Enter new email..."/>
                </div>
                <div className={styles.popup__btns}>
                    <button onClick={()=>changingHandler()}>Change</button>
                    <button onClick={closePopupHandler}>Close</button>
                </div>
            </div>
        </div>
    );
}