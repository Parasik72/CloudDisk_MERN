import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '../../../actions/user';
import styles from '../../Disk/PopUp/popup.module.scss';

export const PopUpClean= ({setPopUpDisplay}) => {
    const {cleanDisk} = useUser();
    const user = useSelector(state => state.user.user);
    const [checkEmail, setCheckEmail] = useState('');
    const dispatch = useDispatch();
    const closePopupHandler = e => {
        setPopUpDisplay(false)
        setCheckEmail('');
    }
    const changingHandler = () => {
        if(checkEmail === user.email){
            dispatch(cleanDisk());
            setPopUpDisplay(false)
            setCheckEmail('');
        } else
            alert("Your input must be equal to your email.");
    }
    return (
        <div className={styles.popup} onMouseDown={closePopupHandler} >
            <div className={styles.popup__body} onMouseDown={e => e.stopPropagation()}>
                <div className={styles.popup__name}><h2>Clean disk</h2></div>
                <div className={styles.popup__input}>
                    <input value={checkEmail} onChange={e => setCheckEmail(e.target.value)} type="text" placeholder="Enter your email..."/>
                </div>
                <div className={styles.popup__btns}>
                    <button onClick={()=>changingHandler()}>Clean</button>
                    <button onClick={closePopupHandler}>Close</button>
                </div>
            </div>
        </div>
    );
}