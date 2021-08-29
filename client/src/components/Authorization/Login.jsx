import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useUser } from '../../actions/user';
import styles from './authorization.module.scss';

export const Login = () => {
    const {login} = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const submitHandler = () => {
        dispatch(login(email, password));
    }
    return (
        <div className={styles.authorization}>
            <div className={styles.authorization__block}>
                <h1>Login</h1>
                <input value={email} onChange={e => setEmail(e.target.value)} className={styles.authorization__input} type="text" placeholder="Enter email" />
                <input value={password} onChange={e => setPassword(e.target.value)} className={styles.authorization__input} type="password" placeholder="Enter password"/>
                <button className={styles.authorization__btn} onClick={() => submitHandler()}>Submit</button>
            </div>
        </div>
    );
}