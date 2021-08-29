import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useFile } from '../../actions/file';
import Logo from '../../assets/img/Logo.png'
import Avatar from '../../assets/img/Avatar.png'
import { hideProfileMenu, setLoadingOn, showProfileMenu } from '../../reducers/appReducer';
import { setSearch, toRoot } from '../../reducers/fileReducer';
import {ProfileMenu} from './ProfileMenu/ProfileMenu';
import styles from './navbar.module.scss';
import { PopUpSearch } from './PopUpSearch/PopUpSearch';

export const Navbar = ({ready}) => {
    const [searchTimeOut, setSearchTimeout] = useState(null);
    const [popUpSearchDisplay, setPopUpSearchDisplay] = useState(false);
    const searchValue = useSelector(state => state.files.searchValue);
    const displaySearch = useSelector(state => state.app.displaySearch);
    const {searchFile, getFiles} = useFile();
    const isAuth = useSelector(state => state.user.isAuth);
    const currentDir = useSelector(state => state.files.currentDir);
    const displayProfileMenu = useSelector(state => state.app.displayProfileMenu);
    const user = useSelector(state => state.user.user);
    const avatar = user.avatar ? user.avatar : Avatar;
    const dispatch = useDispatch();
    const searchHandler = e => {
        dispatch(setSearch(e.target.value));
        if(searchTimeOut)
            clearTimeout(searchTimeOut);
        if(e.target.value.length){
            dispatch(setLoadingOn());
            setSearchTimeout(setTimeout(value => {
                dispatch(searchFile(value, currentDir));
            }, 500, e.target.value));
        }else
            dispatch(getFiles(currentDir));
    }
    const avatarHandler = e => {
        e.stopPropagation();
        displayProfileMenu ? dispatch(hideProfileMenu()) : dispatch(showProfileMenu());
    }
    const logoHandler = () => {
        dispatch(toRoot());
    }
    return (
        <>
        <div className={styles.navbar}>
            <div className={styles.navbar__wrap}>
                <div className={styles.navbar__clear} >
                    <NavLink onClick={() => logoHandler()} className={styles.navbar__clear} to="/">
                        <div className={styles.navbar__items}>
                            <img width={60} height={40} src={Logo} alt="Logo" />
                            <h1>Cloud disk</h1>
                        </div>
                    </NavLink>
                    {isAuth && displaySearch && <div className={styles.navbar__search} onClick={e => {e.stopPropagation(); e.preventDefault()}}>
                        <input value={searchValue} onClick={() => dispatch(hideProfileMenu())} onChange={searchHandler} type="text" placeholder="Search..." />
                    </div>}
                </div>
                {ready && <div className={styles.navbar__items}>
                    {!isAuth && <NavLink to="/login">Sign in</NavLink>}
                    {!isAuth && <NavLink to="/registration">Sign up</NavLink>}
                    {isAuth && <div onClick={avatarHandler} className={styles.navbar__avatar}><img width={40} height={40} src={avatar} alt="Avatar" /></div>}
                </div>}
                <ProfileMenu setPopUpSearchDisplay={setPopUpSearchDisplay}/>
            </div>
        </div>
        <PopUpSearch popUpSearchDisplay={popUpSearchDisplay} setPopUpDisplay={setPopUpSearchDisplay} />
        </>
    );
}