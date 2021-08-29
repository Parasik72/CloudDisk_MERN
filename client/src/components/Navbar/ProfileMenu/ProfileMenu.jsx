import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useUser } from '../../../actions/user';
import { hideProfileMenu } from '../../../reducers/appReducer';
import styles from './profilemenu.module.scss';

export const ProfileMenu = ({setPopUpSearchDisplay}) => {
    const {logout} = useUser();
    const dispatch = useDispatch();
    const displayProfileMenu = useSelector(state => state.app.displayProfileMenu);
    const clickHandler = e => {
        e.stopPropagation();
        dispatch(hideProfileMenu());
    }
    const logoutHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(hideProfileMenu());
        dispatch(logout());
    }
    const searchHandler = e => {
        e.preventDefault();
        setPopUpSearchDisplay(true);
    }
    return (
        <div className={styles.profileMenu} style={{display: displayProfileMenu ? 'block' : 'none'}}>
            <NavLink to="/profile" onClick={clickHandler} className={styles.profileMenu__item}><h4>View profile</h4></NavLink>
            <NavLink to="/" onClick={clickHandler} className={styles.profileMenu__item}><h4>Disk</h4></NavLink>
            <a href="/" className={styles.profileMenu__item} onClick={searchHandler}><h4>Search</h4></a>
            <a href="/" className={styles.profileMenu__item} onClick={logoutHandler}><h4>Logout</h4></a>
        </div>
    );
}