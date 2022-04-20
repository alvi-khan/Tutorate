own.Menu>
            </Dropdown>import React, {useState} from 'react';
import '../stylesheets/ProfileBar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Dropdown } from 'react-bootstrap';
import { ProfileDialog } from './ProfileDialog';
import {TutorProfileForm} from "./TutorProfileForm";
import {useStateContext} from "../contexts/StateContextProvider";
import { useHistory } from "react-router-dom";

export const ProfileBar = () => {
    const [profileDialogShow, setProfileDialogShow] = useState(false);
    const {user, setUser} = useStateContext();
    const [formShown, setFormShown] = useState(false);
    const history = useHistory();

    const logout = async () => {
        await fetch(`http://localhost:8080/user/logout`, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
        });
        setUser({});
        localStorage.removeItem('user');
    }

    if (user.username === undefined) {
        return (
            <div className="my-auto">
                <button
                    className="profileBar"
                    onClick={() => {setProfileDialogShow(true)}}>
                    <i className="icon bi bi-person-circle" />
                    Log In
                </button>
                <div>
                    <ProfileDialog
                        show={profileDialogShow}
                        onHide={() => {setProfileDialogShow(false)}}
                    />
                </div>
            </div>
        );
    }
    else {
        return (
            <Dropdown className="my-auto profileOptions">
                <Dropdown.Toggle className="dropdown">
                    <button className="profileBar">
                        <i className="icon bi bi-person-circle" />
                        {user.username}
                    </button>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu">
                    <Dropdown.Item
                        hidden={user.role === 'tutor'}
                        className="dropdown-item"
                        onClick={() => {setFormShown(true)}}>
                        <i className="icon bi bi-pencil-square" />
                        Create Tutor Profile
                    </Dropdown.Item>
                    <TutorProfileForm show={formShown} onHide={() => setFormShown(false)}/>
                    <Dropdown.Item
                        hidden={user.role === 'tutor'}
                        className="dropdown-item"
                        onClick={() => {setFormShown(true)}}>
                        <i className="icon bi bi-pencil-square" />
                        Edit Profile
                    </Dropdown.Item> */}
                    <Dropdown.Item
                        hidden={user.role === 'user'}
                        className="dropdown-item"
                        onClick={() => {history.push("/" + user.tutor.id);}}>
                        <i className="icon bi bi-person-circle" />
                        View Tutor Profile
                    </Dropdown.Item>
                    <Dropdown.Item
                        className="dropdown-item"
                        onClick={() => logout()}>
                        <i className="icon bi bi-box-arrow-left" />
                        Log out
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

        );
    }
}
