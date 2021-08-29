import styles from './profile.module.scss';
import Avatar from '../../assets/img/Avatar.png'
import ChangeAvatar from '../../assets/img/ChangeAvatar.png'
import {useDispatch, useSelector} from 'react-redux';
import { useEffect, useState } from 'react';
import { hideSearch } from '../../reducers/appReducer';
import { useUser } from '../../actions/user';
import { PopUpUsername } from './PopUpUsername/PopUpUsername';
import { PopUpEmail } from './PopUpEmail/PopUpEmail';
import { PopUpClean } from './PopUpClean/PopUpClean';

function fileSize(size) {
    if(size === 0)
        return '0 B'
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

export const Profile = () => {
    const [popUpDisplayUsername, setPopUpDisplayUsername] = useState(false);
    const [popUpDisplayEmail, setPopUpDisplayEmail] = useState(false);
    const [popUpDisplayClean, setPopUpDisplayClean] = useState(false);
    const {changeAvatar} = useUser();
    const user = useSelector(state => state.user.user);
    const avatar = user.avatar ? user.avatar : Avatar;
    const dispatch = useDispatch();
    const changeHandler = e => {
        const file = e.target.files;
        if(file.length)
            dispatch(changeAvatar(file[0]));
    }
    useEffect(()=> {
        dispatch(hideSearch());
    },[dispatch]);
    return (
        <>
        <div className={styles.profile}>
            <div className={styles.profile__top}>
                <div className={styles.profile__avatar} onClick={() => document.getElementById('changeAvatar').click()}>
                    <img width={100} height={100} className={styles.profile__avatar_changeImg} src={ChangeAvatar} alt="ChangeAvatar" />
                    <img width={100} height={100} src={avatar} alt="Avatar" />
                    <input onChange={changeHandler} type="file" id="changeAvatar" accept="image/*" />
                </div>
                <div className={styles.profile__info}>
                    <div className={styles.profile__info__item}>
                        <h2><span>Username:</span> {user.username ? user.username : user.email}</h2>
                        <div className={styles.profile__btn}><button onClick={() => setPopUpDisplayUsername(true)}>Change username</button></div>
                    </div>
                    <div className={styles.profile__info__item}>
                        <h2><span>Email:</span> {user.email}</h2>
                        <div className={styles.profile__btn}><button onClick={() => setPopUpDisplayEmail(true)}>Change email</button></div>
                    </div>
                </div>
            </div>
           <div className={styles.profile__item}><h3><span>Disk space:</span> {fileSize(user.diskSpace)}</h3></div>
           <div className={styles.profile__item}><h3><span>Used space:</span> {fileSize(user.usedSpace)}</h3></div>
           <div className={styles.profile__item}><div className={styles.profile__btn}><button onClick={() => setPopUpDisplayClean(true)} className={styles.profile__btn_clear}>Clean disk</button></div></div>
        </div>
        {popUpDisplayUsername && <PopUpUsername setPopUpDisplay={setPopUpDisplayUsername}/>}
        {popUpDisplayEmail && <PopUpEmail setPopUpDisplay={setPopUpDisplayEmail}/>}
        {popUpDisplayClean && <PopUpClean setPopUpDisplay={setPopUpDisplayClean}/>}
        </>
    );
}