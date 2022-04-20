import React, {useState} from "react";
import ReactModal from "react-modal";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../stylesheets/ProfileDialog.css";
import md5 from "md5";
import {useStateContext} from "../contexts/StateContextProvider";

export const ProfileDialog = (props) => {
    const {user, setUser} = useStateContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userError, setUserError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showLogin, setShowLogin] = useState(true);

    const checkUser = async () => {
        const res = await fetch(`http://localhost:8080/user/checkUser`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password}),
        });

        if (showLogin) {
            if (await res.json() === true)  await login();
            else  setUserError("User doesn't exist!");
        }
        else {
            if (await res.json() === true)  setUserError("Username already exists!");
            else    await register();
        }
    }

    const login = async () => {
        const res = await fetch(`http://localhost:8080/user/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password}),
        });

        let userObject = await res.json();

        if(userObject.password == "invalid")
            setPasswordError("Incorrect Password!");

        else {
            setUser(userObject);
            localStorage.setItem('user', JSON.stringify(userObject));
            props.onHide();
        }
    }

    const register = async () => {
        const res = await fetch(`http://localhost:8080/user/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password}),
        });

        let userObject = await res.json();

        if (userObject != null) {
            setUser(userObject);
            localStorage.setItem('user', JSON.stringify(userObject));
            props.onHide();
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setUserError('');
        setPasswordError('');
        if (username === "") {
            setUserError("Please enter a username.");
            return;
        }
        if (password === "") {
            setPasswordError("Please enter a password." );
            return;
        }
        checkUser();
    };

    const handleDialogSwitch = () => {
        setUserError('');
        setPasswordError('');
        setShowLogin(!showLogin);
    }

    return (
        <ReactModal
            isOpen={props.show}
            onRequestClose={() => props.onHide()}
            className="profileModal"
            overlayClassName="profileOverlay"
        >
            <div class="profileDialogContainer">
                <h1 class="appTitle">TutoRate</h1>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <label className="profileFormLabel">
                        Username
                        <input
                            className="inputProfileInfo"
                            name="email"
                            type="text"
                            onChange={(event) => setUsername(event.target.value)}
                        />
                        <p className="error">{userError}</p>
                    </label>
                    <label class="profileFormLabel">
                        Password
                        <input
                            class="inputProfileInfo"
                            name="password"
                            type="password"
                            autoComplete="off"
                            onChange={(event) => setPassword(md5(event.target.value))}
                        />
                        <p class="error">{passwordError}</p>
                    </label>
                    <input
                        type="submit"
                        onSubmit={(event) => handleSubmit(event)}
                        id="profileFormSubmit"
                        hidden
                    />
                </form>
                <label class="submitButton" for="profileFormSubmit">
                    {showLogin ? "Log In" : "Sign Up"}
                </label>
                <div class="dialogSwitchButtonContainer">
                    <h5 class="promptText">{showLogin ? "Don't have an account?" : "Have an account?"}</h5>
                    &nbsp;
                    &nbsp;
                    <button
                        class="dialogSwitchButton"
                        onClick={() => handleDialogSwitch()}>
                        {showLogin ? "Sign up" : "Log in"}
                    </button>
                </div>
            </div>
        </ReactModal>
    );
}