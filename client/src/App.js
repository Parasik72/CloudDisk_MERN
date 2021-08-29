import React, { useEffect } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import { Login } from "./components/Authorization/Login";
import { Registatration } from "./components/Authorization/Registration";
import { Disk } from "./components/Disk/Disk";
import styles from './app.module.scss';
import { Navbar } from "./components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "./actions/user";
import { Profile } from "./components/Profile/Profile";
import { hideProfileMenu } from "./reducers/appReducer";

function App() {
    const {auth, ready} = useUser();
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.user.isAuth);
    useEffect(() => {
        dispatch(auth());
    },[dispatch, auth]);
    return (
        <div onClick={() => dispatch(hideProfileMenu())} className={styles.app}>
            <Navbar ready={ready}/>
            {isAuth && ready
            ?
                <Switch>
                    <Route path="/" exact>
                        <Disk />
                    </Route>
                    <Route path="/profile" exact>
                        <Profile />
                    </Route>
                    <Redirect to='/'/>
                </Switch>
            : ready ?
                <Switch>
                    <Route path="/registration" exact>
                        <Registatration />
                    </Route>
                    <Route path="/login" exact>
                        <Login />
                    </Route>
                    <Redirect to='/login'/>
                </Switch>
                :
                <div></div>
            }
            
        </div>
    );
}

export default App;
